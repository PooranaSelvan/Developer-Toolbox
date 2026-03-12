import { useMemo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight, Wrench, Zap, Shield, Sparkles,
  Heart, TrendingUp, Code2,
  ChevronRight, Star, Globe, Layers,
  Palette,
  ExternalLink, ArrowUpRight, TerminalSquare, CheckCircle2,
} from 'lucide-react';
import { getTools, CATEGORIES, getToolsByCategory } from '../utils/toolRegistry';
import SEO from '../components/SEO';

const RECENT_TOOLS_KEY = 'devtoolbox-recent-tools';
function getRecentTools() {
  try { return JSON.parse(localStorage.getItem(RECENT_TOOLS_KEY) || '[]'); }
  catch { return []; }
}

const FEATURED_TOOL_IDS = ['api-tester', 'json-formatter', 'color-palette', 'frontend-playground', 'regex-generator', 'jwt-decoder'];

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// Animated counter hook
function useCounter(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = target;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return { count, ref };
}

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }) {
  return (
    <motion.div
      variants={itemVariants}
      className="group rounded-2xl border border-base-300/40 bg-base-100 p-6 h-full flex flex-col transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.04] hover:-translate-y-1 card-shine"
    >
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
        <Icon size={22} className="text-white" />
      </div>
      <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors duration-200">{title}</h3>
      <p className="text-sm opacity-50 leading-relaxed flex-1">{description}</p>
    </motion.div>
  );
}

