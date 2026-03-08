import { useState, useCallback, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, ChevronRight, ChevronDown, X, Sparkles } from 'lucide-react';
import { getTools, CATEGORIES, getToolsByCategory } from '../utils/toolRegistry';
import { useTheme } from '../contexts/ThemeContext';

export default function Sidebar({ isOpen, onClose }) {
  const tools = getTools();
  const { theme, themes } = useTheme();
  const currentTheme = themes.find((t) => t.id === theme);
  const toolCount = tools.filter((t) => t.id !== 'settings').length;
  const location = useLocation();
  const navRef = useRef(null);

  const sidebarCategories = CATEGORIES.filter((c) => c.id !== 'preferences');

  // Initialize: expand category of current active tool
  const getInitialOpen = () => {
    const currentTool = tools.find((t) => t.path === location.pathname);
    const openSet = new Set();
    if (currentTool && currentTool.category !== 'preferences') {
      openSet.add(currentTool.category);
    }
    if (openSet.size === 0 && sidebarCategories.length > 0) {
      openSet.add(sidebarCategories[0].id);
    }
    return openSet;
  };

  const [openCategories, setOpenCategories] = useState(getInitialOpen);

  // Auto-expand category when route changes
  useEffect(() => {
    const currentTool = tools.find((t) => t.path === location.pathname);
    if (currentTool && currentTool.category !== 'preferences') {
      setOpenCategories((prev) => {
        if (prev.has(currentTool.category)) return prev;
        const next = new Set(prev);
        next.add(currentTool.category);
        return next;
      });
    }
  }, [location.pathname, tools]);

  const toggleCategory = useCallback((categoryId) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  const handleNavClick = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 w-[272px] bg-base-100 border-r border-base-300/50 flex flex-col z-40 transition-transform duration-300 ease-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}
    >
      {/* ─── Logo ─── */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-base-300/50 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Wrench size={20} className="text-primary-content" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold leading-tight tracking-tight">Developer</h1>
          <h1 className="text-sm font-bold leading-tight gradient-text">Toolbox</h1>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-sm btn-square lg:hidden rounded-xl">
          <X size={18} />
        </button>
      </div>

      {/* ─── Navigation with Accordion ─── */}
      <nav ref={navRef} className="flex-1 overflow-y-auto py-3 px-3 scrollbar-thin">
        {sidebarCategories.map((category, catIdx) => {
          const categoryTools = getToolsByCategory(category.id);
          if (categoryTools.length === 0) return null;

          const isExpanded = openCategories.has(category.id);
          const hasActiveTool = categoryTools.some((t) => t.path === location.pathname);

          return (
            <div key={category.id} className={catIdx > 0 ? 'mt-1' : ''}>
              {/* ── Accordion Header ── */}
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.08em] transition-all duration-200 group cursor-pointer select-none ${
                  hasActiveTool
                    ? 'text-primary bg-primary/[0.04]'
                    : 'text-base-content/40 hover:text-base-content/60 hover:bg-base-200/50'
                }`}
              >
                <span className="text-sm leading-none">{category.emoji}</span>
                <span className="flex-1 text-left truncate">{category.label}</span>
                <span
                  className={`text-[9px] font-semibold tabular-nums min-w-[18px] h-[18px] flex items-center justify-center rounded-md transition-colors ${
                    hasActiveTool
                      ? 'bg-primary/10 text-primary'
                      : 'bg-base-200/80 text-base-content/30 group-hover:bg-base-200 group-hover:text-base-content/40'
                  }`}
                >
                  {categoryTools.length}
                </span>
                <motion.div
                  animate={{ rotate: isExpanded ? 0 : -90 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="shrink-0"
                >
                  <ChevronDown
                    size={12}
                    className={`transition-opacity duration-200 ${
                      hasActiveTool ? 'opacity-40' : 'opacity-25 group-hover:opacity-40'
                    }`}
                  />
                </motion.div>
              </button>

              {/* ── Accordion Content ── */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
                      opacity: { duration: 0.2, ease: 'easeOut' },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-0.5 pt-1 pb-2 pl-1">
                      {categoryTools.map((tool, idx) => {
                        const Icon = tool.icon;
                        return (
                          <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: idx * 0.025,
                              duration: 0.2,
                              ease: 'easeOut',
                            }}
                          >
                            <NavLink
                              to={tool.path}
                              onClick={handleNavClick}
                              className={({ isActive }) =>
                                `group/link relative flex items-center gap-2.5 px-3 py-[9px] rounded-xl text-[13px] font-medium transition-all duration-200 ${
                                  isActive
                                    ? 'bg-primary/[0.08] text-primary font-semibold'
                                    : 'text-base-content/55 hover:text-base-content/80 hover:bg-base-200/60'
                                }`
                              }
                            >
                              {({ isActive }) => (
                                <>
                                  {/* Active indicator bar */}
                                  {isActive && (
                                    <motion.div
                                      layoutId="sidebar-active-pill"
                                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full"
                                      style={{ boxShadow: '0 0 8px color-mix(in oklch, var(--color-primary) 40%, transparent)' }}
                                      transition={{
                                        type: 'spring',
                                        stiffness: 380,
                                        damping: 32,
                                      }}
                                    />
                                  )}

                                  {/* Icon */}
                                  <div
                                    className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 shrink-0 ${
                                      isActive
                                        ? 'bg-primary/12 text-primary'
                                        : 'text-base-content/40 group-hover/link:bg-base-200/80 group-hover/link:text-base-content/60'
                                    }`}
                                  >
                                    <Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} />
                                  </div>

                                  {/* Label */}
                                  <span className="flex-1 truncate">{tool.name}</span>

                                  {/* Arrow */}
                                  <ChevronRight
                                    size={13}
                                    strokeWidth={2}
                                    className={`shrink-0 transition-all duration-200 ${
                                      isActive
                                        ? 'opacity-40 translate-x-0'
                                        : 'opacity-0 -translate-x-2 group-hover/link:opacity-30 group-hover/link:translate-x-0'
                                    }`}
                                  />
                                </>
                              )}
                            </NavLink>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* ─── Settings — always visible ─── */}
        <div className="mt-3 pt-3">
          <div className="gradient-line mx-3 mb-3" />
          {getToolsByCategory('preferences').map((tool) => {
            const Icon = tool.icon;
            return (
              <NavLink
                key={tool.id}
                to={tool.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `group/link relative flex items-center gap-2.5 px-3 py-[9px] rounded-xl text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/[0.08] text-primary font-semibold'
                      : 'text-base-content/55 hover:text-base-content/80 hover:bg-base-200/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active-pill"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full"
                        style={{ boxShadow: '0 0 8px color-mix(in oklch, var(--color-primary) 40%, transparent)' }}
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    )}
                    <div
                      className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 shrink-0 ${
                        isActive
                          ? 'bg-primary/12 text-primary'
                          : 'text-base-content/40 group-hover/link:bg-base-200/80 group-hover/link:text-base-content/60'
                      }`}
                    >
                      <Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} />
                    </div>
                    <span className="flex-1 truncate">{tool.name}</span>
                    <ChevronRight
                      size={13}
                      strokeWidth={2}
                      className={`shrink-0 transition-all duration-200 ${
                        isActive
                          ? 'opacity-40 translate-x-0'
                          : 'opacity-0 -translate-x-2 group-hover/link:opacity-30 group-hover/link:translate-x-0'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* ─── Footer ─── */}
      <div className="px-5 py-3 border-t border-base-300/50 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs">{currentTheme?.emoji}</span>
            <p className="text-[11px] text-base-content/30 font-medium truncate">
              {currentTheme?.name || theme}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="badge badge-ghost badge-xs text-base-content/30 font-mono">v2.0</div>
            <div className="badge badge-primary badge-xs gap-1 font-semibold shadow-sm shadow-primary/10">
              <Sparkles size={8} />
              {toolCount}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
