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
  const { deductTime, metaData } = useBomb();
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
        
        <div className="wire-container" style={{ position: 'relative', marginTop: '40px' }}>
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
    </div>
  );
};
