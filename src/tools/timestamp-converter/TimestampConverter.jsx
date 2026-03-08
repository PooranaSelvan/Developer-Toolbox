import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Copy, Check, Trash2, RefreshCw, Calendar,
  ArrowLeftRight, Globe, Sparkles, Timer, Zap, Info,
  Plus, Minus, Hash, ArrowRight,
} from 'lucide-react';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';

const QUICK_TIMESTAMPS = [
  { label: 'Now', getValue: () => Math.floor(Date.now() / 1000) },
  { label: 'Start of Today', getValue: () => { const d = new Date(); d.setHours(0,0,0,0); return Math.floor(d.getTime()/1000); }},
  { label: 'Start of Week', getValue: () => { const d = new Date(); d.setDate(d.getDate()-d.getDay()); d.setHours(0,0,0,0); return Math.floor(d.getTime()/1000); }},
  { label: 'Start of Month', getValue: () => { const d = new Date(); d.setDate(1); d.setHours(0,0,0,0); return Math.floor(d.getTime()/1000); }},
  { label: 'Start of Year', getValue: () => { const d = new Date(); d.setMonth(0,1); d.setHours(0,0,0,0); return Math.floor(d.getTime()/1000); }},
  { label: 'Epoch', getValue: () => 0 },
];

const COMMON_FORMATS = [
  { id: 'iso', label: 'ISO 8601', format: (d) => d.toISOString() },
  { id: 'utc', label: 'UTC String', format: (d) => d.toUTCString() },
  { id: 'locale', label: 'Local String', format: (d) => d.toLocaleString() },
  { id: 'date-only', label: 'Date Only', format: (d) => d.toISOString().split('T')[0] },
  { id: 'time-only', label: 'Time Only', format: (d) => d.toISOString().split('T')[1].replace('Z','') },
  { id: 'unix-s', label: 'Unix (seconds)', format: (d) => Math.floor(d.getTime() / 1000).toString() },
  { id: 'unix-ms', label: 'Unix (milliseconds)', format: (d) => d.getTime().toString() },
  { id: 'relative', label: 'Relative', format: (d) => getRelativeTime(d) },
  { id: 'rfc2822', label: 'RFC 2822', format: (d) => d.toUTCString().replace('GMT', '+0000') },
  { id: 'short-us', label: 'US Short', format: (d) => d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) },
  { id: 'short-eu', label: 'EU Short', format: (d) => d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) },
  { id: 'full', label: 'Full Date', format: (d) => d.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit', timeZoneName:'short' }) },
];

function getRelativeTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const absDiff = Math.abs(diffMs);
  const isPast = diffMs > 0;
  
  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365.25);
  
  let text;
  if (seconds < 5) text = 'just now';
  else if (seconds < 60) text = `${seconds} seconds`;
  else if (minutes < 60) text = `${minutes} minute${minutes>1?'s':''}`;
  else if (hours < 24) text = `${hours} hour${hours>1?'s':''}`;
  else if (days < 7) text = `${days} day${days>1?'s':''}`;
  else if (weeks < 5) text = `${weeks} week${weeks>1?'s':''}`;
  else if (months < 12) text = `${months} month${months>1?'s':''}`;
  else text = `${years} year${years>1?'s':''}`;
  
  if (text === 'just now') return text;
  return isPast ? `${text} ago` : `in ${text}`;
}

function getDateBreakdown(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
    millisecond: date.getMilliseconds(),
    dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' }),
    dayOfYear: Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000),
    weekNumber: Math.ceil(((date - new Date(date.getFullYear(), 0, 1)) / 86400000 + new Date(date.getFullYear(), 0, 1).getDay() + 1) / 7),
    isLeapYear: (date.getFullYear() % 4 === 0 && date.getFullYear() % 100 !== 0) || date.getFullYear() % 400 === 0,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    offset: -date.getTimezoneOffset(),
  };
}

