
export enum SenderType {
  USER = 'user',
  AI = 'ai',
}

export interface ChatMessage {
  id: string;
  sender: SenderType;
  text: string;
  file?: {
    name: string;
    type: string;
  };
  timestamp: Date;
  meta?: Record<string, any>; // For potential grounding chunks or other metadata
}

export type FilePreviewType = 'image' | 'text' | 'pdf' | 'unsupported';

export interface AttachedFile {
  name: string;
  type: string; // MIME type
  size: number;
  /**
   * Stores the content of the file.
   * - For files with `previewType: 'image'`, this is a standard base64 encoded Data URL (e.g., "data:image/png;base64,...").
   * - For files with `previewType: 'text'`, this directly holds the string content of the text file.
   * - For other types, it might also be a Data URL if read by `reader.readAsDataURL()`.
   */
  dataUrl: string;
  previewType: FilePreviewType;
}

// AiModel interface is now defined and exported from constants.ts
// If it was previously defined here, it should be removed or type-aliased if necessary
// For example, if you had:
// export interface AiModel { ... }
// You would remove it from here.
// If you need to refer to the type defined in constants.ts, you would import it there.
// import { AiModel } from './constants';
// No changes needed here now as AiModel was already being imported from constants in geminiService.ts,
// the issue was it wasn't exported from constants.ts
