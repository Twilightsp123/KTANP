import React from 'react';
import './FlipBoard.css';

export type SymbolType = 'moon' | 'sun' | 'star' | 'triangle' | 'circle';
export type ColorType = 'blue' | 'red' | 'gold';

export interface CardState {
  id: number;
  isFlipped: boolean;
  symbol: SymbolType;
  color: ColorType;
}

interface FlipBoardProps {
  cards: CardState[];
  onCardClick: (id: number) => void;
  title: string;
}

const renderSymbol = (symbol: SymbolType) => {
  switch (symbol) {
    case 'moon': return '☾';
    case 'sun': return '☀';
    case 'star': return '★';
    case 'triangle': return '▼';
    case 'circle': return '◎';
    default: return '?';
  }
};

export const FlipBoard: React.FC<FlipBoardProps> = ({ cards, onCardClick, title }) => {
  const gridSize = Math.sqrt(cards.length);
  const gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

  return (
    <div className="flip-board-container">
      <div className="board-title">{title}</div>
      <div className="flip-board" style={{ gridTemplateColumns }}>
        {cards.map(card => (
          <div 
            key={card.id} 
            className={`flip-card ${card.isFlipped ? 'flipped' : ''}`}
            onClick={() => onCardClick(card.id)}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <div className="card-pattern"></div>
              </div>
              <div className="flip-card-back" data-color={card.color}>
                <span className="symbol">{renderSymbol(card.symbol)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
