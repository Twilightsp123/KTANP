import express from 'express';
import cors from 'cors';
import { AIGateway } from './services/AIGateway';
import { AuditLogger } from './services/AuditLogger';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const aiGateway = new AIGateway();
const auditLogger = new AuditLogger();

app.post('/api/chat', async (req, res) => {
  const { gameId, message } = req.body;
  if (!gameId || !message) {
    return res.status(400).json({ error: "Missing gameId or message" });
  }

  auditLogger.logAction(gameId, "CHAT_USER", { message });
  
  try {
    const reply = await aiGateway.chat(gameId, message);
    auditLogger.logAction(gameId, "CHAT_AI", { reply });
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: "AI processing failed" });
  }
});

app.post('/api/log', (req, res) => {
  const { gameId, type, data } = req.body;
  if (!gameId || !type) {
    return res.status(400).json({ error: "Missing gameId or type" });
  }

  auditLogger.logAction(gameId, type, data);
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Boombanana Backend Server is running on port ${port}`);
});
