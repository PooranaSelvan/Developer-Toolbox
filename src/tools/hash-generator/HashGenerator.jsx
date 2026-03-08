import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fingerprint, Copy, Check, Trash2, ArrowUpDown, Upload,
  AlertTriangle, RefreshCw, Sparkles, Hash, Shield, Eye,
  EyeOff, FileText, Lock, Unlock, CheckCircle, X,
  GitCompare, Layers, Binary, Key, Info, ShieldCheck, ShieldX,
} from 'lucide-react';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';
import useLocalStorage from '../../hooks/useLocalStorage';

async function computeHash(text, algorithm) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  try {
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return 'Error: Algorithm not supported';
  }
}

const ALGORITHMS = [
  { id: 'SHA-1', name: 'SHA-1', bits: 160, security: 'Weak', color: 'text-error', desc: 'Deprecated, collision attacks known' },
  { id: 'SHA-256', name: 'SHA-256', bits: 256, security: 'Strong', color: 'text-success', desc: 'Most widely used, recommended' },
  { id: 'SHA-384', name: 'SHA-384', bits: 384, security: 'Very Strong', color: 'text-success', desc: 'Higher security variant' },
  { id: 'SHA-512', name: 'SHA-512', bits: 512, security: 'Very Strong', color: 'text-success', desc: 'Maximum security SHA-2 variant' },
];

const PASSWORD_COMMON = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', 'master',
  'dragon', 'login', 'admin', 'letmein', 'welcome', 'football', 'shadow',
  'sunshine', 'trustno1', 'iloveyou', 'batman', 'princess', 'access',
];

function analyzePassword(password) {
  const issues = [];
  const strengths = [];
  let score = 0;

  if (password.length >= 8) { score += 20; strengths.push('Good length'); }
  else issues.push('Too short (min 8 characters)');

  if (password.length >= 12) { score += 10; strengths.push('Great length (12+)'); }
  if (password.length >= 16) { score += 10; strengths.push('Excellent length (16+)'); }

  if (/[a-z]/.test(password)) { score += 10; } else issues.push('No lowercase letters');
  if (/[A-Z]/.test(password)) { score += 15; strengths.push('Has uppercase'); } else issues.push('No uppercase letters');
  if (/[0-9]/.test(password)) { score += 15; strengths.push('Has numbers'); } else issues.push('No numbers');
  if (/[^a-zA-Z0-9]/.test(password)) { score += 20; strengths.push('Has special characters'); } else issues.push('No special characters');

  const uniqueChars = new Set(password).size;
  if (uniqueChars < password.length * 0.5) issues.push('Too many repeated characters');
  else if (uniqueChars >= password.length * 0.7) { score += 10; strengths.push('Good character variety'); }

  if (/(.)\1{2,}/.test(password)) issues.push('Contains sequences of repeated characters');
  if (/^(012|123|234|345|456|567|678|789|abc|bcd|cde|def)/i.test(password)) issues.push('Starts with sequential characters');

  if (PASSWORD_COMMON.includes(password.toLowerCase())) {
    issues.push('Commonly used password');
    score = Math.min(score, 10);
  }

  const entropy = password.length * Math.log2(
    ((/[a-z]/.test(password) ? 26 : 0) + (/[A-Z]/.test(password) ? 26 : 0) +
     (/[0-9]/.test(password) ? 10 : 0) + (/[^a-zA-Z0-9]/.test(password) ? 32 : 0)) || 1
  );

  return {
    score: Math.min(100, Math.max(0, score)),
    issues,
    strengths,
    entropy: entropy.toFixed(1),
    level: score >= 80 ? 'Strong' : score >= 50 ? 'Medium' : 'Weak',
    levelColor: score >= 80 ? 'text-success' : score >= 50 ? 'text-warning' : 'text-error',
    crackTime: entropy > 80 ? 'Centuries' : entropy > 60 ? 'Years' : entropy > 40 ? 'Months' : entropy > 20 ? 'Hours' : 'Seconds',
  };
}

function generatePassword(length = 16, options = {}) {
  const { uppercase = true, lowercase = true, numbers = true, symbols = true } = options;
  let chars = '';
  if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (numbers) chars += '0123456789';
  if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, x => chars[x % chars.length]).join('');
}

