import { useState, useCallback } from 'react';
import { PuzzleData, Entity, Condition } from '../types/schema';

export const useGameEngine = (initialData: PuzzleData) => {
  const [entities, setEntities] = useState<Entity[]>(initialData.entities);
  const [gameState, setGameState] = useState<'PLAYING' | 'WON' | 'LOST'>('PLAYING');

  const evaluateCondition = (condition: Condition, subject: Entity, target?: Entity): boolean => {
    let entityToCheck = subject;
    if (condition.subject === 'TARGET' && target) entityToCheck = target;
    
    // Check property in standard fields first, then in dynamic properties
    const value = (entityToCheck as any)[condition.property] !== undefined 
      ? (entityToCheck as any)[condition.property] 
      : entityToCheck.properties?.[condition.property];
    
    switch (condition.operator) {
      case '==': return value === condition.value;
      case '!=': return value !== condition.value;
      case '>': return value > condition.value;
      case '<': return value < condition.value;
      default: return false;
    }
  };

  const processRules = useCallback((trigger: string, subject: Entity, target?: Entity) => {
    const rules = initialData.mechanics.rules.filter(r => r.trigger === trigger);
    
    let stateChanged = false;
    let nextState = gameState;
    let entitiesToDestroy = new Set<string>();

    rules.forEach(rule => {
      // Check if all conditions pass
      const allPassed = rule.conditions.every(cond => evaluateCondition(cond, subject, target));
      
      if (allPassed) {
        rule.actions.forEach(action => {
          switch (action.type) {
            case 'WIN_GAME':
              nextState = 'WON';
              stateChanged = true;
              break;
            case 'LOSE_GAME':
              nextState = 'LOST';
              stateChanged = true;
              break;
            case 'DESTROY':
              // Simplified: assume destroy target for now
              if (target) entitiesToDestroy.add(target.id);
              break;
          }
        });
      }
    });

    if (stateChanged) setGameState(nextState);
    if (entitiesToDestroy.size > 0) {
      setEntities(prev => prev.filter(e => !entitiesToDestroy.has(e.id)));
    }
  }, [gameState, initialData.mechanics.rules]);

  const moveEntity = useCallback((id: string, dx: number, dy: number) => {
    if (gameState !== 'PLAYING') return;

    setEntities(prev => {
      const entity = prev.find(e => e.id === id);
      if (!entity) return prev;

      const newX = entity.position.x + dx;
      const newY = entity.position.y + dy;

      // Basic bounds check
      if (newX < 0 || newX >= initialData.mechanics.grid_width || 
          newY < 0 || newY >= initialData.mechanics.grid_height) {
        return prev;
      }

      // Check collision
      const targetEntity = prev.find(e => e.position.x === newX && e.position.y === newY);
      
      if (targetEntity) {
        // Hardcoded basic physics: Walls block.
        // In a fully advanced version, even 'blocking' would be a rule.
        if (targetEntity.type === 'Wall') return prev;
        
        // Trigger rules defined by AI
        processRules('ON_COLLISION', entity, targetEntity);
      }

      // Update position
      return prev.map(e => 
        e.id === id ? { ...e, position: { x: newX, y: newY } } : e
      );
    });
  }, [gameState, initialData.mechanics, processRules]);

  const resetGame = useCallback(() => {
    setEntities(initialData.entities);
    setGameState('PLAYING');
  }, [initialData]);

  return {
    entities,
    gameState,
    moveEntity,
    resetGame
  };
};
