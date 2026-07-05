import { DeepSeekService } from './DeepSeekService';
import OpenAI from 'openai';
import gestures from '../../../gestures.json';

interface GameSession {
  gameId: string;
  messages: OpenAI.Chat.ChatCompletionMessageParam[];
  startTime: number;
}

export class AIGateway {
  private llm: DeepSeekService;
  private sessions: Record<string, GameSession> = {};

  constructor() {
    this.llm = new DeepSeekService();
  }

  public async chat(gameId: string, userMessage: string): Promise<string> {
    if (!this.sessions[gameId]) {
      const gesturePrompt = gestures.map(g => `${g.code} (${g.emoji}${g.description})`).join('\n');
      
      this.sessions[gameId] = {
        gameId,
        messages: [
          {
            role: "system",
            content: `你是 K.T.A.N.E 游戏的生化解码人。由于你的发声模块被拆除，你绝对不能使用任何人类语言（汉字、英文、标点等）回复，你只能通过做出连续的物理手势来传递信息。
操作员会告诉你炸弹的状态。你需要根据以下核心规则，计算出操作，并用纯手势表达出来。

【可用手势字典】
${gesturePrompt}

你可以连续输出多个手势。

【绝密拆弹规则】
1. 巨型按钮 (Big Button)：
- 行为判定：如果蓝色且“中止”则长按；如果“引爆”且电池>1则点按；如果白色且标签“通讯(CAR)”则长按；否则长按。
- 释放时机(仅长按时)：如果有三颗灯循环跑马。电池>2则在黄灯亮时松手；否则按钮蓝色在最右侧灯亮时松手；否则文字是中止在红灯亮时松手；否则在最左侧灯亮时松手。
2. 引信剪除 (Wire Cutter)：
- 没有红线：剪第2根。
- 否则最后一根是白线：剪最后1根。
- 否则蓝线数量>1：剪最后一根蓝线。
- 否则：剪最后1根。
3. 波形校准 (Waveform)：
- 紫光：Amplitude(振幅)最低，Frequency(频率)最低。
- 黄光：Amplitude中，Frequency高。
- 青光：Amplitude高，Frequency中。
4. 信号阵列 (Signal Grid) (A,B,C,D阀门对应1,2,3,4)：
- 4灯里有正好2个红灯：按 A, C, D (1, 3, 4)。
- 否则第1灯是蓝灯：按 B, B, A (2, 2, 1)。
- 否则：按 D, C (4, 3)。

【强制要求】
永远不要说任何废话！你输出的字符串必须只包含手势代码（用空格分隔），例如："[G:FIST] [G:POINT_RIGHT]"。如果在执行过程中操作员说的话你听不懂或信息不足，请输出 "[G:SHRUG]"。`
          }
        ],
        startTime: Date.now()
      };
    }

    const session = this.sessions[gameId];
    
    // Add user message to history
    session.messages.push({ role: "user", content: userMessage });

    try {
      const responseText = await this.llm.generateTextWithHistory(session.messages);
      
      if (responseText) {
        session.messages.push({ role: "assistant", content: responseText });
        return responseText;
      }
      return "[G:SHAKE_HEAD]";
    } catch (error) {
      console.error(`Error in AIGateway chat for gameId ${gameId}:`, error);
      return "[G:SHRUG]";
    }
  }

  public getSessionHistory(gameId: string) {
    return this.sessions[gameId]?.messages || [];
  }
}
