import React, { useState, useEffect, useRef } from 'react';
import { useCommunication } from '../../core/CommunicationContext';
import { useBomb } from '../../core/BombContext';
import { AILogger } from '../../core/AILogger';
import './BigButton.css';
import '../../components/FloatingComms.css';

type ButtonColor = 'red' | 'blue' | 'yellow' | 'white';
type ButtonText = '中止' | '引爆' | '保持' | '按压';
type LightColor = 'red' | 'blue' | 'yellow';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const BigButtonTerminal: React.FC = () => {
  const { deductTime, metaData, timeLeft } = useBomb();
  const { messages, sendMessage } = useCommunication();
  
  const [btnColor, setBtnColor] = useState<ButtonColor>('red');
  const [btnText, setBtnText] = useState<ButtonText>('引爆');
  const [lights, setLights] = useState<LightColor[]>(['red', 'red', 'red']);
  
  const [isHeld, setIsHeld] = useState(false);
  const [activeLightIdx, setActiveLightIdx] = useState<number | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'ERROR' | 'SUCCESS'>('IDLE');
  const [inputText, setInputText] = useState('');

  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cycleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pressStartTime = useRef<number>(0);

  const generatePuzzle = () => {
    const colors: ButtonColor[] = ['red', 'blue', 'yellow', 'white'];
    const texts: ButtonText[] = ['中止', '引爆', '保持', '按压'];
    const lightColors: LightColor[] = ['red', 'blue', 'yellow'];
    // Shuffle the 3 fixed colors so they always exist but in random order
    const newLights = [...lightColors].sort(() => Math.random() - 0.5);
    
    setBtnColor(colors[Math.floor(Math.random() * colors.length)]);
    setBtnText(texts[Math.floor(Math.random() * texts.length)]);
    setLights(newLights);
    
    setStatus('IDLE');
    setActiveLightIdx(null);
    setIsHeld(false);
  };

  useEffect(() => {
    generatePuzzle();
    return () => {
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (status === 'IDLE' && metaData) {
      AILogger.log('PUZZLE_INIT', { 
        puzzle: 'BigButton', 
        button_color: btnColor, 
        button_text: btnText,
        lights: lights
      });
    }
  }, [btnColor, btnText, lights, status, metaData]);

  const getExpectedAction = (): 'TAP' | 'HOLD' => {
    if (btnColor === 'blue' && btnText === '中止') return 'HOLD';
    if (btnText === '引爆' && metaData && metaData.batteries > 1) return 'TAP';
    if (btnColor === 'white' && metaData && metaData.indicator === '通讯(CAR)') return 'HOLD';
    return 'HOLD';
  };

  const getExpectedReleaseIndex = (): number => {
    if (metaData && metaData.batteries > 2) {
      return lights.indexOf('yellow');
    }
    if (btnColor === 'blue') {
      return 2;
    }
    if (btnText === '中止') {
      return lights.indexOf('red');
    }
    return 0;
  };

  const handleMouseDown = () => {
    if (status !== 'IDLE') return;
    setIsHeld(true);
    pressStartTime.current = Date.now();
    
    holdTimeoutRef.current = setTimeout(() => {
      setActiveLightIdx(0);
      let currentIdx = 0;
      
      cycleIntervalRef.current = setInterval(() => {
        currentIdx = (currentIdx + 1) % 3;
        setActiveLightIdx(currentIdx);
      }, 500);

      AILogger.log('ACTION', { role: 'OBSERVER', type: 'HOLD_START' });
    }, 500);
  };

  const handleMouseUp = () => {
    if (status !== 'IDLE' || !isHeld) return;
    setIsHeld(false);
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
    
    const pressDuration = Date.now() - pressStartTime.current;
    const isTap = pressDuration < 500;
    const expectedAction = getExpectedAction();

    let isSuccess = false;

    if (expectedAction === 'TAP') {
      if (isTap) {
        isSuccess = true;
      } else {
        deductTime(10, 'HELD_INSTEAD_OF_TAP');
        setStatus('ERROR');
      }
      setActiveLightIdx(null);
    } else {
      if (isTap) {
        deductTime(10, 'TAPPED_INSTEAD_OF_HOLD');
        setStatus('ERROR');
        setActiveLightIdx(null);
      } else {
        const expectedIndex = getExpectedReleaseIndex();
        
        setActiveLightIdx((currentIdx) => {
          if (currentIdx === expectedIndex) {
            setStatus('SUCCESS');
            AILogger.log('ACTION', { role: 'OBSERVER', type: 'BUTTON_RELEASE', result: 'SUCCESS' });
            AILogger.log('ACTION', { role: 'OBSERVER', type: 'PUZZLE_SOLVED' });
          } else {
            deductTime(10, 'RELEASED_ON_WRONG_LIGHT');
            setStatus('ERROR');
            AILogger.log('ACTION', { role: 'OBSERVER', type: 'BUTTON_RELEASE', result: 'ERROR', penalty: 10 });
            setTimeout(() => {
              setStatus('IDLE');
            }, 1000);
          }
          return null;
        });
        return;
      }
    }

    if (isSuccess) {
      setStatus('SUCCESS');
      AILogger.log('ACTION', { role: 'OBSERVER', type: 'BUTTON_RELEASE', result: 'SUCCESS' });
      AILogger.log('ACTION', { role: 'OBSERVER', type: 'PUZZLE_SOLVED' });
    } else {
      AILogger.log('ACTION', { role: 'OBSERVER', type: 'BUTTON_RELEASE', result: 'ERROR', penalty: 10 });
      setTimeout(() => {
        setStatus('IDLE');
      }, 1000);
    }
  };

  return (
    <div className="signal-grid-layout">
      <div className="terminal-puzzle big-button-terminal">
        <div className={`puzzle-status status-${status.toLowerCase()}`}>
          {status === 'SUCCESS' ? 'MODULE CLEARED' : status === 'IDLE' ? 'AWAITING INPUT' : status}
        </div>
        
        <div className="big-button-container" style={{ position: 'relative', marginTop: '40px', paddingTop: '50px' }}>
          {metaData && (
            <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', background: '#222', border: '2px solid #444', padding: '5px 15px', borderRadius: '5px', display: 'flex', gap: '20px', color: 'var(--color-neon-gold)', alignItems: 'center', fontSize: '0.9rem', fontWeight: 'bold', boxShadow: '0 5px 15px rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}>
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
          
          <div className="marquee-lights-container">
            {lights.map((color, idx) => (
              <div 
                key={idx} 
                className={`marquee-light ${activeLightIdx === idx ? `active-${color}` : `dim-${color}`}`} 
              />
            ))}
          </div>
          
          <button 
            className={`the-big-button color-${btnColor} ${isHeld ? 'held' : ''} status-${status.toLowerCase()}`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { if (isHeld) handleMouseUp(); }}
            disabled={status !== 'IDLE'}
          >
            {btnText}
          </button>
        </div>

        {status === 'SUCCESS' && (
          <button className="physical-button reset-mod-btn" onClick={generatePuzzle}>
            LOAD NEXT MODULE
          </button>
        )}
      </div>
    </div>
  );
};
