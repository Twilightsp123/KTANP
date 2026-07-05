import { PuzzleData } from '../types/schema';

export interface AIProvider {
  generatePuzzle(prompt: string, apiKey: string): Promise<PuzzleData>;
}

export class AIGateway {
  private provider: AIProvider;
  private apiKey: string;

  constructor(provider: AIProvider, apiKey: string) {
    this.provider = provider;
    this.apiKey = apiKey;
  }

  setProvider(provider: AIProvider) {
    this.provider = provider;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createPuzzle(prompt: string): Promise<PuzzleData> {
    if (!this.apiKey) {
      throw new Error("API Key is missing.");
    }
    return await this.provider.generatePuzzle(prompt, this.apiKey);
  }
}
