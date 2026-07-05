import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export class DeepSeekService {
    private client: OpenAI;
    private defaultModel: string;

    constructor() {
        const apiKey = process.env.DEEPSEEK_API_KEY;
        const baseURL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';
        this.defaultModel = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

        if (!apiKey) {
            throw new Error("Missing DEEPSEEK_API_KEY environment variable. Please check your .env file.");
        }

        this.client = new OpenAI({
            apiKey: apiKey,
            baseURL: baseURL,
            timeout: process.env.DEEPSEEK_TIMEOUT ? parseInt(process.env.DEEPSEEK_TIMEOUT) * 1000 : 60000,
        });
    }

    async generateText(prompt: string, systemPrompt = "You are a helpful assistant.", model?: string): Promise<string | null> {
        try {
            const response = await this.client.chat.completions.create({
                model: model || this.defaultModel,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
            });
            return response.choices[0]?.message?.content || null;
        } catch (error) {
            console.error("Error calling DeepSeek API:", error);
            throw error;
        }
    }

    async generateTextWithHistory(messages: OpenAI.Chat.ChatCompletionMessageParam[], model?: string): Promise<string | null> {
        try {
            const response = await this.client.chat.completions.create({
                model: model || this.defaultModel,
                messages: messages,
                temperature: 0.7,
            });
            return response.choices[0]?.message?.content || null;
        } catch (error) {
            console.error("Error calling DeepSeek API:", error);
            throw error;
        }
    }
}
