// AILogger.ts
// Maintains a structured history of the game state for future LLM integration.

type EventType = 'GAME_START' | 'PUZZLE_INIT' | 'ACTION' | 'COMMUNICATION' | 'PENALTY' | 'GAME_OVER';

interface LogEntry {
  timestamp: number;
  type: EventType;
  payload: any;
}

class AILoggerService {
  private history: LogEntry[] = [];

  public log(type: EventType, payload: any) {
    const entry: LogEntry = {
      timestamp: Date.now(),
      type,
      payload
    };
    this.history.push(entry);
    
    // For now, we dump it to the console. 
    // In the future, this history array will be passed as context to the DeepSeek API.
    console.log(`[AI_CONTEXT] [${type}] ${JSON.stringify(payload)}`);
  }

  public getHistory() {
    return this.history;
  }
}

export const AILogger = new AILoggerService();
