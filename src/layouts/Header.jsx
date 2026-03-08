import { useLocation, Link } from 'react-router-dom';
import { Palette, Sparkles, Menu, Home } from 'lucide-react';
import { getTools, CATEGORIES } from '../utils/toolRegistry';
import { useTheme } from '../contexts/ThemeContext';

export default function Header({ onMenuToggle }) {
  const location = useLocation();
  const tools = getTools();
  const currentTool = tools.find((t) => t.path === location.pathname);
  const { theme, setTheme, themes } = useTheme();

  const quickThemes = ['emerald', 'forest', 'light', 'dark', 'dracula', 'nord', 'cyberpunk', 'coffee'];
  const isHome = location.pathname === '/';
  const toolCategory = currentTool ? CATEGORIES.find(c => c.id === currentTool.category) : null;

  return (
    <header className="h-14 sm:h-16 bg-base-100/80 backdrop-blur-xl border-b border-base-300/30 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile hamburger */}
        <button onClick={onMenuToggle} className="btn btn-ghost btn-sm btn-square lg:hidden shrink-0">
          <Menu size={20} />
        </button>

        {/* Breadcrumb-style navigation */}
        {currentTool ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <Link to="/" className="btn btn-ghost btn-xs btn-square rounded-lg opacity-40 hover:opacity-100 shrink-0 hidden sm:flex">
              <Home size={14} />
            </Link>
            <span className="text-base-content/20 hidden sm:inline">/</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <currentTool.icon size={16} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold truncate">{currentTool.name}</h2>
                {toolCategory && (
                  <span className="badge badge-ghost badge-xs gap-1 hidden sm:inline-flex shrink-0">
                    {toolCategory.emoji} {toolCategory.label}
                  </span>
                )}
              </div>
              <p className="text-[11px] opacity-40 truncate hidden sm:block">{currentTool.description}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center">
              <Sparkles size={16} className="text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">{isHome ? 'Dashboard' : 'Developer Toolbox'}</h2>
              <p className="text-[11px] opacity-40 hidden sm:block">
                {isHome ? `${tools.filter(t => t.id !== 'settings').length} tools available` : 'Your all-in-one developer toolkit'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Theme switcher */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-2 rounded-xl hover:bg-primary/10 hover:shadow-sm transition-all duration-200">
            <Palette size={15} />
            <span className="text-xs font-medium hidden sm:inline">
              {themes.find(t => t.id === theme)?.emoji} Theme
            </span>
          </div>
          <div tabIndex={0} className="dropdown-content z-50 mt-2 p-3 shadow-2xl bg-base-100/95 backdrop-blur-xl rounded-xl border border-base-300/30 w-56">
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-2.5 px-1">Quick Switch</p>
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
            <div className="divider my-2 text-xs opacity-30">or</div>
            <Link to="/settings" className="btn btn-ghost btn-sm btn-block justify-start gap-2 text-primary rounded-lg hover:bg-primary/10">
              <Palette size={14} />
              All {themes.length} themes →
            </Link>
          </div>
        </div>

        {/* Online status */}
        <div className="badge badge-success badge-sm gap-1.5 shadow-sm shadow-success/15 border-success/30 hidden sm:inline-flex">
          <span className="w-1.5 h-1.5 rounded-full bg-success-content animate-pulse" />
          Online
        </div>
      </div>
    </header>
  );
}
