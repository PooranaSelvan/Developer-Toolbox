import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, ChevronRight, X } from 'lucide-react';
import { getTools } from '../utils/toolRegistry';
import { useTheme } from '../contexts/ThemeContext';

export default function Sidebar({ isOpen, onClose }) {
  const tools = getTools();
  const { theme, themes } = useTheme();
  const currentTheme = themes.find((t) => t.id === theme);

  return (
    <aside className={`fixed left-0 top-0 bottom-0 w-[272px] bg-base-100 border-r border-base-300 flex flex-col z-40 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Logo section */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-base-300 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm">
          <Wrench size={20} className="text-primary-content" />
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-bold leading-tight">Developer</h1>
          <h1 className="text-sm font-bold leading-tight gradient-text">Toolbox</h1>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-sm btn-square lg:hidden">
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-5 px-4 space-y-1.5 scrollbar-thin">
        <p className="text-[11px] font-bold uppercase tracking-wider px-3 mb-3 opacity-40">
          Developer Tools
        </p>

        {tools.filter(t => ['readme-generator', 'api-tester', 'mock-api', 'jwt-decoder'].includes(t.id)).map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + idx * 0.04, duration: 0.3 }}
            >
              <NavLink
                to={tool.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    isActive
                      ? 'bg-primary/10 text-primary border-primary/20 font-semibold'
                      : 'border-transparent hover:bg-base-200/80 opacity-70 hover:opacity-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 shrink-0 ${
                      isActive ? 'bg-primary/15 text-primary' : 'text-base-content/60 group-hover:bg-base-200 group-hover:text-base-content/80'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <span className="flex-1 truncate">{tool.name}</span>
                    <ChevronRight
                      size={14}
                      className={`shrink-0 transition-all duration-200 ${
                        isActive
                          ? 'opacity-60 translate-x-0'
                          : 'opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </motion.div>
          );
        })}

        <p className="text-[11px] font-bold uppercase tracking-wider px-3 mt-5 mb-3 opacity-40">
          Frontend Tools
        </p>

        {tools.filter(t => ['regex-generator', 'color-palette', 'css-gradient', 'box-shadow', 'glassmorphism'].includes(t.id)).map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + idx * 0.04, duration: 0.3 }}
            >
              <NavLink
                to={tool.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    isActive
                      ? 'bg-primary/10 text-primary border-primary/20 font-semibold'
                      : 'border-transparent hover:bg-base-200/80 opacity-70 hover:opacity-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 shrink-0 ${
                      isActive ? 'bg-primary/15 text-primary' : 'text-base-content/60 group-hover:bg-base-200 group-hover:text-base-content/80'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <span className="flex-1 truncate">{tool.name}</span>
                    <ChevronRight
                      size={14}
                      className={`shrink-0 transition-all duration-200 ${
                        isActive
                          ? 'opacity-60 translate-x-0'
                          : 'opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </motion.div>
          );
        })}

        <p className="text-[11px] font-bold uppercase tracking-wider px-3 mt-5 mb-3 opacity-40">
          Preferences
        </p>

        {tools.filter(t => t.id === 'settings').map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.3 }}
            >
              <NavLink
                to={tool.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    isActive
                      ? 'bg-primary/10 text-primary border-primary/20 font-semibold'
                      : 'border-transparent hover:bg-base-200/80 opacity-70 hover:opacity-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 shrink-0 ${
                      isActive ? 'bg-primary/15 text-primary' : 'text-base-content/60 group-hover:bg-base-200 group-hover:text-base-content/80'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <span className="flex-1 truncate">{tool.name}</span>
                    <ChevronRight
                      size={14}
                      className={`shrink-0 transition-all duration-200 ${
                        isActive
                          ? 'opacity-60 translate-x-0'
                          : 'opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-base-300 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs">{currentTheme?.emoji}</span>
          <p className="text-xs opacity-40">
            v1.0.0 • {currentTheme?.name || theme} theme
          </p>
        </div>
      </div>
    </aside>
  );
}
