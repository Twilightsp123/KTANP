import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AILogger } from './AILogger';

export interface BombMetaData {
  serialNumber: string;
  batteries: number;
  indicator: string;
}

interface BombContextType {
  gameId: string | null;
  timeLeft: number;
  status: 'IDLE' | 'RUNNING' | 'EXPLODED' | 'DEFUSED';
  metaData: BombMetaData | null;
  deductTime: (seconds: number, reason: string) => void;
  startBomb: () => void;
}

const BombContext = createContext<BombContextType | undefined>(undefined);

const INITIAL_TIME = 180; // 3 minutes

const generateMetaData = (): BombMetaData => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const randomChar = (str: string) => str[Math.floor(Math.random() * str.length)];
  const serialNumber = `${randomChar(letters)}${randomChar(numbers)}${randomChar(letters)}-${randomChar(numbers)}${randomChar(letters)}`;
  
  const batteries = Math.floor(Math.random() * 4); // 0 to 3
  const indicators = ["高压(FRK)", "通讯(CAR)", "异常(SND)", "无标签"];
  const indicator = indicators[Math.floor(Math.random() * indicators.length)];

  return { serialNumber, batteries, indicator };
};

export const BombProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameId, setGameId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [status, setStatus] = useState<'IDLE' | 'RUNNING' | 'EXPLODED' | 'DEFUSED'>('IDLE');
  const [metaData, setMetaData] = useState<BombMetaData | null>(generateMetaData());
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
        if (payload.metaData) {
            setMetaData(payload.metaData);
        }
        if (payload.gameId) {
            setGameId(payload.gameId);
        }
      }
    };

    return () => bc.close();
  }, []);

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
    const newGameId = `game-${Math.random().toString(36).substring(2, 9)}`;
    const newMeta = generateMetaData();
    setGameId(newGameId);
    setStatus('RUNNING');
    setTimeLeft(INITIAL_TIME);
    setMetaData(newMeta);
    AILogger.log('GAME_START', { time_limit: INITIAL_TIME, meta: newMeta, gameId: newGameId });
    if (channel) {
      channel.postMessage({ type: 'SYNC_STATUS', payload: { status: 'RUNNING', timeLeft: INITIAL_TIME, metaData: newMeta, gameId: newGameId } });
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
    <BombContext.Provider value={{ gameId, timeLeft, status, metaData, deductTime, startBomb }}>
      {children}
    </BombContext.Provider>
  );
};

export const useBomb = () => {
  const context = useContext(BombContext);
  if (!context) throw new Error('useBomb must be used within a BombProvider');
  return context;
};
