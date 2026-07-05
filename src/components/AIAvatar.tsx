import React, { useEffect, useState } from 'react';
import { useCommunication } from '../core/CommunicationContext';
import type { ChatMessage } from '../core/CommunicationContext';
import { parseMessageContent } from '../utils/GestureRenderer';

export const AIAvatar: React.FC = () => {
  const { messages } = useCommunication();
  const [activeMessage, setActiveMessage] = useState<ChatMessage | null>(null);

  useEffect(() => {
    const decoderMessages = messages.filter(m => m.senderRole === 'DECODER');
    if (decoderMessages.length === 0) return;

    const latest = decoderMessages[decoderMessages.length - 1];
    setActiveMessage(latest);

    const timer = setTimeout(() => {
      setActiveMessage(null);
    }, 8000);

    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <div style={{ position: 'relative', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Hologram Display Area */}
      <div style={{ 
        height: '100px', 
        display: 'flex', 
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginBottom: '20px',
        opacity: activeMessage ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        pointerEvents: 'none'
      }}>
        {activeMessage && parseMessageContent(activeMessage.content)}
      </div>

      {/* AI Robot Core */}
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #00f0ff 0%, #004455 70%, #000 100%)',
        boxShadow: activeMessage 
          ? '0 0 30px #00f0ff, inset 0 0 20px #fff' 
          : '0 0 10px #0088aa',
        border: '3px solid #00f0ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: activeMessage ? 'pulse-fast 1s infinite' : 'pulse-slow 3s infinite',
      }}>
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 10px #fff' }} />
      </div>
      <div style={{ color: '#00f0ff', fontFamily: 'monospace', marginTop: '10px', fontSize: '0.8rem', letterSpacing: '2px', textShadow: '0 0 5px #00f0ff' }}>
        A.I. DECODER
      </div>

      <style>
        {`
          @keyframes pulse-slow {
            0% { transform: scale(1); box-shadow: 0 0 10px #0088aa; }
            50% { transform: scale(1.05); box-shadow: 0 0 20px #00f0ff; }
            100% { transform: scale(1); box-shadow: 0 0 10px #0088aa; }
          }
          @keyframes pulse-fast {
            0% { transform: scale(1); filter: brightness(1); }
            50% { transform: scale(1.1); filter: brightness(1.5); }
            100% { transform: scale(1); filter: brightness(1); }
          }
        `}
      </style>
    </div>
  );
};
