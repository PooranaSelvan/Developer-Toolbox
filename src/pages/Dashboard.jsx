import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Wrench, Zap, Shield, Clock, Sparkles,
  Search, X, Command, Heart,
} from 'lucide-react';
import { getTools, CATEGORIES, getToolsByCategory, searchTools } from '../utils/toolRegistry';

export default function Dashboard() {
  const tools = getTools().filter((t) => t.id !== 'settings');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const searchRef = useRef(null);

  // Keyboard shortcut: Cmd/Ctrl+K to focus search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setQuery('');
        searchRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const filteredTools = useMemo(() => {
    let result = tools;
    if (query.trim()) {
      result = searchTools(query);
    }
    if (selectedCategory !== 'all') {
      result = result.filter((t) => t.category === selectedCategory);
    }
    return result;
  }, [tools, query, selectedCategory]);

  const displayCategories = CATEGORIES.filter((c) => c.id !== 'preferences');

  return (
    <div className="max-w-5xl mx-auto">
      {/* ── Hero Section ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 pt-2"
      >
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/25 relative overflow-hidden">
            <Wrench size={36} className="text-primary-content relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shadow-md ring-2 ring-base-200">
            <Sparkles size={14} className="text-secondary-content" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight leading-tight">
          Developer <span className="gradient-text">Toolbox</span>
        </h1>
        <p className="max-w-lg mx-auto text-sm sm:text-base opacity-55 leading-relaxed">
          {tools.length} free, fast, and privacy-first developer utilities — all running client-side.
        </p>
      </motion.div>

      {/* ── Search Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-8"
      >
        <div className="relative max-w-xl mx-auto">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools... (e.g. JSON, color, API, hash)"
            className="input w-full pl-11 pr-24 h-12 text-sm rounded-2xl shadow-sm border-base-300/50 focus:shadow-lg focus:shadow-primary/5 transition-shadow"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {query && (
              <button onClick={() => setQuery('')} className="btn btn-ghost btn-xs btn-circle">
                <X size={14} />
              </button>
            )}
            <kbd className="kbd kbd-xs opacity-30 hidden sm:inline-flex gap-0.5">
              <Command size={10} />K
            </kbd>
          </div>
        </div>
      </motion.div>

      {/* ── Feature Highlights ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
      >
        {[
          { icon: Zap, label: 'Lightning Fast', desc: 'Instant results, zero latency', color: 'text-warning', bg: 'bg-warning/10' },
          { icon: Shield, label: 'Privacy First', desc: 'Everything runs client-side', color: 'text-success', bg: 'bg-success/10' },
          { icon: Clock, label: 'Save Time', desc: 'Automate repetitive tasks', color: 'text-info', bg: 'bg-info/10' },
        ].map(({ icon: Icon, label, desc, color, bg }) => (
          <div
            key={label}
            className="rounded-xl border border-base-300/40 bg-base-100 p-4 flex items-center gap-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-base-content/[0.04] group"
          >
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-sm font-bold">{label}</p>
              <p className="text-xs text-base-content/45 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── Category Filter ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex flex-wrap items-center gap-2 mb-6"
      >
        <button
          onClick={() => setSelectedCategory('all')}
          className={`btn btn-sm rounded-xl gap-1.5 ${
            selectedCategory === 'all' ? 'btn-primary shadow-sm' : 'btn-ghost border border-base-300/50'
          }`}
        >
          <Sparkles size={13} />
          All Tools
          <span className={`badge badge-xs ${selectedCategory === 'all' ? 'bg-primary-content/20 text-primary-content border-0' : 'badge-ghost'}`}>
            {tools.length}
          </span>
        </button>
        {displayCategories.map((cat) => {
          const count = getToolsByCategory(cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`btn btn-sm rounded-xl gap-1.5 ${
                selectedCategory === cat.id ? 'btn-primary shadow-sm' : 'btn-ghost border border-base-300/50'
              }`}
            >
              <span className="text-xs">{cat.emoji}</span>
              {cat.label}
              <span className={`badge badge-xs ${selectedCategory === cat.id ? 'bg-primary-content/20 text-primary-content border-0' : 'badge-ghost'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* ── Tool Cards ── */}
      <AnimatePresence mode="popLayout">
        {filteredTools.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool, i) => {
              const Icon = tool.icon;
              const category = CATEGORIES.find((c) => c.id === tool.category);
              return (
                <motion.div
                  key={tool.id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                >
                  <Link to={tool.path} className="group block h-full">
                    <div className="h-full rounded-xl border border-base-300/40 bg-base-100 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-base-content/[0.06] hover:border-primary/20 relative overflow-hidden">
                      {/* Subtle hover glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top left, color-mix(in oklch, var(--color-primary) 4%, transparent), transparent 70%)' }} />
                      <div className="relative flex items-start gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center shrink-0 text-primary transition-all duration-300 group-hover:bg-primary/12 group-hover:scale-[1.06] group-hover:shadow-md group-hover:shadow-primary/10">
                          <Icon size={22} strokeWidth={1.8} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="text-sm font-semibold group-hover:text-primary transition-colors duration-200 truncate">
                              {tool.name}
                            </h3>
                            <ArrowRight
                              size={14}
                              strokeWidth={2}
                              className="shrink-0 opacity-0 -translate-x-1.5 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-40 group-hover:text-primary"
                            />
                          </div>
                          <p className="text-xs text-base-content/50 leading-relaxed line-clamp-2">
                            {tool.description}
                          </p>
                          {category && (
                            <div className="mt-3">
                              <span className="badge badge-ghost badge-xs gap-1 text-base-content/40">
                                {category.emoji} {category.label}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="opacity-25" />
            </div>
            <p className="text-sm font-medium opacity-50 mb-1">No tools found for "{query}"</p>
            <p className="text-xs opacity-30 mb-4">Try a different search term</p>
            <button onClick={() => { setQuery(''); setSelectedCategory('all'); }} className="btn btn-sm btn-ghost">
              Clear filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Footer Credits ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-16 mb-4"
      >
        <div className="gradient-line mb-8" />

        <div className="flex flex-col items-center gap-4">
          {/* Author card */}
          <a
            href="https://github.com/PooranaSelvan"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-base-300/40 bg-base-100 hover:border-primary/20 hover:shadow-lg hover:shadow-base-content/[0.04] transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-base-300/50 group-hover:ring-primary/30 transition-all duration-200 shrink-0">
              <img
                src="https://avatars.githubusercontent.com/u/130943602?v=4"
                alt="Poorana Selvan"
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://ui-avatars.com/api/?name=PS&size=32&background=6366f1&color=fff&bold=true';
                }}
              />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold group-hover:text-primary transition-colors duration-200 flex items-center gap-1.5">
                Built by Poorana Selvan
                <svg viewBox="0 0 16 16" className="w-3 h-3 opacity-30 group-hover:opacity-60 transition-opacity" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </p>
              <p className="text-[10px] opacity-35">@PooranaSelvan</p>
            </div>
          </a>

          {/* Tech & love line */}
          <p className="text-[11px] opacity-25 flex items-center gap-1.5 flex-wrap justify-center">
            Crafted with <Heart size={10} className="text-error" /> using React, Tailwind CSS & DaisyUI
          </p>
        </div>
      </motion.div>
    </div>
  );
}
