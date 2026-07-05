import fs from 'fs';
import path from 'path';

interface LogEntry {
  timestamp: string;
  gameId: string;
  type: string;
  data: any;
}

export class AuditLogger {
  private logFilePath: string;

  constructor() {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }
    this.logFilePath = path.join(logDir, 'game_audit.log');
  }

  public logAction(gameId: string, type: string, data: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      gameId,
      type,
      data
    };
    
    const logString = JSON.stringify(entry) + '\n';
    
    console.log(`[AUDIT] [${entry.timestamp}] [${gameId}] ${type}`, JSON.stringify(data));
    
    fs.appendFile(this.logFilePath, logString, (err) => {
      if (err) console.error("Failed to write to audit log:", err);
    });
  }
}
