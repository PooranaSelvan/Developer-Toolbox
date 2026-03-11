import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-base-200 relative">
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      {/* Subtle ambient gradient background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-base-200 via-base-200 to-base-300/40" />
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.03] blur-3xl rounded-full"
          style={{ background: 'var(--color-primary)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-[0.02] blur-3xl rounded-full"
          style={{ background: 'var(--color-secondary, var(--color-primary))' }}
        />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[3px] z-30 lg:hidden transition-opacity duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-[272px] min-h-screen flex flex-col">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto" tabIndex={-1}>
          <div key={location.pathname} className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
