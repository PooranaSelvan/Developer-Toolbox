import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon, Palette, Monitor, Check,
  Sun, Moon, Trash2, Database, Info, Sparkles
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Settings() {
  const { theme, setTheme, themes } = useTheme();
  const [filter, setFilter] = useState('all');
  const [cleared, setCleared] = useState(false);

  const filteredThemes = filter === 'all'
    ? themes
    : themes.filter((t) => t.category.toLowerCase() === filter);

  const handleClearData = () => {
    if (window.confirm('Are you sure? This will clear all saved API collections, history, and settings.')) {
      const currentTheme = theme;
      localStorage.clear();
      localStorage.setItem('devtoolbox-theme', currentTheme);
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    }
  };

  const storageUsed = (() => {
    let total = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        total += localStorage.getItem(key).length;
      }
    } catch {}
    return (total / 1024).toFixed(1);
  })();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <SettingsIcon size={20} className="text-primary" />
          </div>
          Settings
        </h1>
        <p className="text-sm opacity-60 mt-1 ml-[52px]">
          Customize your Developer Toolbox experience
        </p>
      </motion.div>

      {/* Appearance Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="rounded-xl border border-base-300 bg-base-100 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Palette size={18} className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Appearance</h2>
                <p className="text-xs opacity-60">Choose a theme that suits your style</p>
              </div>
            </div>

            {/* Active theme badge */}
            <div className="badge badge-primary badge-lg gap-2 font-semibold shrink-0">
              <Sparkles size={14} />
              {themes.find(t => t.id === theme)?.emoji} {themes.find(t => t.id === theme)?.name || theme}
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1.5 bg-base-200/60 w-fit p-1.5 rounded-xl mb-6 border border-base-200 overflow-x-auto">
            {['all', 'light', 'dark'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${filter === f ? 'bg-primary text-primary-content shadow-sm' : 'hover:bg-base-100 text-base-content/60'}`}
              >
                {f === 'all' && <Monitor size={14} />}
                {f === 'light' && <Sun size={14} />}
                {f === 'dark' && <Moon size={14} />}
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span className={`badge badge-xs ${filter === f ? 'bg-primary-content/20 text-primary-content border-0' : 'badge-ghost'}`}>
                  {f === 'all' ? themes.length : themes.filter(t => t.category.toLowerCase() === f).length}
                </span>
              </button>
            ))}
          </div>

          {/* Theme grid */}
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {filteredThemes.map((t, i) => {
              const isActive = theme === t.id;
              return (
                <motion.button
                  key={t.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02, duration: 0.25 }}
                  onClick={() => setTheme(t.id)}
                  data-theme={t.id}
                  className={`group relative rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md ${
                    isActive
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-base-100 shadow-md'
                      : 'border border-base-300 hover:border-primary/30'
                  }`}
                >
                  {/* Theme preview */}
                  <div className="bg-base-100 p-3">
                    {/* Color dots */}
                    <div className="flex gap-1.5 mb-2.5">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    </div>

                    {/* Lines */}
                    <div className="space-y-1.5">
                      <div className="flex gap-1.5">
                        <div className="h-2 flex-1 rounded-full bg-primary" />
                        <div className="h-2 w-4 rounded-full bg-secondary" />
                      </div>
                      <div className="flex gap-1.5">
                        <div className="h-2 w-6 rounded-full bg-base-300" />
                        <div className="h-2 flex-1 rounded-full bg-accent" />
                      </div>
                      <div className="flex gap-1.5">
                        <div className="h-2 flex-1 rounded-full bg-base-300" />
                        <div className="h-2 w-8 rounded-full bg-primary" />
                      </div>
                    </div>

                    {/* Color bar */}
                    <div className="flex gap-1 mt-2.5">
                      <div className="h-3 flex-1 rounded bg-primary opacity-20" />
                      <div className="h-3 flex-1 rounded bg-secondary opacity-20" />
                      <div className="h-3 flex-1 rounded bg-accent opacity-20" />
                      <div className="h-3 flex-1 rounded bg-neutral opacity-20" />
                    </div>
                  </div>

                  {/* Theme label */}
                  <div className="bg-base-200 px-3 py-2 flex items-center gap-2">
                    <span className="text-xs">{t.emoji}</span>
                    <span className="text-xs font-semibold text-base-content truncate">{t.name}</span>
                    {isActive && (
                      <Check size={14} className="ml-auto text-primary shrink-0" />
                    )}
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-1.5 right-1.5 z-10">
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                        <Check size={10} className="text-primary-content" />
                      </div>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Data & Storage Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="rounded-xl border border-base-300 bg-base-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center">
              <Database size={18} className="text-warning" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Data & Storage</h2>
              <p className="text-xs opacity-60">Manage your locally stored data</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl bg-base-200/60 border border-base-300 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium opacity-50">Storage Used</span>
                <Database size={16} className="text-primary opacity-40" />
              </div>
              <p className="text-2xl font-bold">
                {storageUsed} <span className="text-sm font-normal opacity-50">KB</span>
              </p>
              <p className="text-[11px] opacity-40 mt-1">API history, collections, theme prefs</p>
            </div>
            <div className="rounded-xl bg-base-200/60 border border-base-300 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium opacity-50">Storage Items</span>
                <Info size={16} className="text-secondary opacity-40" />
              </div>
              <p className="text-2xl font-bold">
                {localStorage.length}
              </p>
              <p className="text-[11px] opacity-40 mt-1">Keys stored in browser</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleClearData}
              className="btn btn-error btn-sm gap-2 rounded-xl"
            >
              <Trash2 size={14} />
              Clear All Data
            </button>

            {cleared && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="alert alert-success py-2 px-4"
              >
                <Check size={16} />
                <span className="text-sm font-medium">All data cleared successfully!</span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="rounded-xl border border-base-300 bg-base-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-info/10 flex items-center justify-center">
              <Info size={18} className="text-info" />
            </div>
            <div>
              <h2 className="text-lg font-bold">About</h2>
              <p className="text-xs opacity-60">Developer Toolbox information</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-sm">
              <tbody>
                <tr><td className="font-semibold opacity-70">Version</td><td>1.0.0</td></tr>
                <tr><td className="font-semibold opacity-70">Framework</td><td>React 19 + Vite 5</td></tr>
                <tr><td className="font-semibold opacity-70">UI Library</td><td>DaisyUI + TailwindCSS</td></tr>
                <tr><td className="font-semibold opacity-70">Available Themes</td><td>{themes.length} themes</td></tr>
                <tr><td className="font-semibold opacity-70">Storage</td><td>Browser LocalStorage (client-side only)</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
