import { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, ChevronDown, AlertTriangle,
  CheckCircle2, Lightbulb, Sparkles,
  Wrench, Target, Award, ArrowRight,
} from 'lucide-react';
import { Shield, FileText, Terminal, Code, Users, Eye, Star, BookOpen, AlertCircle } from 'lucide-react';

/* ════════════════════════════════════════════════
   README Quality Scorer & Linter — UPGRADED
   Detailed analysis with actionable FIX suggestions
   that auto-populate form fields when clicked
   ════════════════════════════════════════════════ */

const CHECKS = [
  // Essential sections
  { id: 'has-title', category: 'structure', label: 'Has project title (H1)', weight: 10, test: (md) => /^#\s+.+/m.test(md) },
  { id: 'has-description', category: 'structure', label: 'Has description', weight: 8, test: (md, d) => !!d.description?.trim() },
  { id: 'has-installation', category: 'setup', label: 'Has installation instructions', weight: 8, test: (md, d) => !!d.installation?.trim() || (/install/i.test(md) && /```/.test(md)) },
  { id: 'has-usage', category: 'setup', label: 'Has usage / run instructions', weight: 7, test: (md, d) => !!d.usage?.trim() },
  { id: 'has-features', category: 'content', label: 'Lists features', weight: 6, test: (md, d) => !!d.features?.trim() },
  { id: 'has-license', category: 'community', label: 'Includes license info', weight: 7, test: (md, d) => !!d.license },
  { id: 'has-contributing', category: 'community', label: 'Has contribution guidelines', weight: 5, test: (md) => /contribut/i.test(md) },

  // Quality enhancers
  { id: 'has-badges', category: 'polish', label: 'Uses status badges', weight: 4, test: (md) => /shields\.io|badge/i.test(md) },
  { id: 'has-tech-stack', category: 'content', label: 'Lists tech stack', weight: 5, test: (md, d) => !!d.techStack?.trim() },
  { id: 'has-toc', category: 'structure', label: 'Has table of contents', weight: 4, test: (md) => /table of contents/i.test(md) || (md.match(/^\s*-\s*\[.+\]\(#.+\)/gm) || []).length >= 3 },
  { id: 'has-code-blocks', category: 'content', label: 'Contains code blocks', weight: 5, test: (md) => /```/.test(md) },
  { id: 'has-tables', category: 'content', label: 'Uses markdown tables', weight: 3, test: (md) => /\|.*\|.*\|/m.test(md) && /---/.test(md) },
  { id: 'has-screenshots', category: 'polish', label: 'Includes images or screenshots', weight: 4, test: (md, d) => !!d.screenshots?.trim() || /!\[.*\]\(.*\)/.test(md) },
  { id: 'has-demo-url', category: 'polish', label: 'Provides live demo link', weight: 3, test: (md, d) => !!d.demoUrl?.trim() },
  { id: 'has-author', category: 'community', label: 'Credits author', weight: 3, test: (md, d) => !!d.author?.trim() },
  { id: 'has-env-vars', category: 'setup', label: 'Documents environment variables', weight: 3, test: (md, d) => !!d.envVars?.trim() },
  { id: 'has-prerequisites', category: 'setup', label: 'Lists prerequisites', weight: 3, test: (md, d) => !!d.prerequisites?.trim() },
  { id: 'has-roadmap', category: 'content', label: 'Has roadmap / future plans', weight: 2, test: (md, d) => !!d.roadmap?.trim() },
  { id: 'has-faq', category: 'content', label: 'Includes FAQ section', weight: 2, test: (md, d) => !!d.faq?.trim() },
  { id: 'has-api', category: 'content', label: 'Documents API endpoints', weight: 2, test: (md, d) => !!d.apiReference?.trim() },

  // Word count thresholds
  { id: 'min-words-50', category: 'quality', label: 'At least 50 words', weight: 3, test: (md) => md.split(/\s+/).filter(Boolean).length >= 50 },
  { id: 'min-words-200', category: 'quality', label: 'At least 200 words (comprehensive)', weight: 4, test: (md) => md.split(/\s+/).filter(Boolean).length >= 200 },
  { id: 'min-sections-3', category: 'structure', label: 'At least 3 sections', weight: 4, test: (md) => (md.match(/^## /gm) || []).length >= 3 },
  { id: 'min-sections-6', category: 'structure', label: 'At least 6 sections (thorough)', weight: 3, test: (md) => (md.match(/^## /gm) || []).length >= 6 },
];

const CATEGORY_META = {
  structure: { label: 'Structure', icon: '🏗️', color: 'primary' },
  setup: { label: 'Setup & Install', icon: '⚙️', color: 'info' },
  content: { label: 'Content', icon: '📝', color: 'secondary' },
  community: { label: 'Community', icon: '🤝', color: 'success' },
  polish: { label: 'Polish', icon: '✨', color: 'warning' },
  quality: { label: 'Quality', icon: '📊', color: 'accent' },
};

/* ════════════════════════════════════════════════
   ACTIONABLE FIX SUGGESTIONS — the key upgrade!
   Each suggestion has a fix action that auto-fills
   ════════════════════════════════════════════════ */
const FIX_SUGGESTIONS = [
  {
    check: 'has-installation',
    severity: 'critical',
    icon: Terminal,
    title: '⚠️ Add installation section',
    description: 'Your README is missing installation instructions. Users need to know how to set up your project.',
    field: 'installation',
    fixLabel: 'Add Installation Steps',
    fixValue: `# Clone the repository\ngit clone https://github.com/username/project.git\ncd project\n\n# Install dependencies\nnpm install`,
  },
  {
    check: 'has-badges',
    severity: 'warning',
    icon: Shield,
    title: '🏷️ Your badges are missing',
    description: 'Badges provide at-a-glance project status (build, version, license). They make your README look professional.',
    field: 'badges',
    fixLabel: 'Add Starter Badges',
    fixValue: [
      { label: 'build', text: 'passing', color: '2ea043', style: 'for-the-badge', url: '' },
      { label: 'version', text: '1.0.0', color: '0969da', style: 'for-the-badge', url: '' },
      { label: 'PRs', text: 'welcome', color: '8b5cf6', style: 'for-the-badge', url: '' },
    ],
  },
  {
    check: 'has-description',
    severity: 'critical',
    icon: FileText,
    title: '📝 Add a project description',
    description: 'A clear description is the first thing visitors read. Explain what your project does and why it matters.',
    field: 'description',
    fixLabel: 'Add Placeholder Description',
    fixValue: 'A powerful, modern application that solves [problem] by providing [solution]. Built with [technologies] for optimal performance and developer experience.',
  },
  {
    check: 'has-features',
    severity: 'warning',
    icon: Star,
    title: '✨ List your project features',
    description: 'Highlight what makes your project special. Features help users decide if your project fits their needs.',
    field: 'features',
    fixLabel: 'Add Feature Template',
    fixValue: '🚀 Fast and lightweight\n🎨 Beautiful, responsive UI\n🔒 Secure by default\n📱 Mobile-friendly\n🔧 Easy to configure\n📖 Well documented',
  },
  {
    check: 'has-usage',
    severity: 'warning',
    icon: Code,
    title: '💻 Add usage examples',
    description: 'Show users how to run your project. Code examples reduce confusion and support issues.',
    field: 'usage',
    fixLabel: 'Add Usage Template',
    fixValue: '# Start the development server\nnpm run dev\n\n# Open in browser\nhttp://localhost:3000',
  },
  {
    check: 'has-license',
    severity: 'critical',
    icon: BookOpen,
    title: '📄 Choose a license',
    description: 'Without a license, your code is technically not open source. The MIT license is the most popular choice.',
    field: 'license',
    fixLabel: 'Set MIT License',
    fixValue: 'MIT',
  },
  {
    check: 'has-contributing',
    severity: 'info',
    icon: Users,
    title: '🤝 Add contributing guidelines',
    description: 'Encourage community participation with clear contribution instructions.',
    field: 'contributing',
    fixLabel: 'Add Contributing Template',
    fixValue: `Contributions are always welcome!\n\n1. Fork the project\n2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)\n3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)\n4. Push to the branch (\`git push origin feature/AmazingFeature\`)\n5. Open a Pull Request`,
  },
  {
    check: 'has-screenshots',
    severity: 'info',
    icon: Eye,
    title: '📸 Add screenshots or demo GIF',
    description: 'Visuals help users understand your project 10x faster than text. Add at least one screenshot.',
    field: 'screenshots',
    fixLabel: 'Add Screenshot Placeholder',
    fixValue: '![Screenshot](https://via.placeholder.com/800x400?text=Add+Your+Screenshot+Here)',
  },
  {
    check: 'has-demo-url',
    severity: 'info',
    icon: Eye,
    title: '🔗 Link to a live demo',
    description: 'A live demo lets users try your project instantly without installation.',
    field: 'demoUrl',
    fixLabel: 'Add Demo URL Placeholder',
    fixValue: 'https://your-project.vercel.app',
  },
  {
    check: 'has-tech-stack',
    severity: 'warning',
    icon: Code,
    title: '🛠️ List your tech stack',
    description: 'Help contributors understand the technologies used. Use the Context Analyzer to auto-detect from package.json.',
    field: 'techStack',
    fixLabel: 'Add Placeholder Stack',
    fixValue: 'React, Node.js, TailwindCSS',
  },
  {
    check: 'has-prerequisites',
    severity: 'info',
    icon: Terminal,
    title: '⚙️ List prerequisites',
    description: 'Tell users what they need installed before starting (Node.js version, databases, etc.).',
    field: 'prerequisites',
    fixLabel: 'Add Prerequisites Template',
    fixValue: '- [Node.js](https://nodejs.org/) (v16 or higher)\n- npm or yarn\n- Git',
  },
  {
    check: 'has-author',
    severity: 'info',
    icon: Users,
    title: '👤 Add author information',
    description: 'Let users know who maintains the project and how to reach you.',
    field: 'author',
    fixLabel: 'Add Author Placeholder',
    fixValue: 'your-username',
  },
  {
    check: 'has-env-vars',
    severity: 'info',
    icon: Terminal,
    title: '🔐 Document environment variables',
    description: 'If your project uses env vars, document them so users can configure properly.',
    field: 'envVars',
    fixLabel: 'Add Env Template',
    fixValue: 'DATABASE_URL=your_database_connection_string\nAPI_KEY=your_api_key_here\nPORT=3000',
  },
  {
    check: 'has-roadmap',
    severity: 'info',
    icon: Target,
    title: '🗺️ Add a roadmap',
    description: 'Show the project is actively maintained with planned features.',
    field: 'roadmap',
    fixLabel: 'Add Roadmap Template',
    fixValue: 'Add dark mode support\nImprove performance\nAdd more tests\nWrite better documentation\nAdd i18n support',
  },
];

const SEVERITY_CONFIG = {
  critical: { color: 'error', bg: 'bg-error/8', border: 'border-error/20', badge: 'badge-error', label: 'Critical' },
  warning: { color: 'warning', bg: 'bg-warning/8', border: 'border-warning/20', badge: 'badge-warning', label: 'Recommended' },
  info: { color: 'info', bg: 'bg-info/8', border: 'border-info/20', badge: 'badge-info', label: 'Nice to have' },
};

/* ─── Fix Suggestion Card ─── */
function FixSuggestionCard({ suggestion, onFix, isFixed }) {
  const severity = SEVERITY_CONFIG[suggestion.severity] || SEVERITY_CONFIG.info;
  const Icon = suggestion.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`rounded-xl border ${severity.border} ${severity.bg} p-3.5 transition-all duration-300 ${
        isFixed ? 'opacity-50 scale-[0.98]' : 'hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
          severity.color === 'error' ? 'bg-error/15' : severity.color === 'warning' ? 'bg-warning/15' : 'bg-info/15'
        }`}>
          <Icon size={14} className={
            severity.color === 'error' ? 'text-error' : severity.color === 'warning' ? 'text-warning' : 'text-info'
          } />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="text-xs font-bold">{suggestion.title}</h4>
            <span className={`badge badge-xs ${severity.badge} gap-0.5 opacity-80`}>
              {severity.label}
            </span>
          </div>
          <p className="text-[11px] text-base-content/60 leading-relaxed mb-2.5">
            {suggestion.description}
          </p>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onFix(suggestion)}
            disabled={isFixed}
            className={`btn btn-xs gap-1.5 rounded-lg transition-all duration-300 ${
              isFixed
                ? 'btn-success cursor-default'
                : 'btn-outline hover:btn-primary'
            }`}
          >
            {isFixed ? (
              <>
                <CheckCircle2 size={10} />
                Fixed!
              </>
            ) : (
              <>
                <Wrench size={10} />
                {suggestion.fixLabel}
                <ArrowRight size={9} />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Score Ring SVG ─── */
function ScoreRing({ score, size = 80 }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#3b82f6' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-base-200"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <motion.span
          className="text-lg font-black tabular-nums"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {score}
        </motion.span>
        <span className="text-[8px] font-bold text-base-content/50 uppercase tracking-wider">Score</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   Main Component — Enhanced with Fix Actions
   ════════════════════════════════════════════════ */
export default function ReadmeScore({ markdown, formData, onFix }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [fixedItems, setFixedItems] = useState({});
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'critical' | 'warning' | 'info'

  const analysis = useMemo(() => {
    if (!markdown?.trim()) return { score: 0, passed: [], failed: [], fixSuggestions: [], byCategory: {} };

    const results = CHECKS.map((check) => ({
      ...check,
      passed: check.test(markdown, formData),
    }));

    const totalWeight = results.reduce((sum, r) => sum + r.weight, 0);
    const earnedWeight = results.filter(r => r.passed).reduce((sum, r) => sum + r.weight, 0);
    const score = Math.round((earnedWeight / totalWeight) * 100);

    const passed = results.filter(r => r.passed);
    const failed = results.filter(r => !r.passed);

    // Build actionable fix suggestions from failed checks
    const fixSuggestions = FIX_SUGGESTIONS
      .filter(s => failed.some(f => f.id === s.check))
      .sort((a, b) => {
        const severityOrder = { critical: 0, warning: 1, info: 2 };
        return (severityOrder[a.severity] || 2) - (severityOrder[b.severity] || 2);
      });

    // Group by category
    const byCategory = {};
    Object.keys(CATEGORY_META).forEach(cat => {
      const checks = results.filter(r => r.category === cat);
      const passedCount = checks.filter(r => r.passed).length;
      byCategory[cat] = {
        total: checks.length,
        passed: passedCount,
        percent: checks.length > 0 ? Math.round((passedCount / checks.length) * 100) : 0,
        checks,
      };
    });

    return { score, passed, failed, fixSuggestions, byCategory };
  }, [markdown, formData]);

  const handleFix = useCallback((suggestion) => {
    if (!onFix) return;

    onFix(suggestion.field, suggestion.fixValue);
    setFixedItems(prev => ({ ...prev, [suggestion.check]: true }));
    
    setTimeout(() => {
      setFixedItems(prev => ({ ...prev, [suggestion.check]: false }));
    }, 3000);
  }, [onFix]);

  const getScoreLabel = (score) => {
    if (score >= 90) return { text: 'Exceptional', emoji: '🏆', color: 'text-success' };
    if (score >= 75) return { text: 'Great', emoji: '🌟', color: 'text-success' };
    if (score >= 60) return { text: 'Good', emoji: '👍', color: 'text-primary' };
    if (score >= 40) return { text: 'Fair', emoji: '📝', color: 'text-warning' };
    if (score >= 20) return { text: 'Basic', emoji: '🔨', color: 'text-warning' };
    return { text: 'Getting Started', emoji: '🚀', color: 'text-base-content/40' };
  };

  const label = getScoreLabel(analysis.score);

  const filteredSuggestions = analysis.fixSuggestions.filter(s => {
    if (activeFilter === 'all') return true;
    return s.severity === activeFilter;
  });

  const criticalCount = analysis.fixSuggestions.filter(s => s.severity === 'critical').length;
  const warningCount = analysis.fixSuggestions.filter(s => s.severity === 'warning').length;
  const infoCount = analysis.fixSuggestions.filter(s => s.severity === 'info').length;

  return (
    <div className="rounded-xl border border-base-300 bg-base-100 overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:p-5 flex items-center gap-3 hover:bg-base-200/30 transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center shrink-0">
          <ShieldCheck size={18} className="text-primary" />
        </div>

        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold">README Score</h3>
            <span className={`text-xs font-bold ${label.color}`}>{label.emoji} {label.text}</span>
            {analysis.fixSuggestions.length > 0 && (
              <span className="badge badge-xs badge-warning gap-0.5">
                <Wrench size={8} />
                {analysis.fixSuggestions.length} fix{analysis.fixSuggestions.length !== 1 ? 'es' : ''}
              </span>
            )}
          </div>
          {/* Mini progress bar */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 h-2 bg-base-200 rounded-full overflow-hidden max-w-48">
              <motion.div
                className={`h-full rounded-full ${
                  analysis.score >= 75 ? 'bg-success' : analysis.score >= 50 ? 'bg-primary' : analysis.score >= 25 ? 'bg-warning' : 'bg-base-300'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${analysis.score}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            <span className="text-xs font-bold tabular-nums text-base-content/70">{analysis.score}%</span>
            <span className="text-[10px] text-base-content/50 hidden sm:inline">
              {analysis.passed.length}/{CHECKS.length} checks
            </span>
          </div>
        </div>

        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-base-content/50" />
        </motion.div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-4 border-t border-base-200">
              
              {/* ── Score + Category Grid ── */}
              <div className="flex items-start gap-4 pt-4">
                {/* Score Ring */}
                <div className="shrink-0 hidden sm:block">
                  <ScoreRing score={analysis.score} />
                </div>

                {/* Category breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 flex-1">
                  {Object.entries(CATEGORY_META).map(([key, meta]) => {
                    const cat = analysis.byCategory[key];
                    if (!cat) return null;
                    return (
                      <div
                        key={key}
                        className="rounded-lg border border-base-200 bg-base-200/20 p-2.5 text-center"
                      >
                        <p className="text-xs mb-1">
                          <span className="mr-1">{meta.icon}</span>
                          <span className="font-semibold">{meta.label}</span>
                        </p>
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="w-10 h-1.5 bg-base-300 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                cat.percent >= 80 ? 'bg-success' : cat.percent >= 50 ? 'bg-primary' : cat.percent >= 25 ? 'bg-warning' : 'bg-base-300'
                              }`}
                              style={{ width: `${cat.percent}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold tabular-nums text-base-content/60">{cat.passed}/{cat.total}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ═══════════════════════════════════════
                 ACTIONABLE FIX SUGGESTIONS — NEW!
                 ═══════════════════════════════════════ */}
              {analysis.fixSuggestions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="text-xs font-bold flex items-center gap-2">
                      <Wrench size={13} className="text-warning" />
                      Fix Suggestions
                      <span className="badge badge-xs badge-warning">{analysis.fixSuggestions.length}</span>
                    </p>

                    {/* Severity Filter */}
                    <div className="flex items-center gap-1 bg-base-200/40 rounded-lg p-0.5">
                      <button
                        onClick={() => setActiveFilter('all')}
                        className={`btn btn-xs rounded-md ${activeFilter === 'all' ? 'btn-ghost bg-base-100 shadow-sm' : 'btn-ghost opacity-60'}`}
                      >
                        All ({analysis.fixSuggestions.length})
                      </button>
                      {criticalCount > 0 && (
                        <button
                          onClick={() => setActiveFilter('critical')}
                          className={`btn btn-xs rounded-md gap-1 ${activeFilter === 'critical' ? 'btn-error btn-outline shadow-sm' : 'btn-ghost opacity-60'}`}
                        >
                          <AlertCircle size={9} />
                          {criticalCount}
                        </button>
                      )}
                      {warningCount > 0 && (
                        <button
                          onClick={() => setActiveFilter('warning')}
                          className={`btn btn-xs rounded-md gap-1 ${activeFilter === 'warning' ? 'btn-warning btn-outline shadow-sm' : 'btn-ghost opacity-60'}`}
                        >
                          <AlertTriangle size={9} />
                          {warningCount}
                        </button>
                      )}
                      {infoCount > 0 && (
                        <button
                          onClick={() => setActiveFilter('info')}
                          className={`btn btn-xs rounded-md gap-1 ${activeFilter === 'info' ? 'btn-info btn-outline shadow-sm' : 'btn-ghost opacity-60'}`}
                        >
                          <Lightbulb size={9} />
                          {infoCount}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Suggestions List */}
                  <div className="space-y-2.5 max-h-[50vh] overflow-y-auto scrollbar-thin pr-1">
                    <AnimatePresence>
                      {filteredSuggestions.map((suggestion) => (
                        <FixSuggestionCard
                          key={suggestion.check}
                          suggestion={suggestion}
                          onFix={handleFix}
                          isFixed={fixedItems[suggestion.check]}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* ── All-green congratulations ── */}
              {analysis.fixSuggestions.length === 0 && analysis.score > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl border border-success/20 bg-success/5 p-4 text-center"
                >
                  <Award size={24} className="mx-auto text-success mb-2" />
                  <p className="text-sm font-bold text-success">Outstanding README! 🎉</p>
                  <p className="text-[11px] text-base-content/60 mt-1">
                    Your README passes all quality checks. Great documentation!
                  </p>
                </motion.div>
              )}

              {/* Full check list */}
              <div className="space-y-1.5">
                <p className="text-xs font-bold flex items-center gap-1.5 text-base-content/70">
                  <Sparkles size={12} />
                  All Checks ({analysis.passed.length} passed, {analysis.failed.length} remaining)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-48 overflow-y-auto scrollbar-thin pr-1">
                  {CHECKS.map((check) => {
                    const passed = analysis.passed.some(p => p.id === check.id);
                    return (
                      <div
                        key={check.id}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] transition-colors ${
                          passed ? 'text-success' : 'text-base-content/60'
                        }`}
                      >
                        {passed ? (
                          <CheckCircle2 size={10} className="text-success shrink-0" />
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full border border-base-300 shrink-0" />
                        )}
                        <span className={passed ? 'line-through text-success/70' : ''}>{check.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
