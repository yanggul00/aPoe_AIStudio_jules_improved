import { FilePreviewType } from '../types';
import { SUPPORTED_TEXT_PREVIEW_TYPES, SUPPORTED_IMAGE_PREVIEW_TYPES } from '../constants';

/**
 * Determines the type of preview for a given file.
 * @param mimeType The MIME type of the file.
 * @param fileName The name of the file.
 * @returns The FilePreviewType.
 */
export const getFilePreviewType = (mimeType: string, fileName: string): FilePreviewType => {
  if (SUPPORTED_IMAGE_PREVIEW_TYPES.includes(mimeType)) {
    return 'image';
  }
  if (SUPPORTED_TEXT_PREVIEW_TYPES.includes(mimeType)) {
    return 'text';
  }
  if (mimeType === 'application/pdf') {
    return 'pdf';
  }

  // Basic extension checking for common text types if MIME is generic
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (extension === 'txt' || extension === 'csv' || extension === 'json') {
     // Re-check against supported text types in case MIME was not specific enough
    if (mimeType === 'application/octet-stream' || !mimeType) {
        // For .csv, prefer text, otherwise could be more specific
        if (extension === 'csv' && SUPPORTED_TEXT_PREVIEW_TYPES.includes('text/csv')) return 'text';
        if (extension === 'json' && SUPPORTED_TEXT_PREVIEW_TYPES.includes('application/json')) return 'text';
        if (extension === 'txt' && SUPPORTED_TEXT_PREVIEW_TYPES.includes('text/plain')) return 'text';
    }
  }
  
  // Add more specific checks for doc, docx, xls, xlsx if basic text extraction is to be attempted later
  // For now, they fall through to 'unsupported' if not covered above

  console.log(`[getFilePreviewType] Mime: ${mimeType}, Filename: ${fileName}, Deduced type: 'unsupported' (for now for many types)`);
  return 'unsupported';
};

/**
 * Extracts the base64 content from a data URL.
 * Example: "data:image/png;base64,iVBORw0KGgo..." -> "iVBORw0KGgo..."
 * @param dataUrl The data URL string.
 * @returns The base64 encoded part of the data URL, or undefined if not a valid data URL.
 */
export const dataUrlToBase64 = (dataUrl: string): string | undefined => {
  const parts = dataUrl.split(',');
  if (parts.length === 2 && parts[0].includes(';base64')) {
    return parts[1];
  }
  console.warn('[dataUrlToBase64] Could not parse base64 content from dataUrl:', dataUrl.substring(0,100));
  return undefined; // Or return empty string, depending on desired error handling
};
