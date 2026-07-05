import React, { useState } from 'react';
import { useCommunication } from '../core/CommunicationContext';
import { parseMessageContent } from '../utils/GestureRenderer';

export const FloatingCommsWidget: React.FC = () => {
  const { messages, sendMessage } = useCommunication();
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim(), 'TEXT', 'DECODER');
    setInputText('');
  };

  const latestMessage = messages.length > 0 ? messages[messages.length - 1] : null;

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', width: '400px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', zIndex: 1000 }}>
      {latestMessage && (
        <div style={{ background: latestMessage.senderRole === 'DECODER' ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)', padding: '12px 24px', borderRadius: '30px', color: '#fff', border: `1px solid ${latestMessage.senderRole === 'DECODER' ? 'var(--color-neon-blue)' : '#888'}`, boxShadow: '0 10px 20px rgba(0,0,0,0.8)', maxWidth: '100%', wordWrap: 'break-word', textAlign: 'right', backdropFilter: 'blur(5px)' }}>
          <span style={{ fontSize: '0.8rem', opacity: 0.5, marginRight: '10px', fontFamily: 'monospace' }}>[{latestMessage.senderRole}]</span>
          <span style={{ fontSize: '1.1rem', letterSpacing: '1px' }}>{parseMessageContent(latestMessage.content)}</span>
        </div>
      )}
      <form onSubmit={handleSend} style={{ display: 'flex', width: '100%', background: 'rgba(20,20,20,0.9)', borderRadius: '30px', padding: '8px', border: '1px solid #444', boxShadow: '0 10px 30px rgba(0,0,0,0.9)', backdropFilter: 'blur(5px)' }}>
        <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder=">> REPLY..." style={{ flex: 1, background: 'transparent', border: 'none', color: '#ccc', padding: '0 20px', outline: 'none', fontSize: '1.1rem', fontFamily: 'monospace' }} />
        <button type="submit" style={{ background: '#555', color: '#fff', border: 'none', borderRadius: '25px', padding: '10px 25px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '2px' }}>REPLY</button>
      </form>
    </div>
  );
};
