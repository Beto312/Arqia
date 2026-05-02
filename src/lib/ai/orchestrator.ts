import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface FloorPlanBriefing {
  totalArea: number;
  rooms: RoomSpec[];
  style: string;
  terrainWidth?: number;
  terrainDepth?: number;
  floors: number;
  observations?: string;
}

export interface RoomSpec {
  type: string;
  count: number;
  minArea?: number;
  notes?: string;
}

export interface GeneratedFloorPlan {
  svgData: string;
  rooms: ParsedRoom[];
  totalArea: number;
  observations: string[];
  warnings: string[];
}

export interface ParsedRoom {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  area: number;
}

export async function generateFloorPlan(
  briefing: FloorPlanBriefing
): Promise<GeneratedFloorPlan> {
  const prompt = buildFloorPlanPrompt(briefing);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    system: FLOOR_PLAN_SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  return parseFloorPlanResponse(text, briefing);
}

export async function* generateFloorPlanStream(
  briefing: FloorPlanBriefing
): AsyncGenerator<string> {
  const prompt = buildFloorPlanPrompt(briefing);

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    system: FLOOR_PLAN_SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      yield chunk.delta.text;
    }
  }
}

function buildFloorPlanPrompt(briefing: FloorPlanBriefing): string {
  const roomsList = briefing.rooms
    .map(
      (r) =>
        `- ${r.count}x ${r.type}${r.minArea ? ` (mínimo ${r.minArea}m²)` : ""}${r.notes ? ` — ${r.notes}` : ""}`
    )
    .join("\n");

  return `Gere uma planta baixa para o seguinte projeto:

**Área total:** ${briefing.totalArea}m²
**Pavimentos:** ${briefing.floors}
**Estilo:** ${briefing.style}
${briefing.terrainWidth ? `**Terreno:** ${briefing.terrainWidth}m x ${briefing.terrainDepth}m` : ""}

**Cômodos necessários:**
${roomsList}

${briefing.observations ? `**Observações:** ${briefing.observations}` : ""}

Responda EXATAMENTE no formato JSON especificado. Respeite NBR 15575 para dimensões mínimas.`;
}

function parseFloorPlanResponse(
  raw: string,
  briefing: FloorPlanBriefing
): GeneratedFloorPlan {
  const jsonMatch = raw.match(/```json\n?([\s\S]*?)\n?```/) ||
    raw.match(/\{[\s\S]*\}/);

  let data: {
    rooms?: ParsedRoom[];
    observations?: string[];
    warnings?: string[];
  } = {};

  if (jsonMatch) {
    try {
      data = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    } catch {
      data = { rooms: [], observations: [], warnings: ["Erro ao parsear resposta da IA"] };
    }
  }

  const rooms: ParsedRoom[] = data.rooms || [];
  const svgData = generateSVGFromRooms(rooms, briefing);

  return {
    svgData,
    rooms,
    totalArea: briefing.totalArea,
    observations: data.observations || [],
    warnings: data.warnings || [],
  };
}

function generateSVGFromRooms(rooms: ParsedRoom[], briefing: FloorPlanBriefing): string {
  const scale = 4;
  const padding = 40;
  const maxX = rooms.reduce((m, r) => Math.max(m, r.x + r.width), 0);
  const maxY = rooms.reduce((m, r) => Math.max(m, r.y + r.height), 0);
  const svgWidth = maxX * scale + padding * 2;
  const svgHeight = maxY * scale + padding * 2;

  const roomRects = rooms
    .map((room) => {
      const x = room.x * scale + padding;
      const y = room.y * scale + padding;
      const w = room.width * scale;
      const h = room.height * scale;
      const cx = x + w / 2;
      const cy = y + h / 2;
      return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}"
      fill="#f8f5f0" stroke="#374151" stroke-width="2" rx="1"/>
    <text x="${cx}" y="${cy - 8}" text-anchor="middle" font-size="10" fill="#374151" font-family="sans-serif" font-weight="600">${room.name}</text>
    <text x="${cx}" y="${cy + 8}" text-anchor="middle" font-size="9" fill="#6b7280" font-family="sans-serif">${room.area.toFixed(1)}m²</text>`;
    })
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
  <rect width="${svgWidth}" height="${svgHeight}" fill="#ffffff"/>
  <text x="${svgWidth / 2}" y="20" text-anchor="middle" font-size="13" fill="#374151" font-family="sans-serif" font-weight="700">
    Planta Baixa — ${briefing.totalArea}m² — ${briefing.style}
  </text>
  ${roomRects}
  <text x="${svgWidth / 2}" y="${svgHeight - 8}" text-anchor="middle" font-size="8" fill="#9ca3af" font-family="sans-serif">
    Gerado por IA — Pendente Validação Profissional
  </text>
</svg>`;
}

const FLOOR_PLAN_SYSTEM_PROMPT = `Você é um arquiteto especialista em geração computacional de plantas baixas.
Ao receber um briefing de projeto, você deve gerar o layout dos cômodos em formato JSON estruturado.

REGRAS OBRIGATÓRIAS:
1. Respeite as dimensões mínimas da NBR 15575 (ex: quarto mínimo 9m², banheiro mínimo 2.8m², sala mínimo 12m²)
2. Posicione cômodos sem sobreposição (coordenadas x,y em metros, origem no canto superior esquerdo)
3. Considere circulação (corredores de no mínimo 0.9m entre cômodos)
4. Quartos e salas devem ter janelas (orientação favorável — sul/norte para fachadas)
5. Banheiros não devem estar ao lado de cozinhas diretamente

FORMATO DE RESPOSTA (JSON obrigatório):
\`\`\`json
{
  "rooms": [
    {
      "id": "sala-01",
      "name": "Sala de Estar",
      "type": "living_room",
      "x": 0,
      "y": 0,
      "width": 5.0,
      "height": 4.0,
      "area": 20.0
    }
  ],
  "observations": ["Sala integrada com cozinha americana", "Ventilação cruzada nos quartos"],
  "warnings": ["Área do banheiro social ajustada para mínimo NBR"]
}
\`\`\`

TIPOS DE CÔMODO válidos: bedroom, master_bedroom, bathroom, kitchen, living_room, dining_room, laundry, garage, balcony, corridor, office, storage`;
