import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Ruler, Copy, Check, Trash2, ArrowLeftRight, RefreshCw,
  Monitor, Smartphone, Tablet, Settings, Info, Sparkles,
  RotateCcw, Eye,
} from 'lucide-react';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';

const DEFAULT_CONFIG = {
  rootFontSize: 16,
  parentFontSize: 16,
  viewportWidth: 1920,
  viewportHeight: 1080,
};

const DEVICE_PRESETS = [
  { name: 'Desktop', icon: Monitor, width: 1920, height: 1080 },
  { name: 'Laptop', icon: Monitor, width: 1366, height: 768 },
  { name: 'Tablet', icon: Tablet, width: 768, height: 1024 },
  { name: 'Mobile', icon: Smartphone, width: 375, height: 812 },
];

const UNITS = ['px', 'rem', 'em', 'vw', 'vh', 'vmin', 'vmax', '%', 'pt', 'cm', 'mm', 'in'];

function convertUnit(value, fromUnit, toUnit, config) {
  if (fromUnit === toUnit) return value;
  const { rootFontSize, parentFontSize, viewportWidth, viewportHeight } = config;

  // Convert everything to px first
  let px;
  switch (fromUnit) {
    case 'px': px = value; break;
    case 'rem': px = value * rootFontSize; break;
    case 'em': px = value * parentFontSize; break;
    case 'vw': px = (value * viewportWidth) / 100; break;
    case 'vh': px = (value * viewportHeight) / 100; break;
    case 'vmin': px = (value * Math.min(viewportWidth, viewportHeight)) / 100; break;
    case 'vmax': px = (value * Math.max(viewportWidth, viewportHeight)) / 100; break;
    case '%': px = (value * parentFontSize) / 100; break;
    case 'pt': px = value * (96 / 72); break;
    case 'cm': px = value * (96 / 2.54); break;
    case 'mm': px = value * (96 / 25.4); break;
    case 'in': px = value * 96; break;
    default: px = value;
  }

  // Convert from px to target
  switch (toUnit) {
    case 'px': return px;
    case 'rem': return px / rootFontSize;
    case 'em': return px / parentFontSize;
    case 'vw': return (px * 100) / viewportWidth;
    case 'vh': return (px * 100) / viewportHeight;
    case 'vmin': return (px * 100) / Math.min(viewportWidth, viewportHeight);
    case 'vmax': return (px * 100) / Math.max(viewportWidth, viewportHeight);
    case '%': return (px * 100) / parentFontSize;
    case 'pt': return px * (72 / 96);
    case 'cm': return px * (2.54 / 96);
    case 'mm': return px * (25.4 / 96);
    case 'in': return px / 96;
    default: return px;
  }
}

function formatValue(val) {
  if (Math.abs(val) < 0.001) return '0';
  if (Number.isInteger(val)) return val.toString();
  return parseFloat(val.toFixed(4)).toString();
}

const COMMON_VALUES = [4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128, 256, 320, 480, 640, 768, 1024, 1280];

