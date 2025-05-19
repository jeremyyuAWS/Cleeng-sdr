import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, RefreshCw, Send, Shield, Lock } from 'lucide-react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatModalProps {
  agentName?: string;
  agentAvatar?: string;
  initialMessages?: Message[];
  onSendMessage?: (message: string) => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  agentName = 'Cleengage AI',
  agentAvatar = 'https://i.imgur.com/8Km9tLL.png',
  initialMessages = [],
  onSendMessage
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  
  const resetChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: `Hi there! I'm your Cleengage assistant. I can help with lead enrichment, email outreach, and CRM synchronization questions. How can I assist you today?`,
        timestamp: new Date(),
      }
    ]);
    setInput('');
  };
  
  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    
    // Simulate AI typing
    setIsTyping(true);
    
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `This is a simulated response from ${agentName}. In a real implementation, this would be a response from an AI model focused on sales outreach and CRM integration topics.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
    
    if (onSendMessage) {
      onSendMessage(input);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  if (!isOpen) {
    return (
      <button
        onClick={toggleModal}
        className="fixed bottom-6 right-6 bg-cleeng-blue-600 hover:bg-cleeng-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-40"
      >
        <Shield size={24} />
      </button>
    );
  }
  
  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col z-40 border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-cleeng-blue-600 to-cleeng-green-500 text-white rounded-t-lg">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-white mr-2 flex items-center justify-center">
            <Lock size={16} className="text-cleeng-blue-600" />
          </div>
          <h3 className="font-medium">{agentName}</h3>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={resetChat}
            className="text-white opacity-80 hover:opacity-100 transition-opacity"
          >
            <RefreshCw size={18} />
          </button>
          <button 
            onClick={toggleModal}
            className="text-white opacity-80 hover:opacity-100 transition-opacity"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-[80%] rounded-lg p-3
                ${message.role === 'user' 
                  ? 'bg-cleeng-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'}
              `}
            >
              {message.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none p-3 max-w-[80%]">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-cleeng-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-cleeng-blue-400 rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
                <div className="w-2 h-2 bg-cleeng-blue-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-cleeng-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={input.trim() === ''}
            className={`
              px-4 py-2 rounded-r-md 
              ${input.trim() === '' 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-cleeng-blue-600 text-white hover:bg-cleeng-blue-700'}
              transition-colors duration-200
            `}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};