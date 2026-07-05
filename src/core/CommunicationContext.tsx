import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  senderRole: 'OBSERVER' | 'DECODER';
  content: string;
  timestamp: number;
  type: 'TEXT' | 'QUICK_REPLY';
}

interface CommunicationContextType {
  messages: ChatMessage[];
  sendMessage: (content: string, type: 'TEXT' | 'QUICK_REPLY', senderRole: 'OBSERVER' | 'DECODER') => void;
  clearMessages: () => void;
}

const CommunicationContext = createContext<CommunicationContextType | undefined>(undefined);

export const CommunicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);

  useEffect(() => {
    const bombBc = new BroadcastChannel('boombanana_bomb');
    bombBc.onmessage = (event) => {
      if (event.data.type === 'SYNC_STATUS' && event.data.payload.gameId) {
        setCurrentGameId(event.data.payload.gameId);
      }
    };

    const bc = new BroadcastChannel('boombanana_comms');
    setChannel(bc);

    bc.onmessage = (event) => {
      const incomingMessage = event.data as ChatMessage;
      setMessages((prev) => [...prev, incomingMessage]);
    };

    return () => {
      bombBc.close();
      bc.close();
    };
  }, []);

  const sendMessage = (content: string, type: 'TEXT' | 'QUICK_REPLY', senderRole: 'OBSERVER' | 'DECODER') => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderRole,
      content,
      timestamp: Date.now(),
      type
    };

    // Update local state
    setMessages((prev) => [...prev, newMessage]);
    
    // Broadcast to other tabs
    if (channel) {
      channel.postMessage(newMessage);
    }

    // Call Backend AI if sender is Observer
    if (senderRole === 'OBSERVER') {
      const activeGameId = currentGameId || 'dev-test-game-id';
      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: activeGameId, message: content })
      })
      .then(res => res.json())
      .then(data => {
        if (data.reply) {
           const aiMessage: ChatMessage = {
             id: Math.random().toString(36).substr(2, 9),
             senderRole: 'DECODER',
             content: data.reply,
             timestamp: Date.now(),
             type: 'TEXT'
           };
           setMessages(prev => [...prev, aiMessage]);
           if (channel) channel.postMessage(aiMessage);
        }
      })
      .catch(err => console.error("AI Communication error:", err));
    }
  };

  const clearMessages = () => setMessages([]);

  return (
    <CommunicationContext.Provider value={{ messages, sendMessage, clearMessages }}>
      {children}
    </CommunicationContext.Provider>
  );
};

export const useCommunication = () => {
  const context = useContext(CommunicationContext);
  if (!context) {
    throw new Error('useCommunication must be used within a CommunicationProvider');
  }
  return context;
};
