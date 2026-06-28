import React, { useState, useEffect } from 'react';
import { useCommunication } from '../../core/CommunicationContext';
import { useBomb } from '../../core/BombContext';
import { AILogger } from '../../core/AILogger';
import '../../components/FloatingComms.css';
import { SciFiButton } from '../../components/SciFiButton';

type LightColor = 'red' | 'blue' | 'green' | 'yellow';
type ActionButton = 'A' | 'B' | 'C' | 'D';

const generatePuzzle = () => {
  const colors: LightColor[] = ['red', 'blue', 'green', 'yellow'];
  const lights = Array.from({ length: 4 }).map(() => colors[Math.floor(Math.random() * colors.length)]);
  
  let targetSequence: ActionButton[] = ['D', 'C'];
  const redCount = lights.filter(l => l === 'red').length;
  
  if (redCount === 2) {
    targetSequence = ['A', 'C', 'D'];
  } else if (lights[0] === 'blue') {
    targetSequence = ['B', 'B', 'A'];
  }

  return { lights, targetSequence };
};

export const SignalGridTerminal: React.FC = () => {
  const { messages, sendMessage } = useCommunication();
  const { deductTime } = useBomb();
  const [puzzle, setPuzzle] = useState(generatePuzzle);
  const [inputSequence, setInputSequence] = useState<ActionButton[]>([]);
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'ERROR' | 'SUCCESS'>('IDLE');

  useEffect(() => {
    AILogger.log('PUZZLE_INIT', { puzzle: 'SignalGrid', lights: puzzle.lights, target: puzzle.targetSequence });
  }, [puzzle]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim(), 'TEXT', 'OBSERVER');
    setInputText('');
  };

  const handleButtonPress = (btn: ActionButton) => {
    if (status === 'SUCCESS' || status === 'ERROR') return;
    
    const newSeq = [...inputSequence, btn];
    setInputSequence(newSeq);

    const isWrong = newSeq.some((b, i) => b !== puzzle.targetSequence[i]);
    if (isWrong) {
      setStatus('ERROR');
      AILogger.log('ACTION', { role: 'OBSERVER', type: 'PRESS_BUTTON', value: btn, result: 'ERROR', penalty: 10 });
      deductTime(10, 'WRONG_BUTTON_PRESS');
      
      setTimeout(() => {
        setInputSequence([]);
        setStatus('IDLE');
      }, 800);
      return;
    }

    AILogger.log('ACTION', { role: 'OBSERVER', type: 'PRESS_BUTTON', value: btn, result: 'CORRECT' });

    if (newSeq.length === puzzle.targetSequence.length) {
      setStatus('SUCCESS');
      AILogger.log('ACTION', { role: 'OBSERVER', type: 'PUZZLE_SOLVED' });
    }
  };

  const handleReset = () => {
    setPuzzle(generatePuzzle());
    setInputSequence([]);
    setStatus('IDLE');
  };

  return (
    <div className="signal-grid-layout">
      {/* PUZZLE AREA */}
      <div className="puzzle-section terminal-puzzle">
        
        {/* Lights */}
        <div className="lights-container">
          {puzzle.lights.map((color, i) => (
            <div key={i} className={`signal-light color-${color}`}>
              <div className="light-core"></div>
            </div>
          ))}
        </div>

        {/* Status Screen */}
        <div className={`puzzle-status status-${status.toLowerCase()}`}>
          {status === 'IDLE' ? `SEQ: [ ${inputSequence.join(' - ')} ]` : status}
        </div>

        {/* Buttons */}
        <div className="action-buttons-container">
          {(['A', 'B', 'C', 'D'] as ActionButton[]).map(btn => (
            <button 
              key={btn} 
              className={`physical-button ${inputSequence.includes(btn) ? 'pressed' : ''}`} 
              onClick={() => handleButtonPress(btn)}
              disabled={status !== 'IDLE'}
            >
              {btn}
            </button>
          ))}
        </div>

        {status === 'SUCCESS' && (
          <div style={{ marginTop: '30px' }}>
            <SciFiButton variant="primary" onClick={handleReset}>
              INITIALIZE NEXT SEQUENCE
            </SciFiButton>
          </div>
        )}
      </div>

      {/* COMMUNICATION AREA */}
      <div className="comms-section observer-comms">
        <div className="chat-history">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.senderRole === 'OBSERVER' ? 'sent' : 'received'}`}>
              <span className="sender">[{msg.senderRole}]</span>
              <span className="content">{msg.content}</span>
            </div>
          ))}
        </div>
        <form className="chat-input-area" onSubmit={handleSend}>
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type message to DECODER..."
            className="scifi-input"
          />
          <SciFiButton type="submit">SEND</SciFiButton>
        </form>
      </div>
    </div>
  );
};
