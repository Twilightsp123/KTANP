import React, { useState } from 'react';
import { FlipBoard, type CardState, type SymbolType, type ColorType } from '../../components/FlipBoard';
import './Terminal.css';
import { SciFiButton } from '../../components/SciFiButton';

const generateRandomBoard = (size: number): CardState[] => {
  const symbols: SymbolType[] = ['moon', 'sun', 'star', 'triangle', 'circle'];
  const colors: ColorType[] = ['blue', 'red', 'gold'];
  
  return Array.from({ length: size }).map((_, i) => ({
    id: i,
    isFlipped: false, 
    symbol: symbols[Math.floor(Math.random() * symbols.length)],
    color: colors[Math.floor(Math.random() * colors.length)]
  }));
};

export const FlipBoardTerminal: React.FC = () => {
  const [upperBoard, setUpperBoard] = useState<CardState[]>(() => generateRandomBoard(9)); // 3x3
  const [lowerBoard, setLowerBoard] = useState<CardState[]>(() => generateRandomBoard(4)); // 2x2

  const handleUpperClick = (id: number) => {
    setUpperBoard(prev => prev.map(c => c.id === id ? { ...c, isFlipped: !c.isFlipped } : c));
  };

  const handleLowerClick = (id: number) => {
    setLowerBoard(prev => prev.map(c => c.id === id ? { ...c, isFlipped: !c.isFlipped } : c));
  };

  const handleReset = () => {
    setUpperBoard(generateRandomBoard(9));
    setLowerBoard(generateRandomBoard(4));
  };

  return (
    <div className="puzzle-layout">
      <div className="boards-container">
        <FlipBoard title="UPPER MATRIX" cards={upperBoard} onCardClick={handleUpperClick} />
        
        <div className="coupling-mechanism">
          <div className="data-line"></div>
          <div className="coupling-core"></div>
          <div className="data-line"></div>
        </div>

        <FlipBoard title="LOWER MATRIX" cards={lowerBoard} onCardClick={handleLowerClick} />
      </div>
      
      <div className="puzzle-controls">
        <SciFiButton variant="primary">SUBMIT SEQUENCE</SciFiButton>
        <SciFiButton variant="danger" onClick={handleReset}>RESET PANELS</SciFiButton>
      </div>
    </div>
  );
};
