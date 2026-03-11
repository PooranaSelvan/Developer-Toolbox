import { useCallback } from 'react';

/**
 * Custom hook to trigger file downloads from text content.
 *
 * @returns {{ downloadFile: Function }}
 */
export default function useDownloadFile() {
  const downloadFile = useCallback((content, filename, mimeType = 'text/markdown') => {
    try {
      if (content == null) {
        console.warn('useDownloadFile: No content provided for download.');
        return false;
      }
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Download failed:', error?.message || error);
      return false;
    }
  }, []);

  return { downloadFile };
}
