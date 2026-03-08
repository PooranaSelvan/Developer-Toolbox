import { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Binary, Copy, Check, Trash2, ArrowUpDown, Upload, Download,
  Image, FileText, Lock, Unlock, AlertTriangle, Info, RefreshCw,
  Sparkles, Eye, EyeOff, Hash, Layers, ArrowRight, Code,
  X, Link2, Shield,
} from 'lucide-react';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';
import useLocalStorage from '../../hooks/useLocalStorage';

const SAMPLES = [
  { name: 'Hello World', text: 'Hello, World!' },
  { name: 'JSON Data', text: '{"name":"John","age":30,"city":"New York"}' },
  { name: 'HTML Snippet', text: '<div class="container"><h1>Hello</h1><p>Welcome to Base64</p></div>' },
  { name: 'SQL Query', text: "SELECT * FROM users WHERE email LIKE '%@example.com' AND active = true ORDER BY created_at DESC;" },
  { name: 'URL with Params', text: 'https://api.example.com/search?q=hello world&category=dev tools&page=1&sort=latest' },
];

const ENCODING_MODES = [
  { id: 'base64', name: 'Base64', desc: 'Standard Base64 encoding' },
  { id: 'base64url', name: 'Base64 URL', desc: 'URL-safe Base64 (no padding)' },
  { id: 'url', name: 'URL Encode', desc: 'Percent-encoding for URLs' },
  { id: 'html', name: 'HTML Entities', desc: 'HTML character encoding' },
  { id: 'unicode', name: 'Unicode Escape', desc: 'JavaScript Unicode escapes' },
  { id: 'hex', name: 'Hex', desc: 'Hexadecimal encoding' },
];

