import React, { useEffect, useRef } from 'react';
import { ChatMessage, SenderType } from '../types'; // Assuming types.ts is in the parent directory

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, error }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.sender === SenderType.USER ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${
              msg.sender === SenderType.USER
                ? 'bg-blue-500 text-white'
                : 'bg-white text-slate-700'
            }`}
          >
            <p className="text-sm">{msg.text}</p>
            {msg.file && (
              <p className="text-xs mt-1 opacity-75">
                (File: {msg.file.name})
              </p>
            )}
            <p className="text-xs mt-1 opacity-60 text-right">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow bg-white text-slate-700">
            <p className="text-sm animate-pulse">AI is thinking...</p>
          </div>
        </div>
      )}
      {error && (
         <div className="flex justify-center">
            <div className="max-w-md px-4 py-2 rounded-lg shadow bg-red-100 text-red-700">
                <p className="text-sm font-semibold">Error:</p>
                <p className="text-sm">{error}</p>
            </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;
