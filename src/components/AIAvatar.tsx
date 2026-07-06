import React, { useEffect, useState } from 'react';
import { useCommunication } from '../core/CommunicationContext';
import type { ChatMessage } from '../core/CommunicationContext';
import { parseMessageContent } from '../utils/GestureRenderer';

export const AIAvatar: React.FC = () => {
  const { messages } = useCommunication();
  const [activeMessage, setActiveMessage] = useState<ChatMessage | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (messages.length === 0) return;
    const latestMessage = messages[messages.length - 1];

    if (latestMessage.senderRole === 'OBSERVER') {
      // User just sent a message, hide old gesture and show thinking state
      setIsThinking(true);
      setActiveMessage(null);
    } else if (latestMessage.senderRole === 'DECODER') {
      // AI just replied, show gesture and stop thinking
      setIsThinking(false);
      setActiveMessage(latestMessage);

      const timer = setTimeout(() => {
        setActiveMessage(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
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
        opacity: (activeMessage || isThinking) ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        pointerEvents: 'none',
        color: '#00f0ff',
        fontFamily: 'monospace',
        fontSize: '1.2rem',
        textShadow: '0 0 10px #00f0ff'
      }}>
        {isThinking && <div style={{ animation: 'pulse-slow 1s infinite' }}>[ PROCESSING... ]</div>}
        {activeMessage && parseMessageContent(activeMessage.content)}
      </div>

      {/* AI Robot Core */}
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #00f0ff 0%, #004455 70%, #000 100%)',
        boxShadow: (activeMessage || isThinking)
          ? '0 0 30px #00f0ff, inset 0 0 20px #fff' 
          : '0 0 10px #0088aa',
        border: '3px solid #00f0ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: isThinking ? 'pulse-fast 0.5s infinite' : (activeMessage ? 'pulse-fast 1s infinite' : 'pulse-slow 3s infinite'),
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