export default function CssUnitConverter() {
  const [inputValue, setInputValue] = useState('16');
  const [fromUnit, setFromUnit] = useState('px');
  const [toUnit, setToUnit] = useState('rem');
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [showConfig, setShowConfig] = useState(false);
  const { copied, copyToClipboard } = useCopyToClipboard();

  const numValue = useMemo(() => parseFloat(inputValue) || 0, [inputValue]);

  const result = useMemo(() => convertUnit(numValue, fromUnit, toUnit, config), [numValue, fromUnit, toUnit, config]);

  const allConversions = useMemo(() => {
    return UNITS.map(unit => ({
      unit,
      value: convertUnit(numValue, fromUnit, unit, config),
    }));
  }, [numValue, fromUnit, config]);

  const commonTable = useMemo(() => {
    return COMMON_VALUES.map(px => ({
      px,
      rem: formatValue(convertUnit(px, 'px', 'rem', config)),
      em: formatValue(convertUnit(px, 'px', 'em', config)),
      pt: formatValue(convertUnit(px, 'px', 'pt', config)),
      vw: formatValue(convertUnit(px, 'px', 'vw', config)),
    }));
  }, [config]);

  const handleSwap = useCallback(() => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setInputValue(formatValue(result));
  }, [fromUnit, toUnit, result]);

  const cssOutput = `${formatValue(result)}${toUnit}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Ruler size={22} /></div>
          <div>
            <h1 className="text-xl font-bold">CSS Unit Converter</h1>
            <p className="text-xs opacity-50 mt-0.5">Convert between px, rem, em, vw, vh & more</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowConfig(!showConfig)} className={`btn btn-sm gap-1.5 ${showConfig ? 'btn-primary' : 'btn-ghost border border-base-300'}`}>
            <Settings size={14} /> Config
          </button>
          <button onClick={() => { setInputValue('16'); setFromUnit('px'); setToUnit('rem'); setConfig(DEFAULT_CONFIG); }} className="btn btn-sm btn-ghost gap-1.5"><RotateCcw size={14} /> Reset</button>
        </div>
      </motion.div>

      {/* Config Panel */}
      {showConfig && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="section-card p-5 space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2"><Settings size={14} className="text-primary" /> Configuration</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="field-label">Root Font Size</label>
              <div className="join w-full">
                <input type="number" value={config.rootFontSize} onChange={(e) => setConfig(c => ({ ...c, rootFontSize: parseFloat(e.target.value) || 16 }))} className="input input-sm join-item w-full font-mono" />
                <span className="join-item bg-base-200 flex items-center px-2 text-xs opacity-50 border border-base-300">px</span>
              </div>
            </div>
            <div>
              <label className="field-label">Parent Font Size</label>
              <div className="join w-full">
                <input type="number" value={config.parentFontSize} onChange={(e) => setConfig(c => ({ ...c, parentFontSize: parseFloat(e.target.value) || 16 }))} className="input input-sm join-item w-full font-mono" />
                <span className="join-item bg-base-200 flex items-center px-2 text-xs opacity-50 border border-base-300">px</span>
              </div>
            </div>
            <div>
              <label className="field-label">Viewport Width</label>
              <div className="join w-full">
                <input type="number" value={config.viewportWidth} onChange={(e) => setConfig(c => ({ ...c, viewportWidth: parseInt(e.target.value) || 1920 }))} className="input input-sm join-item w-full font-mono" />
                <span className="join-item bg-base-200 flex items-center px-2 text-xs opacity-50 border border-base-300">px</span>
              </div>
            </div>
            <div>
              <label className="field-label">Viewport Height</label>
              <div className="join w-full">
                <input type="number" value={config.viewportHeight} onChange={(e) => setConfig(c => ({ ...c, viewportHeight: parseInt(e.target.value) || 1080 }))} className="input input-sm join-item w-full font-mono" />
                <span className="join-item bg-base-200 flex items-center px-2 text-xs opacity-50 border border-base-300">px</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-40 self-center">Presets:</span>
            {DEVICE_PRESETS.map(d => (
              <button key={d.name} onClick={() => setConfig(c => ({ ...c, viewportWidth: d.width, viewportHeight: d.height }))} className="btn btn-xs btn-ghost border border-base-300 gap-1">
                <d.icon size={11} /> {d.name} ({d.width}×{d.height})
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Main Converter */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="section-card p-5">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-4 items-end">
          {/* From */}
          <div>
            <label className="field-label">From</label>
            <div className="join w-full">
              <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="input input-md join-item w-full font-mono text-lg" placeholder="Enter value" />
              <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="select select-md join-item border-l-0 font-mono font-semibold w-24">
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Swap */}
          <button onClick={handleSwap} className="btn btn-circle btn-ghost self-center mb-1"><ArrowLeftRight size={18} className="text-primary" /></button>

          {/* To */}
          <div>
            <label className="field-label">To</label>
            <div className="join w-full">
              <div className="input input-md join-item w-full font-mono text-lg flex items-center bg-base-200/50 font-bold text-primary">
                {formatValue(result)}
              </div>
              <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="select select-md join-item border-l-0 font-mono font-semibold w-24">
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Copy output */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-base-200">
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-50">CSS Value:</span>
            <code className="text-sm font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">{cssOutput}</code>
          </div>
          <button onClick={() => copyToClipboard(cssOutput)} className="btn btn-sm btn-primary gap-1.5">
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </motion.div>

      {/* All Conversions */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="section-card p-5">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Sparkles size={14} className="text-primary" /> All Conversions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {allConversions.map(({ unit, value }) => (
            <button
              key={unit}
              onClick={() => copyToClipboard(`${formatValue(value)}${unit}`)}
              className={`group text-left rounded-lg p-3 transition-all hover:bg-base-200/60 border ${unit === toUnit ? 'border-primary/30 bg-primary/5' : 'border-transparent'}`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-40 mb-0.5">{unit}</p>
              <p className="text-sm font-mono font-bold truncate">{formatValue(value)}</p>
              <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Copy size={10} className="opacity-40" />
                <span className="text-[9px] opacity-40">Click to copy</span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Common Reference Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="section-card p-5">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Info size={14} className="text-info" /> Common Values Reference</h3>
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                <th className="text-xs font-bold">px</th>
                <th className="text-xs font-bold">rem</th>
                <th className="text-xs font-bold">em</th>
                <th className="text-xs font-bold">pt</th>
                <th className="text-xs font-bold">vw</th>
              </tr>
            </thead>
            <tbody>
              {commonTable.slice(0, 12).map(row => (
                <tr key={row.px} className="hover">
                  <td className="font-mono text-xs">{row.px}px</td>
                  <td className="font-mono text-xs">{row.rem}rem</td>
                  <td className="font-mono text-xs">{row.em}em</td>
                  <td className="font-mono text-xs">{row.pt}pt</td>
                  <td className="font-mono text-xs">{row.vw}vw</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Visual Preview */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="section-card p-5">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Eye size={14} className="text-secondary" /> Visual Size Preview</h3>
        <div className="rounded-lg bg-base-200/50 p-6 space-y-4">
          {[numValue, numValue * 0.5, numValue * 2].map((val, i) => {
            const pxSize = Math.min(convertUnit(val, fromUnit, 'px', config), 400);
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[10px] font-mono opacity-40 w-20 shrink-0">{formatValue(val)}{fromUnit}</span>
                <div className="h-4 rounded-full bg-primary/30 transition-all duration-500" style={{ width: `${Math.max(2, pxSize)}px`, maxWidth: '100%' }} />
                <span className="text-[10px] font-mono opacity-30">{formatValue(pxSize)}px</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
