import { useState, useCallback } from 'react';

/**
 * Custom hook for clipboard operations with feedback state.
 *
 * @param {number} resetDelay - ms before resetting copied state (default: 2000)
 * @returns {{ copied: boolean, copyToClipboard: Function }}
 */
export default function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(
    async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelay);
        return true;
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        // Fallback for older browsers
        try {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopied(true);
          setTimeout(() => setCopied(false), resetDelay);
          return true;
        } catch (fallbackErr) {
          console.error('Fallback copy failed:', fallbackErr);
          return false;
        }
      }
    },
    [resetDelay]
  );

  return { copied, copyToClipboard };
}
