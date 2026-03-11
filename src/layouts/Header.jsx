import { useLocation, Link } from 'react-router-dom';
import { Palette, Sparkles, Menu, Home, ChevronRight, LayoutDashboard } from 'lucide-react';
import { getTools, CATEGORIES } from '../utils/toolRegistry';
import { useTheme } from '../contexts/ThemeContext';

export default function Header({ onMenuToggle }) {
  const location = useLocation();
  const tools = getTools();
  const currentTool = tools.find((t) => t.path === location.pathname);
  const { theme, setTheme, themes } = useTheme();

  const quickThemes = ['emerald', 'forest', 'light', 'dark', 'dracula', 'nord', 'cyberpunk', 'coffee'];
  const isHome = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';
  const toolCategory = currentTool ? CATEGORIES.find(c => c.id === currentTool.category) : null;

  return (
    <header 
      role="banner"
      className="h-14 sm:h-16 bg-base-100/80 backdrop-blur-2xl border-b border-base-300/30 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20 shadow-[0_1px_3px_-1px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile menu toggle */}
        <button 
          onClick={onMenuToggle} 
          className="btn btn-ghost btn-sm btn-square lg:hidden shrink-0 rounded-xl"
          aria-label="Toggle navigation menu"
          aria-expanded={false}
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb / Page indicator */}
        {currentTool ? (
          <div className="flex items-center gap-2 min-w-0">
            <Link 
              to="/" 
              className="btn btn-ghost btn-xs btn-square rounded-lg opacity-35 hover:opacity-100 hover:bg-primary/10 shrink-0 hidden sm:flex transition-all duration-200"
              aria-label="Go to homepage"
            >
              <Home size={14} />
            </Link>
            <ChevronRight size={12} className="text-base-content/15 hidden sm:block shrink-0" />
            {toolCategory && (
              <>
                <span className="text-[11px] font-medium text-base-content/30 hidden md:inline shrink-0">{toolCategory.emoji} {toolCategory.label}</span>
                <ChevronRight size={12} className="text-base-content/15 hidden md:block shrink-0" />
              </>
            )}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary/[0.08] flex items-center justify-center text-primary shrink-0 shadow-sm">
                <currentTool.icon size={15} strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold truncate leading-tight">{currentTool.name}</h2>
                <p className="text-[10px] opacity-35 truncate hidden sm:block leading-tight mt-0.5">{currentTool.description}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shadow-sm">
              {isDashboard ? (
                <LayoutDashboard size={15} className="text-primary" />
              ) : (
                <Sparkles size={15} className="text-primary" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight">
                {isHome ? 'Home' : isDashboard ? 'Dashboard' : 'Developer Toolbox'}
              </h2>
              <p className="text-[10px] opacity-35 hidden sm:block leading-tight mt-0.5">
                {isHome
                  ? 'Your all-in-one developer toolkit'
                  : isDashboard
                  ? `${tools.filter(t => t.id !== 'settings').length} tools available`
                  : 'Developer Toolbox'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Dashboard link (visible on homepage) */}
        {isHome && (
          <Link
            to="/dashboard"
            className="btn btn-ghost btn-sm gap-2.5 rounded-xl hover:bg-primary/8 transition-all duration-200 border border-transparent hover:border-base-300/40 hidden sm:inline-flex"
          >
            <LayoutDashboard size={14} className="opacity-60" />
            <span className="text-xs font-semibold">Dashboard</span>
          </Link>
        )}

        {/* Theme switcher */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-2 rounded-xl hover:bg-primary/8 transition-all duration-200 border border-transparent hover:border-base-300/40">
            <Palette size={14} className="opacity-60" />
            <span className="text-xs font-semibold hidden sm:inline">
              {themes.find(t => t.id === theme)?.emoji} Theme
            </span>
          </div>
          <div tabIndex={0} className="dropdown-content z-50 mt-3 p-4 shadow-2xl bg-base-100/98 backdrop-blur-2xl rounded-2xl border border-base-300/30 w-60">
            <p className="text-[10px] font-bold opacity-35 uppercase tracking-[0.1em] mb-3 px-0.5">Quick Switch</p>
            <div className="grid grid-cols-2 gap-1.5">
              {quickThemes.map((t) => {
                const themeData = themes.find((th) => th.id === t);
                if (!themeData) return null;
                return (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`btn btn-xs justify-start gap-2 rounded-lg transition-all duration-200 ${
                      theme === t ? 'btn-primary shadow-md shadow-primary/25' : 'btn-ghost hover:bg-base-200/80'
                    }`}
                  >
                    <span>{themeData.emoji}</span>
                    <span className="truncate">{themeData.name}</span>
                  </button>
                );
              })}
            </div>
            <div className="divider my-2.5 text-xs opacity-20">or</div>
            <Link to="/settings" className="btn btn-ghost btn-sm btn-block justify-start gap-2 text-primary rounded-xl hover:bg-primary/8 font-semibold">
              <Palette size={14} />
              All {themes.length} themes →
            </Link>
          </div>
        </div>

        {/* Online badge */}
        <div className="badge badge-success badge-sm gap-1.5 shadow-sm shadow-success/10 border-success/20 hidden sm:inline-flex font-semibold">
          <span className="inline-flex rounded-full h-1.5 w-1.5 bg-success-content" />
          Online
        </div>
      </div>
    </header>
  );
}