function encodeText(text, mode) {
  try {
    switch (mode) {
      case 'base64': return btoa(unescape(encodeURIComponent(text)));
      case 'base64url': return btoa(unescape(encodeURIComponent(text))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      case 'url': return encodeURIComponent(text);
      case 'html': return text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
      case 'unicode': return [...text].map(c => c.charCodeAt(0) > 127 ? `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}` : c).join('');
      case 'hex': return [...new TextEncoder().encode(text)].map(b => b.toString(16).padStart(2, '0')).join(' ');
      default: return text;
    }
  } catch (e) { return `Error: ${e.message}`; }
}

function decodeText(text, mode) {
  try {
    switch (mode) {
      case 'base64': return decodeURIComponent(escape(atob(text)));
      case 'base64url': {
        let b64 = text.replace(/-/g, '+').replace(/_/g, '/');
        while (b64.length % 4) b64 += '=';
        return decodeURIComponent(escape(atob(b64)));
      }
      case 'url': return decodeURIComponent(text);
      case 'html': {
        const el = document.createElement('textarea');
        el.innerHTML = text;
        return el.value;
      }
      case 'unicode': return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
      case 'hex': return new TextDecoder().decode(new Uint8Array(text.split(/\s+/).map(h => parseInt(h, 16))));
      default: return text;
    }
  } catch (e) { return `Error: ${e.message}`; }
}

function detectEncoding(text) {
  const detections = [];
  if (/^[A-Za-z0-9+/]+=*$/.test(text.trim()) && text.length % 4 <= 1) {
    try { atob(text.trim()); detections.push('base64'); } catch {}
  }
  if (/^[A-Za-z0-9_-]+$/.test(text.trim())) {
    try {
      let b = text.trim().replace(/-/g, '+').replace(/_/g, '/');
      while (b.length % 4) b += '=';
      atob(b);
      detections.push('base64url');
    } catch {}
  }
  if (/%[0-9A-Fa-f]{2}/.test(text)) detections.push('url');
  if (/&(amp|lt|gt|quot|#\d+);/.test(text)) detections.push('html');
  if (/\\u[0-9a-fA-F]{4}/.test(text)) detections.push('unicode');
  if (/^([0-9a-fA-F]{2}\s?)+$/.test(text.trim())) detections.push('hex');
  return detections;
}

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('base64');
  const [direction, setDirection] = useState('encode');
  const [showStats, setShowStats] = useState(true);
  const [history, setHistory] = useLocalStorage('base64-history', []);
  const { copied, copyToClipboard } = useCopyToClipboard();
  const fileInputRef = useRef(null);

  const result = useMemo(() => {
    if (!input.trim()) return '';
    return direction === 'encode' ? encodeText(input, mode) : decodeText(input, mode);
  }, [input, mode, direction]);

  const detectedEncodings = useMemo(() => input.trim() ? detectEncoding(input) : [], [input]);

  const stats = useMemo(() => {
    if (!input.trim() || !result || result.startsWith('Error:')) return null;
    const inputBytes = new TextEncoder().encode(input).length;
    const outputBytes = new TextEncoder().encode(result).length;
    const ratio = direction === 'encode' ? (outputBytes / inputBytes).toFixed(2) : (inputBytes / outputBytes).toFixed(2);
    return { inputBytes, outputBytes, ratio, inputChars: input.length, outputChars: result.length };
  }, [input, result, direction]);

  const handleSwap = useCallback(() => {
    setInput(result || '');
    setDirection(prev => prev === 'encode' ? 'decode' : 'encode');
  }, [result]);

  const handleProcess = useCallback(() => {
    if (result && !result.startsWith('Error:')) {
      setOutput(result);
      setHistory(prev => {
        const entry = { input: input.slice(0, 80), mode, direction, timestamp: new Date().toLocaleTimeString() };
        return [entry, ...prev].slice(0, 20);
      });
    }
  }, [result, input, mode, direction, setHistory]);

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setInput(ev.target.result.split(',')[1] || ev.target.result);
        setMode('base64');
        setDirection('decode');
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => setInput(ev.target.result);
      reader.readAsText(file);
    }
  }, []);

  const handlePaste = useCallback(async () => {
    try { setInput(await navigator.clipboard.readText()); } catch {}
  }, []);

  const isError = result.startsWith('Error:');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Binary size={22} /></div>
          <div>
            <h1 className="text-xl font-bold">Encoder / Decoder</h1>
            <p className="text-xs opacity-50 mt-0.5">Base64, URL, HTML, Unicode & Hex encoding tools</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handlePaste} className="btn btn-sm btn-ghost gap-1.5"><Upload size={14} /> Paste</button>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
          <button onClick={() => fileInputRef.current?.click()} className="btn btn-sm btn-ghost gap-1.5"><FileText size={14} /> Load File</button>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-sm btn-outline gap-2"><Sparkles size={14} /> Samples</div>
            <ul tabIndex={0} className="dropdown-content z-[10] menu p-2 shadow-lg bg-base-100 rounded-xl w-56 border border-base-300">
              {SAMPLES.map(s => (
                <li key={s.name}><button onClick={() => { setInput(s.text); setDirection('encode'); }} className="text-xs">{s.name}</button></li>
              ))}
            </ul>
          </div>
          {input && <button onClick={() => { setInput(''); setOutput(''); }} className="btn btn-sm btn-ghost btn-error gap-1.5"><Trash2 size={14} /> Clear</button>}
        </div>
      </motion.div>

      {/* Encoding Mode Selection */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {ENCODING_MODES.map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`section-card p-3 text-left transition-all hover:-translate-y-0.5 ${mode === m.id ? 'border-primary/40 bg-primary/5 ring-1 ring-primary/20' : 'hover:border-primary/20'}`}
            >
              <p className={`text-xs font-bold ${mode === m.id ? 'text-primary' : ''}`}>{m.name}</p>
              <p className="text-[9px] opacity-40 mt-0.5 leading-tight">{m.desc}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Direction Toggle */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center justify-center gap-3">
        <button
          onClick={() => setDirection('encode')}
          className={`btn btn-sm gap-1.5 ${direction === 'encode' ? 'btn-primary' : 'btn-ghost border border-base-300'}`}
        >
          <Lock size={14} /> Encode
        </button>
        <button onClick={handleSwap} className="btn btn-sm btn-circle btn-ghost"><ArrowUpDown size={16} /></button>
        <button
          onClick={() => setDirection('decode')}
          className={`btn btn-sm gap-1.5 ${direction === 'decode' ? 'btn-primary' : 'btn-ghost border border-base-300'}`}
        >
          <Unlock size={14} /> Decode
        </button>
      </motion.div>

      {/* Auto Detection */}
      {detectedEncodings.length > 0 && direction === 'decode' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section-card px-5 py-3 flex items-center gap-3 flex-wrap">
          <span className="text-xs font-semibold opacity-60 flex items-center gap-1.5"><Shield size={12} /> Detected encoding:</span>
          {detectedEncodings.map(enc => (
            <button key={enc} onClick={() => setMode(enc)} className={`badge badge-sm cursor-pointer ${mode === enc ? 'badge-primary' : 'badge-ghost hover:badge-primary/20'}`}>
              {ENCODING_MODES.find(m => m.id === enc)?.name || enc}
            </button>
          ))}
        </motion.div>
      )}

      {/* Input/Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="section-card p-5">
          <div className="flex items-center justify-between mb-2">
            <label className="field-label mb-0">{direction === 'encode' ? 'Plain Text' : 'Encoded Text'}</label>
            <span className="text-[10px] opacity-40 font-mono">{input.length} chars</span>
          </div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={direction === 'encode' ? 'Enter text to encode...' : 'Paste encoded text to decode...'} rows={8} className="textarea w-full font-mono text-xs leading-relaxed" spellCheck={false} />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="section-card p-5">
          <div className="flex items-center justify-between mb-2">
            <label className="field-label mb-0">{direction === 'encode' ? 'Encoded Result' : 'Decoded Result'}</label>
            <button onClick={() => copyToClipboard(result)} className="btn btn-xs btn-ghost gap-1">
              {copied ? <Check size={11} className="text-success" /> : <Copy size={11} />}
              <span className="text-[10px]">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <div className={`w-full min-h-[192px] max-h-[300px] overflow-y-auto rounded-lg p-4 font-mono text-xs leading-relaxed break-all scrollbar-thin ${isError ? 'bg-error/10 text-error border border-error/20' : 'bg-base-200/50'}`}>
            {result || <span className="opacity-30 italic">Result will appear here...</span>}
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      {stats && showStats && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Input', value: `${stats.inputChars} chars`, sub: `${stats.inputBytes} bytes`, icon: FileText, color: 'text-primary' },
            { label: 'Output', value: `${stats.outputChars} chars`, sub: `${stats.outputBytes} bytes`, icon: Code, color: 'text-secondary' },
            { label: 'Ratio', value: `${stats.ratio}x`, sub: direction === 'encode' ? 'expansion' : 'compression', icon: ArrowRight, color: 'text-warning' },
            { label: 'Mode', value: ENCODING_MODES.find(m => m.id === mode)?.name, sub: direction, icon: Layers, color: 'text-info' },
            { label: 'Status', value: isError ? 'Error' : 'Success', sub: isError ? 'Invalid input' : 'Ready', icon: isError ? AlertTriangle : Check, color: isError ? 'text-error' : 'text-success' },
          ].map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} className="section-card p-3.5">
              <div className="flex items-center gap-2 mb-1">
                <Icon size={13} className={color} />
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">{label}</span>
              </div>
              <span className="text-sm font-bold block">{value}</span>
              <span className="text-[10px] opacity-30">{sub}</span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {!input.trim() && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center mx-auto mb-4">
            <Binary size={28} className="opacity-30" />
          </div>
          <p className="text-sm font-medium opacity-50 mb-1">Enter text to encode or decode</p>
          <p className="text-xs opacity-30 mb-6">Supports Base64, URL, HTML entities, Unicode escapes & Hex</p>
        </motion.div>
      )}
    </div>
  );
}
