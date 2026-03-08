import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Eye, Code, FileText, Hash, Clock, AlignLeft, Sparkles } from 'lucide-react';

export default function ReadmePreview({ markdown, stats }) {
  const [view, setView] = useState('preview');

  return (
    <div className="rounded-xl border border-base-300 bg-base-100 flex flex-col h-full min-h-[400px] lg:min-h-[600px]">
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-base-200">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Eye size={14} className="text-primary" />
            </div>
            Live Preview
            {markdown.trim() && (
              <span className="badge badge-xs badge-success gap-1">
                <span className="w-1 h-1 rounded-full bg-success-content animate-pulse-soft" />
                Live
              </span>
            )}
          </h3>

          <div className="flex gap-1 bg-base-200/50 rounded-xl p-1 border border-base-200/60">
            <button
              onClick={() => setView('preview')}
              className={`btn btn-xs gap-1.5 rounded-lg transition-all duration-200 ${view === 'preview' ? 'btn-primary shadow-sm' : 'btn-ghost'}`}
            >
              <Eye size={12} />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              onClick={() => setView('raw')}
              className={`btn btn-xs gap-1.5 rounded-lg transition-all duration-200 ${view === 'raw' ? 'btn-primary shadow-sm' : 'btn-ghost'}`}
            >
              <Code size={12} />
              <span className="hidden sm:inline">Raw</span>
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <AnimatePresence>
          {stats && markdown.trim() && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 sm:gap-4 mb-4 pb-3 border-b border-base-200/60 flex-wrap"
            >
              {[
                { icon: AlignLeft, label: `${stats.lines} lines` },
                { icon: FileText, label: `${stats.words} words` },
                { icon: Hash, label: `${stats.chars} chars` },
                { icon: Clock, label: `${stats.readingTime} min` },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px] opacity-40">
                  <Icon size={10} />
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="flex-1 overflow-auto scrollbar-thin">
          {!markdown.trim() ? (
            <div className="flex flex-col items-center justify-center h-full text-sm opacity-40 gap-3">
              <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center">
                <FileText size={28} className="opacity-30" />
              </div>
              <p className="font-medium text-center">Fill in the fields to see your README preview</p>
              <p className="text-xs opacity-60 flex items-center gap-1.5">
                <Sparkles size={10} />
                Start with Project Name and Description
              </p>
            </div>
          ) : view === 'preview' ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="markdown-preview"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {markdown}
              </ReactMarkdown>
            </motion.div>
          ) : (
            <motion.pre
              key="raw"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-xs font-mono whitespace-pre-wrap leading-relaxed rounded-xl p-4 bg-base-200 border border-base-300 select-all"
            >
              {markdown}
            </motion.pre>
          )}
        </div>
      </div>
    </div>
  );
}
