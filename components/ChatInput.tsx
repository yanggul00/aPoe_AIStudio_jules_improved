import React from 'react';
import { AiModel, AVAILABLE_MODELS } from '../constants'; // Assuming constants.ts is in the parent directory
import { AttachedFile } from '../types';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { SendIcon } from './icons/SendIcon';

interface ChatInputProps {
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  selectedModel: string;
  setSelectedModel: (modelId: string) => void;
  availableModels: AiModel[]; // From constants
  attachedFile: AttachedFile | null;
  onRemoveAttachedFile: () => void;
  onSendMessage: () => void;
  onAttachFileClick: () => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  currentMessage,
  setCurrentMessage,
  selectedModel,
  setSelectedModel,
  availableModels,
  attachedFile,
  onRemoveAttachedFile,
  onSendMessage,
  onAttachFileClick,
  isLoading,
}) => {
  const handleSend = () => {
    if (isLoading) return;
    onSendMessage();
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-slate-200 bg-white">
      {attachedFile && (
        <div className="mb-2 p-2 bg-slate-100 rounded-md text-sm flex justify-between items-center">
          <div>
            Attached: <span className="font-semibold">{attachedFile.name}</span> ({(attachedFile.size / 1024).toFixed(2)} KB)
          </div>
          <button 
            onClick={onRemoveAttachedFile} 
            className="text-red-500 hover:text-red-700 text-xs"
            aria-label="Remove attached file"
          >
            Remove
          </button>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <button
          onClick={onAttachFileClick}
          disabled={isLoading}
          className="p-2 text-slate-500 hover:text-slate-700 disabled:opacity-50"
          aria-label="Attach file"
        >
          <PaperclipIcon className="w-5 h-5" />
        </button>
        <textarea
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message or attach a file..."
          className="flex-1 p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none disabled:opacity-50"
          rows={2}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || (!currentMessage.trim() && !attachedFile)}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          aria-label="Send message"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-2">
        <label htmlFor="model-select" className="text-xs text-slate-600 mr-2">
          AI Model:
        </label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={isLoading}
          className="p-1 text-xs border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
        >
          {availableModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ChatInput;