function generateUUID() {
  return crypto.randomUUID ? crypto.randomUUID() :
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({});
  const [activeTab, setActiveTab] = useState('hash');
  const [compareHash, setCompareHash] = useState('');
  const [compareAlgo, setCompareAlgo] = useState('SHA-256');
  const [passwordLength, setPasswordLength] = useState(16);
  const [pwdOptions, setPwdOptions] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [history, setHistory] = useLocalStorage('hash-history', []);
  const { copied, copyToClipboard } = useCopyToClipboard();

  useEffect(() => {
    if (!input.trim()) { setHashes({}); return; }
    const computeAll = async () => {
      const results = {};
      for (const algo of ALGORITHMS) {
        results[algo.id] = await computeHash(input, algo.id);
      }
      setHashes(results);
    };
    computeAll();
  }, [input]);

  const compareResult = useMemo(() => {
    if (!compareHash.trim() || !hashes[compareAlgo]) return null;
    return hashes[compareAlgo].toLowerCase() === compareHash.trim().toLowerCase();
  }, [compareHash, compareAlgo, hashes]);

  const passwordAnalysis = useMemo(() => {
    if (activeTab === 'password' && generatedPassword) return analyzePassword(generatedPassword);
    if (input.trim() && activeTab === 'password') return analyzePassword(input);
    return null;
  }, [input, generatedPassword, activeTab]);

  const handleGenPassword = useCallback(() => {
    setGeneratedPassword(generatePassword(passwordLength, pwdOptions));
  }, [passwordLength, pwdOptions]);

  const handleGenUUID = useCallback(() => {
    const uuid = generateUUID();
    setInput(uuid);
    copyToClipboard(uuid);
  }, [copyToClipboard]);

  const handlePaste = useCallback(async () => {
    try { setInput(await navigator.clipboard.readText()); } catch {}
  }, []);

  const TABS = [
    { id: 'hash', label: 'Hash', icon: Fingerprint },
    { id: 'verify', label: 'Verify', icon: ShieldCheck },
    { id: 'password', label: 'Password', icon: Key },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Fingerprint size={22} /></div>
          <div>
            <h1 className="text-xl font-bold">Hash Generator</h1>
            <p className="text-xs opacity-50 mt-0.5">SHA hashing, hash verification & password tools</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handlePaste} className="btn btn-sm btn-ghost gap-1.5"><Upload size={14} /> Paste</button>
          <button onClick={handleGenUUID} className="btn btn-sm btn-outline gap-1.5"><Binary size={14} /> UUID</button>
          {input && <button onClick={() => setInput('')} className="btn btn-sm btn-ghost btn-error gap-1.5"><Trash2 size={14} /> Clear</button>}
        </div>
      </motion.div>

      {/* Input */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="section-card p-5">
        <div className="flex items-center justify-between mb-2">
          <label className="field-label mb-0">Input Text</label>
          <span className="text-[10px] opacity-40 font-mono">{input.length} chars • {new TextEncoder().encode(input).length} bytes</span>
        </div>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text to hash..." rows={4} className="textarea w-full font-mono text-xs leading-relaxed" spellCheck={false} />
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="tabs tabs-box tabs-sm">
          {TABS.map(tab => (
            <button key={tab.id} className={`tab gap-1.5 ${activeTab === tab.id ? 'tab-active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              <tab.icon size={13} /> {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Hash Results */}
        {activeTab === 'hash' && (
          <motion.div key="hash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {Object.keys(hashes).length > 0 ? (
              ALGORITHMS.map(algo => (
                <motion.div key={algo.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="section-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Hash size={14} className="text-primary" />
                      <span className="text-sm font-bold">{algo.name}</span>
                      <span className="badge badge-xs badge-ghost">{algo.bits} bit</span>
                      <span className={`badge badge-xs ${algo.security === 'Weak' ? 'badge-error' : 'badge-success'}`}>{algo.security}</span>
                    </div>
                    <button onClick={() => copyToClipboard(hashes[algo.id])} className="btn btn-xs btn-ghost gap-1">
                      {copied ? <Check size={11} className="text-success" /> : <Copy size={11} />}
                      <span className="text-[10px]">Copy</span>
                    </button>
                  </div>
                  <div className="rounded-lg bg-base-200/50 p-3 font-mono text-xs break-all leading-relaxed opacity-70">
                    {hashes[algo.id]}
                  </div>
                  <p className="text-[9px] opacity-30 mt-1.5">{algo.desc} • {(hashes[algo.id]?.length || 0)} hex characters</p>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center mx-auto mb-4">
                  <Fingerprint size={28} className="opacity-30" />
                </div>
                <p className="text-sm font-medium opacity-50 mb-1">Enter text above to generate hashes</p>
                <p className="text-xs opacity-30">Supports SHA-1, SHA-256, SHA-384, SHA-512</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Verify */}
        {activeTab === 'verify' && (
          <motion.div key="verify" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="section-card p-5 space-y-4">
            <div>
              <label className="field-label">Hash to Verify</label>
              <textarea value={compareHash} onChange={(e) => setCompareHash(e.target.value)} placeholder="Paste a hash to verify against..." rows={2} className="textarea w-full font-mono text-xs" spellCheck={false} />
            </div>
            <div>
              <label className="field-label">Algorithm</label>
              <div className="flex gap-2 flex-wrap">
                {ALGORITHMS.map(a => (
                  <button key={a.id} onClick={() => setCompareAlgo(a.id)} className={`btn btn-sm gap-1.5 ${compareAlgo === a.id ? 'btn-primary' : 'btn-ghost border border-base-300'}`}>
                    {a.name}
                  </button>
                ))}
              </div>
            </div>
            {compareResult !== null && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`alert ${compareResult ? 'alert-success' : 'alert-error'}`}>
                {compareResult ? <ShieldCheck size={18} /> : <ShieldX size={18} />}
                <div>
                  <p className="font-semibold text-sm">{compareResult ? 'Hash Match ✓' : 'Hash Mismatch ✗'}</p>
                  <p className="text-xs opacity-70">{compareResult ? 'The hash matches the input text' : 'The hash does not match the input text'}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Password Tool */}
        {activeTab === 'password' && (
          <motion.div key="password" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="section-card p-5 space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2"><Key size={14} className="text-primary" /> Password Generator</h3>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="field-label mb-0">Length: {passwordLength}</label>
                </div>
                <input type="range" min="8" max="64" value={passwordLength} onChange={(e) => setPasswordLength(parseInt(e.target.value))} className="range range-xs range-primary w-full" />
              </div>

              <div className="flex flex-wrap gap-3">
                {[
                  { key: 'uppercase', label: 'A-Z' },
                  { key: 'lowercase', label: 'a-z' },
                  { key: 'numbers', label: '0-9' },
                  { key: 'symbols', label: '!@#$' },
                ].map(opt => (
                  <label key={opt.key} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" className="checkbox checkbox-xs checkbox-primary" checked={pwdOptions[opt.key]} onChange={(e) => setPwdOptions(prev => ({ ...prev, [opt.key]: e.target.checked }))} />
                    <span className="text-xs font-mono">{opt.label}</span>
                  </label>
                ))}
              </div>

              <button onClick={handleGenPassword} className="btn btn-primary w-full gap-2"><RefreshCw size={16} /> Generate Password</button>

              {generatedPassword && (
                <div className="space-y-3">
                  <div className="rounded-lg bg-base-200/50 p-4 flex items-center gap-3">
                    <span className={`font-mono text-sm flex-1 break-all ${showPassword ? '' : 'blur-sm select-none'}`}>{generatedPassword}</span>
                    <button onClick={() => setShowPassword(v => !v)} className="btn btn-ghost btn-xs">{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                    <button onClick={() => copyToClipboard(generatedPassword)} className="btn btn-ghost btn-xs">{copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}</button>
                  </div>

                  {passwordAnalysis && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold ${passwordAnalysis.levelColor}`}>{passwordAnalysis.level}</span>
                        <span className="text-xs opacity-40">Score: {passwordAnalysis.score}/100</span>
                        <span className="text-xs opacity-40">Entropy: {passwordAnalysis.entropy} bits</span>
                        <span className="badge badge-xs badge-ghost">Crack time: ~{passwordAnalysis.crackTime}</span>
                      </div>
                      <div className="h-2 rounded-full bg-base-200 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${passwordAnalysis.score}%` }} transition={{ duration: 0.8 }}
                          className={`h-full rounded-full ${passwordAnalysis.score >= 80 ? 'bg-success' : passwordAnalysis.score >= 50 ? 'bg-warning' : 'bg-error'}`} />
                      </div>
                      {passwordAnalysis.strengths.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {passwordAnalysis.strengths.map(s => <span key={s} className="badge badge-xs badge-success gap-1"><CheckCircle size={8} /> {s}</span>)}
                        </div>
                      )}
                      {passwordAnalysis.issues.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {passwordAnalysis.issues.map(i => <span key={i} className="badge badge-xs badge-error gap-1"><AlertTriangle size={8} /> {i}</span>)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
