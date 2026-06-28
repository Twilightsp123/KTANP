import React, { useState, useEffect } from 'react';
import { useCommunication } from '../../core/CommunicationContext';
import { useBomb } from '../../core/BombContext';
import { AILogger } from '../../core/AILogger';
import './Waveform.css';
import '../../components/FloatingComms.css';

type LightColor = 'purple' | 'yellow' | 'cyan';
type Level = 1 | 2 | 3;

interface WaveTarget {
  color: LightColor;
  amp: Level;
  freq: Level;
}

// 3 predefined stages
const TARGETS: WaveTarget[] = [
  { color: 'purple', amp: 1, freq: 1 }, // Low Amp, Low Freq
  { color: 'yellow', amp: 2, freq: 3 }, // Med Amp, High Freq
  { color: 'cyan', amp: 3, freq: 2 },   // High Amp, Med Freq
];

const generateWavePath = (ampLevel: Level, freqLevel: Level, width: number, height: number) => {
  const ampMult = [0, 20, 50, 80][ampLevel];
  const freqMult = [0, 0.02, 0.05, 0.1][freqLevel];
  const midY = height / 2;
  
  let path = `M 0 ${midY}`;
  for (let x = 0; x <= width; x += 2) {
    const y = midY + Math.sin(x * freqMult) * ampMult;
    path += ` L ${x} ${y}`;
  }
  return path;
};

export const WaveformTerminal: React.FC = () => {
  const { deductTime } = useBomb();
  const { messages, sendMessage } = useCommunication();
  
  const [stage, setStage] = useState(0);
  const [amp, setAmp] = useState<Level>(2);
  const [freq, setFreq] = useState<Level>(2);
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'ERROR' | 'SUCCESS'>('IDLE');

  const currentTarget = TARGETS[stage];
  const isComplete = stage >= TARGETS.length;

  useEffect(() => {
    if (!isComplete) {
      AILogger.log('PUZZLE_INIT', { 
        puzzle: 'WaveformCalibration', 
        stage: stage + 1,
        light_color: currentTarget.color 
      });
    }
  }, [stage, isComplete]);

  const handleLock = () => {
    if (status !== 'IDLE' || isComplete) return;

    if (amp === currentTarget.amp && freq === currentTarget.freq) {
      AILogger.log('ACTION', { role: 'OBSERVER', type: 'CALIBRATE', stage: stage + 1, result: 'SUCCESS' });
      
      if (stage + 1 === TARGETS.length) {
        setStatus('SUCCESS');
        AILogger.log('ACTION', { role: 'OBSERVER', type: 'PUZZLE_SOLVED' });
      } else {
        setStage(s => s + 1);
      }
    } else {
      setStatus('ERROR');
      AILogger.log('ACTION', { role: 'OBSERVER', type: 'CALIBRATE', result: 'ERROR', penalty: 10 });
      deductTime(10, 'WRONG_CALIBRATION');
      setTimeout(() => setStatus('IDLE'), 800);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim(), 'TEXT', 'OBSERVER');
    setInputText('');
  };

  return (
    <div className="signal-grid-layout">
      {/* PUZZLE AREA */}
      <div className="terminal-puzzle waveform-terminal">
        
        {!isComplete && (
          <div className={`status-light color-${currentTarget.color}`}>
            <div className="light-core"></div>
          </div>
        )}

        <div className={`puzzle-status status-${status.toLowerCase()}`}>
          {isComplete ? 'ALL STAGES CLEARED' : status === 'IDLE' ? `STAGE ${stage + 1} / 3 AWAITING LOCK` : status}
        </div>

        <div className="oscilloscope">
          <svg width="400" height="200" className={`wave-svg ${isComplete ? 'cleared' : ''}`}>
            {/* Grid lines */}
            <path d="M 0 100 L 400 100" stroke="#004400" strokeWidth="1" strokeDasharray="5,5" />
            <path d="M 200 0 L 200 200" stroke="#004400" strokeWidth="1" strokeDasharray="5,5" />
            
            {/* The Sine Wave */}
            <path 
              d={generateWavePath(amp, freq, 400, 200)} 
              fill="none" 
              stroke={isComplete ? "#0f0" : "var(--color-neon-blue)"} 
              strokeWidth="4" 
              className="glowing-path"
            />
          </svg>
        </div>

        <div className="knobs-container">
          <div className="knob-group">
            <label>AMPLITUDE (振幅)</label>
            <div className="knob-controls">
              <button onClick={() => setAmp(Math.max(1, amp - 1) as Level)} disabled={amp === 1 || isComplete}>◀</button>
              <div className="knob-value">{['LOW', 'MED', 'HIGH'][amp - 1]}</div>
              <button onClick={() => setAmp(Math.min(3, amp + 1) as Level)} disabled={amp === 3 || isComplete}>▶</button>
            </div>
          </div>
          
          <button className="physical-button lock-btn" onClick={handleLock} disabled={isComplete || status !== 'IDLE'}>
            LOCK
          </button>

          <div className="knob-group">
            <label>FREQUENCY (频率)</label>
            <div className="knob-controls">
              <button onClick={() => setFreq(Math.max(1, freq - 1) as Level)} disabled={freq === 1 || isComplete}>◀</button>
              <div className="knob-value">{['LOW', 'MED', 'HIGH'][freq - 1]}</div>
              <button onClick={() => setFreq(Math.min(3, freq + 1) as Level)} disabled={freq === 3 || isComplete}>▶</button>
            </div>
          </div>
        </div>

      </div>

      {/* OBSERVER COMMS */}
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
          <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Type message..." className="scifi-input" />
          <button type="submit" className="physical-button" style={{height: '100%', width: '80px', fontSize: '1rem'}}>SEND</button>
        </form>
      </div>
    </div>
  );
};