function ToolShowcaseCard({ tool }) {
  const Icon = tool.icon;
  const category = CATEGORIES.find((c) => c.id === tool.category);

  return (
    <motion.div variants={itemVariants}>
      <Link
        to={tool.path}
        className="group block h-full"
        onClick={() => {
          try {
            const recent = getRecentTools().filter(id => id !== tool.id);
            recent.unshift(tool.id);
            localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(recent.slice(0, 8)));
          } catch {}
        }}
      >
        <div className="h-full rounded-2xl border border-base-300/40 bg-base-100 p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/[0.08] hover:-translate-y-1.5 card-shine gradient-border-hover">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-xl bg-primary/[0.08] flex items-center justify-center text-primary transition-all duration-300 group-hover:bg-primary/[0.14] group-hover:scale-110 group-hover:shadow-md group-hover:shadow-primary/10 group-hover:rotate-[-3deg]">
              <Icon size={26} strokeWidth={1.7} />
            </div>
            <ArrowUpRight
              size={18}
              className="opacity-0 transition-all duration-200 group-hover:opacity-50 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 text-primary"
            />
          </div>

          <h3 className="text-[15px] font-bold mb-2 group-hover:text-primary transition-colors duration-200">
            {tool.name}
          </h3>
          <p className="text-xs text-base-content/50 leading-relaxed mb-4 line-clamp-2">
            {tool.description}
          </p>

          <div className="flex items-center justify-between">
            {category && (
              <span className="badge badge-ghost badge-xs gap-1 text-base-content/35 font-medium">
                {category.emoji} {category.label}
              </span>
            )}
            <span className="text-[11px] font-semibold text-primary opacity-0 group-hover:opacity-70 transition-all duration-200 flex items-center gap-1 group-hover:translate-x-0.5">
              Open tool <ChevronRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function HomePage() {
  const tools = useMemo(() => getTools().filter((t) => t.id !== 'settings'), []);
  const featuredTools = useMemo(
    () => FEATURED_TOOL_IDS.map(id => tools.find(t => t.id === id)).filter(Boolean),
    [tools]
  );
  const displayCategories = CATEGORIES.filter((c) => c.id !== 'preferences');

  const recentToolIds = useMemo(() => getRecentTools(), []);
  const recentTools = useMemo(() => {
    return recentToolIds.map(id => tools.find(t => t.id === id)).filter(Boolean).slice(0, 4);
  }, [recentToolIds, tools]);

  // Counters for stats
  const toolCounter = useCounter(tools.length, 1200);
  const themeCounter = useCounter(30, 1200);
  const privacyCounter = useCounter(100, 1000);

  return (
    <>
      <SEO 
        title="Home - WebToolkit"
        description={`${tools.length} free, fast, and privacy-first developer utilities — all running client-side.`}
        keywords="developer tools, web utilities, online tools, developer utilities"
      />
      <div className="max-w-6xl mx-auto" role="main">
        {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative text-center pt-6 sm:pt-10 pb-16 sm:pb-20">
        {/* Animated background accents */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 left-1/4 w-80 h-80 rounded-full blur-3xl bg-primary opacity-[0.04]"
            animate={{ x: [0, 20, -10, 0], y: [0, -15, 10, 0], scale: [1, 1.05, 0.95, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-12 right-1/4 w-64 h-64 rounded-full blur-3xl bg-secondary opacity-[0.03]"
            animate={{ x: [0, -15, 20, 0], y: [0, 10, -15, 0], scale: [1, 0.95, 1.08, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.06] hover:bg-primary/[0.1] transition-colors duration-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-semibold text-primary">
              {tools.length}+ Free Developer Tools
            </span>
            <Sparkles size={12} className="text-primary opacity-60" />
          </div>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-8"
        >
          <div className="absolute inset-[-8px] rounded-[28px] bg-primary/10 animate-glow-pulse blur-xl" />
          <div className="w-full h-full rounded-3xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-xl shadow-primary/20 relative overflow-hidden">
            <Wrench size={44} className="text-primary-content relative z-10 sm:w-12 sm:h-12" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent" />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 400, damping: 15 }}
            className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shadow-lg ring-3 ring-base-200"
          >
            <Sparkles size={18} className="text-secondary-content" />
          </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-5 tracking-tight leading-[1.1]"
        >
          Your All-in-One
          <br />
          <span className="gradient-text-animated">WebToolkit</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto text-base sm:text-lg opacity-50 leading-relaxed mb-10 px-4"
        >
          {tools.length} beautifully crafted, lightning-fast utilities — all running client-side
          with zero data collection. Build faster, ship better.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6"
        >
          <Link to="/dashboard" className="btn btn-primary btn-lg rounded-full px-8 font-bold gap-2.5 btn-shimmer shadow-sm shadow-primary/10 hover:shadow-md hover:shadow-primary/15 btn-gradient-primary cta-glow">
            <TerminalSquare size={18} />
            Explore All Tools
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href="https://github.com/PooranaSelvan/Developer-Toolbox"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline rounded-full gap-2.5 px-7 border-base-300/50 hover:border-primary/30 hover:bg-primary/5"
          >
            <Star size={16} />
            Star on GitHub
            <ExternalLink size={13} className="opacity-40" />
          </a>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex items-center justify-center gap-4 sm:gap-6 text-xs opacity-35 flex-wrap"
        >
          {[
            { icon: Shield, text: 'Privacy First' },
            { icon: Zap, text: 'Zero Latency' },
            { icon: Globe, text: 'Works Offline' },
            { icon: Code2, text: 'Open Source' },
          ].map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity duration-200">
              <Icon size={13} /> {text}
            </span>
          ))}
        </motion.div>
      </section>

      {/* ═══════════ FEATURES SECTION ═══════════ */}
      <AnimatedSection className="mb-20">
        <div className="text-center mb-10">
          <span className="badge badge-primary badge-sm gap-1.5 mb-3 font-semibold shadow-sm shadow-primary/15">
            <Zap size={11} /> Why WebToolkit?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Built for <span className="gradient-text">Speed & Privacy</span>
          </h2>
          <p className="text-sm opacity-45 mt-2 max-w-lg mx-auto">
            Every tool runs entirely in your browser — your data never leaves your machine.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <FeatureCard
            icon={Zap}
            title="Lightning Fast"
            description="Instant results with zero network requests. Everything processes client-side for the fastest possible experience."
            color="bg-gradient-to-br from-amber-500 to-orange-500"
          />
          <FeatureCard
            icon={Shield}
            title="100% Private"
            description="Your data never leaves your browser. No servers, no tracking, no analytics — complete privacy by design."
            color="bg-gradient-to-br from-blue-500 to-cyan-500"
          />
          <FeatureCard
            icon={Layers}
            title={`${tools.length}+ Pro Tools`}
            description="A comprehensive toolkit covering every developer need in one place, with new tools added regularly."
            color="bg-gradient-to-br from-blue-500 to-indigo-500"
          />
          <FeatureCard
            icon={Palette}
            title="Beautiful UI"
            description="30+ handcrafted themes with modern design. Dark mode, light mode, and everything in between."
            color="bg-gradient-to-br from-purple-500 to-pink-500"
          />
        </motion.div>
      </AnimatedSection>

      {/* ═══════════ RECENTLY USED (if any) ═══════════ */}
      {recentTools.length > 0 && (
        <AnimatedSection className="mb-16">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp size={15} className="text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Continue Where You Left Off</h2>
              <p className="text-[11px] opacity-40">Your recently used tools</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {recentTools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                >
                  <Link
                    to={tool.path}
                    className="group flex items-center gap-3 p-4 rounded-xl border border-base-300/40 bg-base-100/80 hover:border-primary/25 hover:bg-primary/[0.04] transition-all duration-200 h-full"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/12 group-hover:scale-105 transition-all duration-200">
                      <Icon size={18} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold truncate block group-hover:text-primary transition-colors duration-200">{tool.name}</span>
                      <span className="text-[10px] opacity-35 truncate block">{tool.description.slice(0, 30)}...</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </AnimatedSection>
      )}

      {/* ═══════════ FEATURED TOOLS ═══════════ */}
      <AnimatedSection className="mb-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="badge badge-secondary badge-sm gap-1.5 mb-2 font-semibold shadow-sm">
              <Star size={11} /> Featured
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Popular Tools
            </h2>
            <p className="text-sm opacity-45 mt-1">The most-loved utilities in our collection</p>
          </div>
          <Link
            to="/dashboard"
            className="btn btn-ghost btn-sm rounded-xl gap-2 text-primary hover:bg-primary/8 font-semibold group/btn"
          >
            View all {tools.length} tools
            <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {featuredTools.map((tool) => (
            <ToolShowcaseCard key={tool.id} tool={tool} />
          ))}
        </motion.div>
      </AnimatedSection>

      {/* ═══════════ TOOL CATEGORIES ═══════════ */}
      <AnimatedSection className="mb-20">
        <div className="text-center mb-10">
          <span className="badge badge-ghost badge-sm gap-1.5 mb-3 font-semibold">
            <Layers size={11} /> Categories
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Explore by <span className="gradient-text">Category</span>
          </h2>
          <p className="text-sm opacity-45 mt-2">Find the right tool for every task</p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {displayCategories.map((category) => {
            const categoryTools = getToolsByCategory(category.id);
            return (
              <motion.div key={category.id} variants={itemVariants}>
                <Link to={`/dashboard?category=${category.id}`} className="group block h-full">
                <div className="rounded-2xl border border-base-300/40 bg-base-100 p-6 h-full transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.05] hover:-translate-y-1 card-shine">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl group-hover:scale-110 group-hover:rotate-[-6deg] transition-all duration-300">{category.emoji}</span>
                    <span className="badge badge-primary badge-sm font-bold shadow-sm shadow-primary/15">
                      {categoryTools.length} tools
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-200">{category.label}</h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {categoryTools.slice(0, 3).map((tool) => (
                      <span key={tool.id} className="badge badge-ghost badge-xs font-medium">
                        {tool.name}
                      </span>
                    ))}
                    {categoryTools.length > 3 && (
                      <span className="badge badge-ghost badge-xs font-medium opacity-50">
                        +{categoryTools.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary opacity-60 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5">
                    Browse category <ChevronRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatedSection>

      {/* ═══════════ STATS SECTION ═══════════ */}
      <AnimatedSection className="mb-20">
        <div className="relative rounded-3xl overflow-hidden border border-base-300/30">
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, color-mix(in oklch, var(--color-primary) 8%, var(--color-base-100)), var(--color-base-100), color-mix(in oklch, var(--color-secondary, var(--color-primary)) 6%, var(--color-base-100)))'
          }} />

          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-px">
            {[
              { counter: toolCounter, label: 'Developer Tools', suffix: '+', icon: Wrench },
              { counter: themeCounter, label: 'Themes Available', suffix: '+', icon: Palette },
              { counter: privacyCounter, label: 'Client-Side', suffix: '%', icon: Shield },
              { value: 0, label: 'Data Collected', suffix: '', icon: CheckCircle2 },
            ].map(({ counter, value, label, suffix, icon: Icon }, idx) => (
              <div key={label} className="p-5 sm:p-8 lg:p-10 text-center relative group">
                {idx > 0 && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-base-300/20 hidden lg:block" />
                )}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={16} className="text-primary sm:w-[18px] sm:h-[18px]" />
                </div>
                <div ref={counter?.ref} className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-1">
                  <span className="gradient-text">{counter ? counter.count : value}{suffix}</span>
                </div>
                <p className="text-[10px] sm:text-xs font-semibold opacity-45">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════ ALL TOOLS GRID ═══════════ */}
      <AnimatedSection className="mb-20">
        <div className="text-center mb-10">
          <span className="badge badge-ghost badge-sm gap-1.5 mb-3 font-semibold">
            <Wrench size={11} /> Complete Collection
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            All <span className="gradient-text">{tools.length} Tools</span>
          </h2>
          <p className="text-sm opacity-45 mt-2">Every utility you need, in one place</p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {tools.map((tool) => (
            <ToolShowcaseCard key={tool.id} tool={tool} />
          ))}
        </motion.div>
      </AnimatedSection>

      {/* ═══════════ CTA SECTION ═══════════ */}
      <AnimatedSection className="mb-16">
        <div className="relative rounded-3xl overflow-hidden border border-primary/20">
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, color-mix(in oklch, var(--color-primary) 12%, var(--color-base-100)), color-mix(in oklch, var(--color-primary) 6%, var(--color-base-100)), color-mix(in oklch, var(--color-secondary, var(--color-primary)) 8%, var(--color-base-100)))'
          }} />
          
          {/* Subtle animated background */}
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl bg-primary/5"
            animate={{ x: [0, 20, 0], y: [0, -15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative px-8 py-14 sm:py-16 text-center">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 relative"
              whileHover={{ scale: 1.05, rotate: 3 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-glow-pulse" />
              <Sparkles size={28} className="text-primary relative z-10" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight">
              Ready to <span className="gradient-text-animated">Build Faster</span>?
            </h2>
            <p className="text-sm sm:text-base opacity-50 max-w-lg mx-auto mb-8 leading-relaxed">
              Jump into the dashboard and start using {tools.length}+ tools right now.
              No sign-up, no limits — completely free.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/dashboard" className="btn btn-primary rounded-full px-8 font-bold gap-2.5 btn-shimmer shadow-sm shadow-primary/10 hover:shadow-md hover:shadow-primary/15 btn-gradient-primary cta-glow">
                <TerminalSquare size={17} />
                Open Dashboard
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/settings"
                className="btn btn-outline rounded-full gap-2.5 px-6 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
              >
                <Palette size={15} />
                Browse 30+ Themes
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="mb-8">
        <div className="gradient-line mb-8" />
        <div className="flex flex-col items-center gap-5">
          <a
            href="https://github.com/PooranaSelvan"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-base-300/40 bg-base-100/80 hover:border-primary/20 hover:shadow-lg transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-base-300/40 group-hover:ring-primary/30 transition-colors duration-200 shrink-0">
              <img
                src="https://avatars.githubusercontent.com/u/130943602?v=4"
                alt="Poorana Selvan"
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://ui-avatars.com/api/?name=PS&size=40&background=2D79FF&color=fff&bold=true';
                }}
              />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold group-hover:text-primary transition-colors duration-200 flex items-center gap-1.5">
                Built by Poorana Selvan
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 opacity-25 group-hover:opacity-60 transition-opacity" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </p>
              <p className="text-[10px] opacity-30">@PooranaSelvan</p>
            </div>
          </a>
          <p className="text-[11px] opacity-20 flex items-center gap-1.5 flex-wrap justify-center">
            Crafted with <Heart size={10} className="text-error" /> by Poorana Selvan
          </p>
        </div>
      </footer>
      </div>
    </>
  );
}
