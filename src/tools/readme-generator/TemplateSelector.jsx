import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, ChevronDown, Check } from 'lucide-react';
import { TEMPLATES } from '../../utils/readmeTemplates';

export default function TemplateSelector({ selected, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const current = TEMPLATES[selected];

  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
        <Layout size={14} className="text-primary" />
      </div>
      <span className="text-xs font-medium opacity-50 shrink-0 hidden sm:block">Template:</span>

      {/* Desktop: pill buttons — glassmorphic selector */}
      <div className="hidden md:flex flex-wrap gap-1.5 bg-base-200/40 p-1.5 rounded-xl backdrop-blur-sm border border-base-200/60">
        {Object.entries(TEMPLATES).map(([key, tmpl]) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(key)}
            className={`btn btn-xs gap-1.5 rounded-lg transition-all duration-200 ${selected === key ? 'btn-primary shadow-md shadow-primary/25' : 'btn-ghost hover:bg-base-100/80'}`}
            title={tmpl.description}
          >
            <span>{tmpl.emoji}</span>
            {tmpl.name}
            {selected === key && <Check size={10} />}
          </motion.button>
        ))}
      </div>

      {/* Mobile: dropdown */}
      <div className="relative md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-sm btn-ghost gap-2"
        >
          <span>{current?.emoji}</span>
          {current?.name}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={12} />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute left-0 top-full mt-1 w-64 bg-base-100 rounded-xl border border-base-300 shadow-xl z-50 py-1 overflow-hidden"
              >
                {Object.entries(TEMPLATES).map(([key, tmpl], i) => (
                  <motion.button
                    key={key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => { onSelect(key); setIsOpen(false); }}
                    className={`w-full text-left px-3 py-2.5 flex items-center gap-3 hover:bg-base-200 transition-colors ${selected === key ? 'bg-primary/10 text-primary' : ''}`}
                  >
                    <span className="text-base">{tmpl.emoji}</span>
                    <div className="flex-1">
                      <div className="text-xs font-medium">{tmpl.name}</div>
                      <div className="text-[10px] opacity-50">{tmpl.description}</div>
                    </div>
                    {selected === key && <Check size={12} className="text-primary shrink-0" />}
                  </motion.button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
