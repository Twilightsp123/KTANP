import React, { useState, useEffect } from 'react';
import { useCommunication } from '../../core/CommunicationContext';
import { useBomb } from '../../core/BombContext';
import { AILogger } from '../../core/AILogger';
import './WireCutter.css';
import '../../components/FloatingComms.css'; // For common layout classes

type WireColor = 'red' | 'blue' | 'yellow' | 'black' | 'white';
interface Wire { id: number; color: WireColor; cut: boolean; }

const generateWires = (): { wires: Wire[], targetId: number } => {
  const colors: WireColor[] = ['red', 'blue', 'yellow', 'black', 'white'];
  const numWires = Math.floor(Math.random() * 3) + 4; // 4 to 6 wires
  const wires: Wire[] = Array.from({ length: numWires }).map((_, i) => ({
    id: i,
    color: colors[Math.floor(Math.random() * colors.length)],
    cut: false
  }));

  let targetId = numWires - 1;
  const redCount = wires.filter(w => w.color === 'red').length;
  const blueWires = wires.filter(w => w.color === 'blue');
  const lastWire = wires[numWires - 1];

  if (redCount === 0) targetId = 1;
  else if (lastWire.color === 'white') targetId = numWires - 1;
  else if (blueWires.length > 1) targetId = blueWires[blueWires.length - 1].id;
  else targetId = numWires - 1;

  return { wires, targetId };
};

export const WireCutterTerminal: React.FC = () => {
  const { deductTime } = useBomb();
  const { messages, sendMessage } = useCommunication();
  const [puzzle, setPuzzle] = useState(generateWires);
  const [status, setStatus] = useState<'IDLE' | 'ERROR' | 'SUCCESS'>('IDLE');
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    AILogger.log('PUZZLE_INIT', { 
      puzzle: 'WireCutter', 
      wires: puzzle.wires.map(w => w.color), 
      target_id: puzzle.targetId 
    });
  }, [puzzle]);

  const handleCut = (wire: Wire) => {
    if (status !== 'IDLE' || wire.cut) return;

    const isCorrect = wire.id === puzzle.targetId;
    
    setPuzzle(prev => ({
      ...prev,
      wires: prev.wires.map(w => w.id === wire.id ? { ...w, cut: true } : w)
    }));

    if (!isCorrect) {
      setStatus('ERROR');
      AILogger.log('ACTION', { role: 'OBSERVER', type: 'CUT_WIRE', wire_id: wire.id, color: wire.color, result: 'ERROR', penalty: 10 });
      deductTime(10, 'WRONG_WIRE_CUT');
      setTimeout(() => setStatus('IDLE'), 1000);
    } else {
      setStatus('SUCCESS');
      AILogger.log('ACTION', { role: 'OBSERVER', type: 'CUT_WIRE', wire_id: wire.id, color: wire.color, result: 'SUCCESS' });
      AILogger.log('ACTION', { role: 'OBSERVER', type: 'PUZZLE_SOLVED' });
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
      <div className="terminal-puzzle">
        <div className={`puzzle-status status-${status.toLowerCase()}`}>
          {status === 'IDLE' ? 'AWAITING CUT...' : status}
        </div>
        
        <div className="wire-board">
          {puzzle.wires.map((wire, idx) => (
            <div key={wire.id} className="wire-row">
              <span className="wire-idx">{idx + 1}</span>
              <div 
                className={`wire-cable color-${wire.color} ${wire.cut ? 'cut' : ''}`}
                onClick={() => handleCut(wire)}
              >
                {wire.cut && <div className="spark">⚡</div>}
              </div>
            </div>
          ))}
        </div>
        
        {status === 'SUCCESS' && (
          <button className="physical-button" onClick={() => { setPuzzle(generateWires()); setStatus('IDLE'); }} style={{marginTop: '30px', width: 'auto', padding: '0 20px'}}>
            LOAD NEW MODULE
          </button>
        )}
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
