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

  useEffect(() => {
    // Abstracted transport layer. 
    // For Prototype: BroadcastChannel (cross-tab local comms).
    // For Production: Swap this with WebSocket (Socket.io) or WebRTC.
    const bc = new BroadcastChannel('boombanana_comms');
    setChannel(bc);

    bc.onmessage = (event) => {
      const incomingMessage = event.data as ChatMessage;
      setMessages((prev) => [...prev, incomingMessage]);
    };

    return () => {
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