export default function TimestampConverter() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('unix-to-date');
  const [liveNow, setLiveNow] = useState(Math.floor(Date.now() / 1000));
  const [addValue, setAddValue] = useState(0);
  const [addUnit, setAddUnit] = useState('hours');
  const { copied, copyToClipboard } = useCopyToClipboard();

  useEffect(() => {
    const interval = setInterval(() => setLiveNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(interval);
  }, []);

  const parsedDate = useMemo(() => {
    if (!input.trim()) return null;
    try {
      const trimmed = input.trim();
      // Try Unix timestamp (seconds)
      if (/^\d{10}$/.test(trimmed)) return new Date(parseInt(trimmed) * 1000);
      // Try Unix timestamp (milliseconds)
      if (/^\d{13}$/.test(trimmed)) return new Date(parseInt(trimmed));
      // Try ISO or standard date string
      const d = new Date(trimmed);
      if (!isNaN(d.getTime())) return d;
      return null;
    } catch { return null; }
  }, [input]);

  const breakdown = useMemo(() => parsedDate ? getDateBreakdown(parsedDate) : null, [parsedDate]);

  const dateWithAdd = useMemo(() => {
    if (!parsedDate || !addValue) return null;
    const d = new Date(parsedDate);
    const multipliers = { seconds: 1000, minutes: 60000, hours: 3600000, days: 86400000, weeks: 604800000, months: 0, years: 0 };
    if (addUnit === 'months') d.setMonth(d.getMonth() + addValue);
    else if (addUnit === 'years') d.setFullYear(d.getFullYear() + addValue);
    else d.setTime(d.getTime() + addValue * multipliers[addUnit]);
    return d;
  }, [parsedDate, addValue, addUnit]);

  const handleSetNow = useCallback(() => {
    setInput(Math.floor(Date.now() / 1000).toString());
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Clock size={22} /></div>
          <div>
            <h1 className="text-xl font-bold">Timestamp Converter</h1>
            <p className="text-xs opacity-50 mt-0.5">Convert Unix timestamps, ISO dates & more</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleSetNow} className="btn btn-sm btn-outline gap-1.5"><Zap size={14} /> Now</button>
          {input && <button onClick={() => setInput('')} className="btn btn-sm btn-ghost btn-error gap-1.5"><Trash2 size={14} /> Clear</button>}
        </div>
      </motion.div>

      {/* Live Clock */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="section-card p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center"><Timer size={18} className="text-success" /></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-40">Current Unix Timestamp</p>
              <p className="text-xl font-bold font-mono">{liveNow}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-40">Local Time</p>
            <p className="text-sm font-medium opacity-70">{new Date().toLocaleString()}</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Timestamps */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <p className="text-[11px] font-bold uppercase tracking-wider opacity-40 mb-2 px-1">Quick Timestamps</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_TIMESTAMPS.map(q => (
            <button key={q.label} onClick={() => setInput(q.getValue().toString())} className="btn btn-xs btn-ghost border border-base-300 gap-1">
              <Calendar size={11} /> {q.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Input */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="section-card p-5">
        <div className="flex items-center justify-between mb-2">
          <label className="field-label mb-0">Enter Timestamp or Date</label>
          <div className="flex gap-1">
            {parsedDate && <span className="badge badge-success badge-xs gap-1"><Check size={10} /> Valid</span>}
            {input.trim() && !parsedDate && <span className="badge badge-error badge-xs">Invalid</span>}
          </div>
        </div>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 1700000000, 2024-01-15T10:30:00Z, Jan 15 2024" className="input w-full font-mono text-sm" />
        <p className="text-[10px] opacity-30 mt-1.5">Accepts: Unix timestamp (s/ms), ISO 8601, RFC 2822, or any parseable date string</p>
      </motion.div>

      {/* Results */}
      {parsedDate && (
        <AnimatePresence>
          {/* All Formats */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="section-card p-5">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Globe size={15} className="text-primary" /> All Formats</h3>
            <div className="space-y-2">
              {COMMON_FORMATS.map(f => {
                let value;
                try { value = f.format(parsedDate); } catch { value = 'N/A'; }
                return (
                  <div key={f.id} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-base-200/60 transition-colors group">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-semibold opacity-50 w-32 shrink-0">{f.label}</span>
                      <span className="text-xs font-mono truncate opacity-80">{value}</span>
                    </div>
                    <button onClick={() => copyToClipboard(value)} className="btn btn-xs btn-ghost opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      {copied ? <Check size={11} className="text-success" /> : <Copy size={11} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Date Breakdown */}
          {breakdown && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Day of Week', value: breakdown.dayOfWeek, icon: Calendar, color: 'text-primary' },
                { label: 'Day of Year', value: `${breakdown.dayOfYear}/365`, icon: Hash, color: 'text-secondary' },
                { label: 'Week #', value: breakdown.weekNumber, icon: Calendar, color: 'text-warning' },
                { label: 'Leap Year', value: breakdown.isLeapYear ? 'Yes ✓' : 'No', icon: Info, color: 'text-info' },
                { label: 'Timezone', value: breakdown.timezone, icon: Globe, color: 'text-success' },
                { label: 'UTC Offset', value: `${breakdown.offset >= 0 ? '+' : ''}${breakdown.offset / 60}h`, icon: Clock, color: 'text-warning' },
                { label: 'Hour', value: `${breakdown.hour}:${String(breakdown.minute).padStart(2,'0')}:${String(breakdown.second).padStart(2,'0')}`, icon: Timer, color: 'text-primary' },
                { label: 'Milliseconds', value: breakdown.millisecond, icon: Zap, color: 'text-error' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="section-card p-3.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={12} className={color} />
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-50">{label}</span>
                  </div>
                  <span className="text-sm font-bold block truncate">{value}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Date Math */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="section-card p-5">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><ArrowLeftRight size={15} className="text-primary" /> Date Math</h3>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs opacity-50">Add/Subtract</span>
              <input type="number" value={addValue} onChange={(e) => setAddValue(parseInt(e.target.value) || 0)} className="input input-sm w-24 font-mono" />
              <select value={addUnit} onChange={(e) => setAddUnit(e.target.value)} className="select select-sm">
                {['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'].map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              {dateWithAdd && (
                <div className="flex items-center gap-2 flex-1">
                  <ArrowRight size={14} className="text-primary opacity-50" />
                  <span className="text-xs font-mono opacity-70">{dateWithAdd.toISOString()}</span>
                  <button onClick={() => copyToClipboard(dateWithAdd.toISOString())} className="btn btn-xs btn-ghost">
                    <Copy size={11} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Empty State */}
      {!input.trim() && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center mx-auto mb-4">
            <Clock size={28} className="opacity-30" />
          </div>
          <p className="text-sm font-medium opacity-50 mb-1">Enter a timestamp or date to convert</p>
          <p className="text-xs opacity-30">Supports Unix timestamps, ISO 8601, and natural date strings</p>
        </motion.div>
      )}
    </div>
  );
}
