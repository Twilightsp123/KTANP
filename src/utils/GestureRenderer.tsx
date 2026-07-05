import React from 'react';
import gestures from '../../gestures.json';

const gestureMap: Record<string, string> = {};
gestures.forEach(g => {
  gestureMap[g.code] = g.emoji;
});

export const parseMessageContent = (content: string) => {
  // Check if there are gestures
  if (!/\[G:[A-Z_0-9]+\]/.test(content)) {
    return content;
  }

  const parts = content.split(/(\[G:[A-Z_0-9]+\])/g);
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
      {parts.map((part, index) => {
        if (gestureMap[part]) {
          return (
            <span 
              key={index} 
              style={{ 
                fontSize: '3rem', 
                margin: '5px 10px', 
                filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.8))'
              }}
              title={part}
            >
              {gestureMap[part]}
            </span>
          );
        }
        // Only return text if it's not empty/spaces (since AI should only output gestures)
        if (part.trim().length > 0) {
          return <span key={index} style={{ fontSize: '1.2rem', margin: '0 5px' }}>{part}</span>;
        }
        return null;
      })}
    </div>
  );
};
