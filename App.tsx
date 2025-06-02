
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ChatMessage, AttachedFile, SenderType } from './types';
import { AiModel } from './constants'; // Import AiModel from constants
import { AVAILABLE_MODELS, INITIAL_BOT_MESSAGE } from './constants';
import { generateContentWithOptionalFile } from './services/geminiService';
import { dataUrlToBase64, getFilePreviewType } from './services/fileHelper';
import FilePreview from './components/FilePreview';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import { PaperclipIcon } from './components/icons/PaperclipIcon';
import { SendIcon } from './components/icons/SendIcon';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_BOT_MESSAGE]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [previewFile, setPreviewFile] = useState<AttachedFile | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>(AVAILABLE_MODELS[0].id);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // File size check (e.g., 5MB limit)
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSizeInBytes) {
        setError(`File exceeds ${maxSizeInBytes / (1024 * 1024)}MB limit: ${file.name}`);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset file input
        }
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string; // Type assertion
        const newFile: AttachedFile = {
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: dataUrl,
          previewType: getFilePreviewType(file.type, file.name),
        };
        setAttachedFile(newFile);
        setPreviewFile(newFile);
        setError(null); // Clear previous error if file reading is successful
      };
      reader.onerror = () => {
        console.error("Error reading file:", reader.error);
        setError(`Failed to read file: ${file.name}. Please try again or select a different file.`);
        setAttachedFile(null);
        setPreviewFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset file input
        }
      };

      if (getFilePreviewType(file.type, file.name) === 'text') {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    }
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
    setPreviewFile(null); // Ensure preview is also cleared
  };

  // Regarding API Key Security:
  // In a production environment, it's highly recommended to use a backend proxy
  // to handle API calls. The API key should be stored securely on the server and
  // not exposed directly in the client-side application.
  // The client would make requests to your backend, which then forwards them
  // to the AI service with the API key attached.
  const handleSendMessage = useCallback(async () => {
    if (!currentMessage.trim() && !attachedFile) return;

    const userMessageText = currentMessage.trim();
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: SenderType.USER,
      text: userMessageText,
      file: attachedFile ? { name: attachedFile.name, type: attachedFile.type } : undefined,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    // Attached file is not automatically removed, allowing users to ask multiple questions about the same file.

    setIsLoading(true);
    setError(null);

    try {
      // --- Prepare file content for API (if any) ---
      let fileContentForApi: string | undefined = undefined;
      let mimeTypeForApi: string | undefined = undefined;

      if (attachedFile) {
        if (attachedFile.previewType === 'image' && attachedFile.dataUrl) {
          fileContentForApi = dataUrlToBase64(attachedFile.dataUrl);
          mimeTypeForApi = attachedFile.type;
        } else if (attachedFile.previewType === 'text' && attachedFile.dataUrl) { 
          fileContentForApi = attachedFile.dataUrl; 
          mimeTypeForApi = attachedFile.type; 
        }
        // Note: Other previewTypes (pdf, unsupported) are not currently prepared for the API here.
        // This would be the place to add logic if, for example, text was extracted from a PDF.
      }
      // --- End of file content preparation ---
      
      const aiResponseText = await generateContentWithOptionalFile(
        userMessageText,
        selectedModel,
        fileContentForApi,
        mimeTypeForApi,
        attachedFile?.name // Pass filename for context if content isn't sent
      );

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: SenderType.AI,
        text: aiResponseText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      const aiErrorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: SenderType.AI,
        text: `Sorry, I encountered an error: ${errorMessage}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [currentMessage, attachedFile, selectedModel]);

  useEffect(() => {
    // Check for the VITE_GEMINI_API_KEY environment variable
    if (import.meta.env.VITE_GEMINI_API_KEY === undefined) {
        const warningMessage: ChatMessage = {
            id: 'api_key_warning',
            sender: SenderType.AI,
            text: "Warning: VITE_GEMINI_API_KEY environment variable is not set. AI functionality will rely on mock services or may not work if real calls are implemented without it.",
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, warningMessage]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="flex flex-col h-screen bg-slate-100">
      <header className="bg-white shadow-md p-4 text-center">
        <h1 className="text-2xl font-bold text-slate-800">AI Assistant Bot</h1>
      </header>
      <div className="flex flex-1 overflow-hidden p-4 space-x-4">
        {/* Left Pane: File Preview */}
        <div className="w-1/2 bg-white rounded-lg shadow-lg p-4 flex flex-col overflow-hidden">
          <FilePreview file={previewFile} />
        </div>

        {/* Right Pane: Chat */}
        <div className="w-1/2 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
          <ChatWindow messages={messages} isLoading={isLoading} error={error} />
          <ChatInput
            currentMessage={currentMessage}
            setCurrentMessage={setCurrentMessage}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            availableModels={AVAILABLE_MODELS}
            attachedFile={attachedFile}
            onRemoveAttachedFile={removeAttachedFile}
            onSendMessage={handleSendMessage}
            onAttachFileClick={() => fileInputRef.current?.click()}
            isLoading={isLoading}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.txt,.csv,.pdf,.doc,.docx,.xls,.xlsx" 
          />
        </div>
      </div>
    </div>
  );
};

export default App;