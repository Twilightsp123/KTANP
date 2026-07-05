import { AIProvider } from '../AIGateway';
import { PuzzleData } from '../../types/schema';

const SYSTEM_PROMPT = `
You are a game level designer. Your task is to generate a custom puzzle level based on the user's request.
You MUST output ONLY valid JSON that matches the following schema, without markdown formatting or code blocks, just raw JSON.

Schema:
{
  "id": "string",
  "title": "string",
  "instruction_manual": "string (markdown format)",
  "mechanics": {
    "grid_width": "number",
    "grid_height": "number",
    "rules": [
      {
        "trigger": "ON_START | ON_STEP | ON_COLLISION",
        "conditions": [
          { "subject": "SELF|TARGET|GLOBAL", "property": "string", "operator": "==|!=|>|<", "value": "any" }
        ],
        "actions": [
          { "type": "MOVE|DESTROY|WIN_GAME|LOSE_GAME", "payload": "any" }
        ]
      }
    ]
  },
  "entities": [
    {
      "id": "string",
      "type": "string (e.g. Player, Box, Wall, Goal)",
      "position": { "x": "number", "y": "number" },
      "properties": { "color": "string (hex code)" }
    }
  ]
}

Important Rules:
- The player should usually have type 'Player' and color '#4ade80'
- Goals should usually have type 'Goal' and color '#facc15'
- Include an instruction manual that explains the custom mechanics
- Make sure coordinates fit within grid_width and grid_height
- Output MUST be valid parseable JSON. Do not include \`\`\`json blocks.
`;

export class DeepSeekProvider implements AIProvider {
  async generatePuzzle(prompt: string, apiKey: string): Promise<PuzzleData> {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' } // Force JSON mode
      })
    });

    if (!response.ok) {
      throw new Error(\`DeepSeek API error: \${response.statusText}\`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    // Fallback: cleanup if the model still wrapped in markdown despite instructions
    if (content.startsWith('\`\`\`json')) {
      content = content.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    }
    
    try {
      return JSON.parse(content) as PuzzleData;
    } catch (e) {
      console.error("Failed to parse JSON:", content);
      throw new Error("Failed to parse AI response into PuzzleData JSON");
    }
  }
}
