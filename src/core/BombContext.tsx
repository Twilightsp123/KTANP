import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AILogger } from './AILogger';

interface BombContextType {
  timeLeft: number;
  status: 'IDLE' | 'RUNNING' | 'EXPLODED' | 'DEFUSED';
  deductTime: (seconds: number, reason: string) => void;
  startBomb: () => void;
}

const BombContext = createContext<BombContextType | undefined>(undefined);

const INITIAL_TIME = 180; // 3 minutes

export const BombProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [status, setStatus] = useState<'IDLE' | 'RUNNING' | 'EXPLODED' | 'DEFUSED'>('IDLE');
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);

  useEffect(() => {
    const bc = new BroadcastChannel('boombanana_bomb');
    setChannel(bc);

    bc.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'SYNC_TIME') setTimeLeft(payload.timeLeft);
      if (type === 'SYNC_STATUS') {
        setStatus(payload.status);
        if (payload.status === 'RUNNING' && payload.timeLeft) {
            setTimeLeft(payload.timeLeft);
        }
      }
    };

    return () => bc.close();
  }, []);

  // Timer tick (Only one tab needs to drive this ideally, but running it on both is fine for a prototype if they are roughly in sync)
  useEffect(() => {
    if (status !== 'RUNNING') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus('EXPLODED');
          AILogger.log('GAME_OVER', { reason: 'timeout' });
          if (channel) channel.postMessage({ type: 'SYNC_STATUS', payload: { status: 'EXPLODED' } });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, channel]);

  const startBomb = () => {
    setStatus('RUNNING');
    setTimeLeft(INITIAL_TIME);
    AILogger.log('GAME_START', { time_limit: INITIAL_TIME });
    if (channel) {
      channel.postMessage({ type: 'SYNC_STATUS', payload: { status: 'RUNNING', timeLeft: INITIAL_TIME } });
    }
  };

  const deductTime = (seconds: number, reason: string) => {
    if (status !== 'RUNNING') return;
    
    AILogger.log('PENALTY', { penalty_seconds: seconds, reason });
    
    setTimeLeft(prev => {
      const newTime = Math.max(0, prev - seconds);
      if (channel) channel.postMessage({ type: 'SYNC_TIME', payload: { timeLeft: newTime } });
      
      if (newTime === 0) {
        setStatus('EXPLODED');
        AILogger.log('GAME_OVER', { reason: 'timeout_due_to_penalty' });
        if (channel) channel.postMessage({ type: 'SYNC_STATUS', payload: { status: 'EXPLODED' } });
      }
      return newTime;
    });
  };

  return (
    <BombContext.Provider value={{ timeLeft, status, deductTime, startBomb }}>
      {children}
    </BombContext.Provider>
  );
};

export const useBomb = () => {
  const context = useContext(BombContext);
  if (!context) throw new Error('useBomb must be used within a BombProvider');
  return context;
};
