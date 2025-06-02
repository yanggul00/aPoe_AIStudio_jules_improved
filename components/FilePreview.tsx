import React from 'react';
import { AttachedFile } from '../types'; // Assuming types.ts is in the parent directory

interface FilePreviewProps {
  file: AttachedFile | null;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <p className="text-lg">No file selected for preview.</p>
        <p className="text-sm">Upload a file to see its details here.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2 h-full overflow-auto">
      <h3 className="text-lg font-semibold text-slate-700">File Preview</h3>
      <p className="text-sm text-slate-600">
        <strong>Name:</strong> {file.name}
      </p>
      <p className="text-sm text-slate-600">
        <strong>Type:</strong> {file.type}
      </p>
      <p className="text-sm text-slate-600">
        <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
      </p>
      {file.previewType === 'image' && file.dataUrl ? (
        <img src={file.dataUrl} alt={`Preview of ${file.name}`} className="max-w-full h-auto rounded-md shadow-sm" />
      ) : file.previewType === 'text' && file.dataUrl ? (
        <div className="bg-slate-50 p-2 border border-slate-200 rounded-md max-h-96 overflow-auto">
          <pre className="text-xs text-slate-700 whitespace-pre-wrap break-all">{file.dataUrl}</pre>
        </div>
      ) : file.previewType === 'pdf' ? (
             <p className="text-sm text-slate-600">PDF preview is not available for this file.</p>
             // In a real app, you might embed an iframe or use a library like react-pdf
      ) : (
            <p className="text-sm text-slate-600">Preview for this file type is not supported.</p>
      )}
    </div>
  );
};

export default FilePreview;
