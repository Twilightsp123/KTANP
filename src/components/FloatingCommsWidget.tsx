import React, { useState } from 'react';
import { useCommunication } from '../core/CommunicationContext';
import { SciFiButton } from './SciFiButton';
import './FloatingComms.css';

const GESTURES = [
  { label: '点头 (Yes)', icon: 'nod', emoji: '🙆' },
  { label: '摇头 (No)', icon: 'shake', emoji: '🙅' },
  { label: '点赞 (Good)', icon: 'thumbs-up', emoji: '👍' },
  { label: '踩 (Bad)', icon: 'thumbs-down', emoji: '👎' },
  { label: '摊手 (Shrug)', icon: 'shrug', emoji: '🤷' },
  { label: '中指 (F**k)', icon: 'middle-finger', emoji: '🖕' },
  { label: '停止 (Stop)', icon: 'stop', emoji: '✋' },
  { label: '鼓掌 (Clap)', icon: 'clap', emoji: '👏' },
  { label: '捂脸 (Facepalm)', icon: 'facepalm', emoji: '🤦' },
  { label: '闭嘴 (Shh)', icon: 'shh', emoji: '🤫' },
  { label: '指左 (Left)', icon: 'left', emoji: '👈' },
  { label: '指右 (Right)', icon: 'right', emoji: '👉' }
];

export const FloatingCommsWidget: React.FC = () => {
  const { messages, sendMessage } = useCommunication();
  const [numInput, setNumInput] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleGesture = (gesture: typeof GESTURES[0]) => {
    sendMessage(`[手势动作]: ${gesture.emoji} ${gesture.label}`, 'QUICK_REPLY', 'DECODER');
    setIsDrawerOpen(false);
  };

  const handleNumSend = () => {
    if (!numInput.trim()) return;
    sendMessage(`[数字输入]: ${numInput}`, 'QUICK_REPLY', 'DECODER');
    setNumInput('');
  };

  return (
    <div className="floating-comms-widget">
      <div className="comms-header">📡 SECURE COMMS LINK</div>
      
      <div className="chat-history floating-history">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.senderRole === 'DECODER' ? 'sent' : 'received'}`}>
            <span className="sender">[{msg.senderRole}]</span>
            <span className="content">{msg.content}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className={`gesture-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="compact-gesture-grid">
          {GESTURES.map(g => (
            <button key={g.icon} className="compact-emoji-btn" onClick={() => handleGesture(g)} title={g.label}>
              {g.emoji}
            </button>
          ))}
        </div>
      </div>
      
      <div className="floating-input-bar">
        <button 
          className={`toggle-drawer-btn ${isDrawerOpen ? 'active' : ''}`}
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          title="展开手势盘"
        >
          {isDrawerOpen ? '✖' : '➕'}
        </button>
        <input 
          type="number" 
          value={numInput} 
          onChange={e => setNumInput(e.target.value)} 
          placeholder="数..." 
          className="scifi-input floating-num-input"
        />
        <SciFiButton variant="primary" onClick={handleNumSend} style={{ padding: '0 15px', height: '100%', minWidth: '60px' }}>
          发送
        </SciFiButton>
      </div>
    </div>
  );
};
