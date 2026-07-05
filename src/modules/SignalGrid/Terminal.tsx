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
  const { deductTime, metaData } = useBomb();
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
        <div className="signal-grid-container" style={{ position: 'relative', marginTop: '40px' }}>
          {/* Metadata attached directly to this module like a physical plaque */}
          {metaData && (
            <div style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', background: '#222', border: '2px solid #444', padding: '5px 15px', borderRadius: '5px', display: 'flex', gap: '20px', color: 'var(--color-neon-gold)', alignItems: 'center', fontSize: '0.9rem', fontWeight: 'bold', boxShadow: '0 5px 15px rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}>
              <span>S/N: {metaData.serialNumber}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                BAT: 
                {metaData.batteries === 0 && <span style={{ opacity: 0.5 }}> NONE</span>}
                {Array.from({ length: metaData.batteries }).map((_, i) => (
                  <svg key={i} width="16" height="8" viewBox="0 0 24 12" style={{ marginLeft: '2px' }}>
                    <rect x="1" y="1" width="20" height="10" rx="1.5" fill="none" stroke="var(--color-neon-gold)" strokeWidth="1.5" />
                    <rect x="3" y="3" width="16" height="6" fill="var(--color-neon-gold)" opacity="0.8" />
                    <rect x="21" y="3.5" width="2" height="5" fill="var(--color-neon-gold)" />
                  </svg>
                ))}
              </span>
              <span>TAG: [{metaData.indicator}]</span>
            </div>
          )}
          <div className="signal-nodes">
            {puzzle.lights.map((color, i) => (
              <div key={i} className={`signal-light color-${color}`}>
                <div className="light-core"></div>
              </div>
            ))}
          </div>
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
    </div>
  );
};
