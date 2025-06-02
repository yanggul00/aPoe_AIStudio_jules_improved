
import { ChatMessage, SenderType } from './types'; // Removed AiModel as AiModelType

// Exporting AiModel interface directly
export interface AiModel {
  id: string;
  name: string;
  description: string;
  isGemini: boolean; 
}


export const AVAILABLE_MODELS: AiModel[] = [
  {
    id: 'gemini-2.5-flash-preview-04-17',
    name: 'Gemini 2.5 Flash',
    description: 'Fast and versatile model for text and vision.',
    isGemini: true,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5-Turbo (Mock)',
    description: 'Powerful language model with broad knowledge. (Mocked)',
    isGemini: false,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus (Mock)',
    description: 'High-reasoning model by Anthropic. (Mocked)',
    isGemini: false,
  },
  {
    id: 'grok-1',
    name: 'Grok-1 (Mock)',
    description: 'Model by xAI with real-time information access. (Mocked)',
    isGemini: false,
  },
];

export const INITIAL_BOT_MESSAGE: ChatMessage = {
  id: 'initial-bot-message',
  sender: SenderType.AI,
  text: "Hello! I'm your AI assistant. You can upload various files (images, text, PDF, Excel, CSV) and I'll help analyze them. What would you like to do?",
  timestamp: new Date(),
};

export const GEMINI_MODEL_TEXT_VISION = 'gemini-2.5-flash-preview-04-17';
// export const GEMINI_MODEL_IMAGE_GEN = 'imagen-3.0-generate-002'; // If image generation is needed

export const SUPPORTED_TEXT_PREVIEW_TYPES = ['text/plain', 'text/csv', 'application/json'];
export const SUPPORTED_IMAGE_PREVIEW_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];