import React, { useState } from 'react';
import { PuzzleRegistry } from '../core/PuzzleRegistry';
import { ObserverCommsWidget } from './ObserverCommsWidget';
import { AIAvatar } from './AIAvatar';
import './TerminalBinder.css';

export const TerminalBinder: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalModules = PuzzleRegistry.length;

  const handlePrev = () => setCurrentIndex(p => Math.max(0, p - 1));
  const handleNext = () => setCurrentIndex(p => Math.min(totalModules - 1, p + 1));

  return (
    <div className="terminal-binder-container">
      
      <button 
        className={`binder-nav-area left ${currentIndex === 0 ? 'disabled' : ''}`} 
        onClick={handlePrev}
      >
        <div className="nav-arrow">◀</div>
      </button>
      
      <div className="terminal-module-content">
         <div className="module-title-overlay">
           ACTIVE MODULE [{currentIndex + 1}/{totalModules}] :: {PuzzleRegistry[currentIndex].name}
         </div>
         <div style={{ display: 'flex', width: '100%', height: '100%' }}>
           <div className="module-render-area">
             {PuzzleRegistry.map((puzzle, idx) => (
               <div 
                 key={puzzle.id} 
                 style={{ 
                   display: currentIndex === idx ? 'flex' : 'none', 
                   width: '100%', 
                   height: '100%', 
                   flexDirection: 'column', 
                   alignItems: 'center', 
                   justifyContent: 'center' 
                 }}
               >
                 {React.createElement(puzzle.TerminalUI)}
               </div>
             ))}
           </div>
           
           <div style={{ width: '250px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '120px' }}>
             <AIAvatar />
           </div>
         </div>
      </div>

      <button 
        className={`binder-nav-area right ${currentIndex === totalModules - 1 ? 'disabled' : ''}`} 
        onClick={handleNext}
      >
        <div className="nav-arrow">▶</div>
      </button>

      <ObserverCommsWidget />
    </div>
  );
};
