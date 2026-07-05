import React from 'react';
import { PuzzleData } from '../types/schema';
import './PuzzleViewer.css';

interface PuzzleViewerProps {
  data: PuzzleData;
}

export const PuzzleViewer: React.FC<PuzzleViewerProps> = ({ data }) => {
  const { mechanics, entities, title, instruction_manual } = data;
  
  // Create a 2D array representation for rendering
  const grid: (string | null)[][] = Array(mechanics.grid_height).fill(null).map(() => 
    Array(mechanics.grid_width).fill(null)
  );

  // Map entities to the grid
  entities.forEach(entity => {
    const { x, y } = entity.position;
    if (y >= 0 && y < mechanics.grid_height && x >= 0 && x < mechanics.grid_width) {
      grid[y][x] = entity.id; // Store ID to find it later
    }
  });

  const getEntityById = (id: string | null) => {
    if (!id) return null;
    return entities.find(e => e.id === id);
  };

  return (
    <div className="puzzle-viewer-container">
      <div className="puzzle-manual">
        <h1>{title}</h1>
        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: '#a0aec0', fontSize: '1.05rem', lineHeight: '1.6' }}>
          {instruction_manual}
        </pre>
      </div>

      <div className="puzzle-grid-wrapper">
        <div 
          className="puzzle-grid"
          style={{
            gridTemplateColumns: `repeat(${mechanics.grid_width}, 1fr)`,
            gridTemplateRows: `repeat(${mechanics.grid_height}, 1fr)`
          }}
        >
          {grid.map((row, y) => (
            row.map((cellId, x) => {
              const entity = getEntityById(cellId);
              return (
                <div key={`${x}-${y}`} className="grid-cell">
                  {entity && (
                    <div 
                      className="entity-token"
                      style={{ backgroundColor: entity.properties?.color || '#3182ce' }}
                      title={`${entity.type} (${x},${y})`}
                    >
                      {/* Using the first letter of the type as a simple icon */}
                      {entity.type.charAt(0)}
                    </div>
                  )}
                </div>
              );
            })
          ))}
        </div>
      </div>
    </div>
  );
};
