import React, { useState } from 'react';
import { useCommunication } from '../core/CommunicationContext';
import { parseMessageContent } from '../utils/GestureRenderer';

export const ObserverCommsWidget: React.FC = () => {
  const { messages, sendMessage } = useCommunication();
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim(), 'TEXT', 'OBSERVER');
    setInputText('');
  };

  const observerMessages = messages.filter(m => m.senderRole === 'OBSERVER');
  const rawLatest = observerMessages.length > 0 ? observerMessages[observerMessages.length - 1] : null;
  const [activeMessage, setActiveMessage] = useState<any>(null);

  React.useEffect(() => {
    if (rawLatest) {
      setActiveMessage(rawLatest);
      const timer = setTimeout(() => {
        setActiveMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [rawLatest]);

  return (
    <div style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', zIndex: 1000 }}>
      {activeMessage && (
        <div style={{ background: 'rgba(0, 240, 255, 0.2)', padding: '12px 24px', borderRadius: '30px', color: '#fff', border: '1px solid var(--color-neon-blue)', boxShadow: '0 10px 20px rgba(0,0,0,0.8)', maxWidth: '100%', wordWrap: 'break-word', textAlign: 'center', backdropFilter: 'blur(5px)' }}>
          <span style={{ fontSize: '0.8rem', opacity: 0.5, marginRight: '10px', fontFamily: 'monospace' }}>[{activeMessage.senderRole}]</span>
          <span style={{ fontSize: '1.1rem', letterSpacing: '1px' }}>{activeMessage.content}</span>
        </div>
      )}
      <form onSubmit={handleSend} style={{ display: 'flex', width: '100%', background: 'rgba(20,20,20,0.9)', borderRadius: '30px', padding: '8px', border: '1px solid #444', boxShadow: '0 10px 30px rgba(0,0,0,0.9)', backdropFilter: 'blur(5px)' }}>
        <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder=">> TRANSMIT DATA..." style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--color-neon-blue)', padding: '0 20px', outline: 'none', fontSize: '1.1rem', fontFamily: 'monospace' }} />
        <button type="submit" style={{ background: 'var(--color-neon-blue)', color: '#000', border: 'none', borderRadius: '25px', padding: '10px 25px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '2px' }}>SEND</button>
      </form>
    </div>
  );
};
