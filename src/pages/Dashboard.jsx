import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Wrench, Zap, Shield, Clock, Sparkles,
} from 'lucide-react';
import { getTools } from '../utils/toolRegistry';

export default function Dashboard() {
  const tools = getTools().filter((t) => t.id !== 'settings');

  return (
    <div className="max-w-4xl mx-auto">
      {/* ── Hero Section ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 pt-4"
      >
        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 mx-auto mb-6">
          <Wrench size={36} className="text-primary-content" />
        </div>

        <h1 className="text-3xl font-extrabold mb-3">
          Welcome to <span className="gradient-text">Developer Toolbox</span>
        </h1>
        <p className="max-w-lg mx-auto text-base opacity-60">
          Your all-in-one collection of developer utilities. Select a tool to get started.
        </p>
      </motion.div>

      {/* ── Feature Highlights ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-10">
        {[
          { icon: Zap, label: 'Lightning Fast', desc: 'Instant results', color: 'text-warning', bg: 'bg-warning/10' },
          { icon: Shield, label: 'Privacy First', desc: 'All client-side', color: 'text-success', bg: 'bg-success/10' },
          { icon: Clock, label: 'Save Time', desc: 'Automate tasks', color: 'text-info', bg: 'bg-info/10' },
        ].map(({ icon: Icon, label, desc, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
          >
            <div className="rounded-xl border border-base-300 bg-base-100 p-5 flex items-center gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon size={22} className={color} />
              </div>
              <div>
                <p className="text-sm font-bold">{label}</p>
                <p className="text-xs opacity-50 mt-0.5">{desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Tool Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tools.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.12, duration: 0.4 }}
            >
              <Link to={tool.path} className="group block">
                <div className="rounded-xl border border-base-300 bg-base-100 p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary transition-all duration-200 group-hover:bg-primary/15 group-hover:scale-105">
                      <Icon size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold mb-1.5 group-hover:text-primary transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-sm opacity-60 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                    <ArrowRight
                      size={18}
                      className="shrink-0 mt-1 opacity-30 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-70 group-hover:text-primary"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* ── Quick Tips Section ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <div className="rounded-xl border border-base-300 bg-base-100 p-6 mt-10">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-warning" />
            Quick Tips
          </h3>
          <ul className="space-y-2.5 text-sm opacity-60">
            <li className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              Use the <strong className="opacity-100">README Generator</strong> to create professional docs in seconds
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              The <strong className="opacity-100">API Tester</strong> supports auth, environments, code generation & more
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              Generate realistic test data with the <strong className="opacity-100">Mock API Generator</strong> — users, products, posts & more
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              Decode and inspect <strong className="opacity-100">JWT tokens</strong> with color-coded parts, claim descriptions & expiry checks
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              Build & test <strong className="opacity-100">Regex patterns</strong> with live matching, presets & code generation in 6 languages
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              Generate stunning <strong className="opacity-100">Color Palettes</strong>, <strong className="opacity-100">CSS Gradients</strong>, <strong className="opacity-100">Box Shadows</strong> & <strong className="opacity-100">Glassmorphism</strong> effects
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              Open <strong className="opacity-100">Settings</strong> to switch between 30+ beautiful themes
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
