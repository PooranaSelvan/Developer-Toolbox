import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy-loaded pages (code-split for faster initial load)
const NotFound = lazy(() => import('./pages/NotFound'));
const Settings = lazy(() => import('./pages/Settings'));

// Developer Tools
const ReadmeGenerator = lazy(() => import('./tools/readme-generator/ReadmeGenerator'));
const ApiTester = lazy(() => import('./tools/api-tester/ApiTester'));
const MockApiGenerator = lazy(() => import('./tools/mock-api/MockApiGenerator'));
const JwtDecoder = lazy(() => import('./tools/jwt-decoder/JwtDecoder'));
const JsonFormatter = lazy(() => import('./tools/json-formatter/JsonFormatter'));
const RegexGenerator = lazy(() => import('./tools/regex-generator/RegexGenerator'));
const PasswordGenerator = lazy(() => import('./tools/password-generator/PasswordGenerator'));

// Frontend Tools
const ColorPaletteGenerator = lazy(() => import('./tools/color-palette/ColorPaletteGenerator'));
const CssGradientGenerator = lazy(() => import('./tools/css-gradient/CssGradientGenerator'));
const BoxShadowGenerator = lazy(() => import('./tools/box-shadow/BoxShadowGenerator'));
const GlassmorphismGenerator = lazy(() => import('./tools/glassmorphism/GlassmorphismGenerator'));
const FrontendPlayground = lazy(() => import('./tools/frontend-playground/FrontendPlayground'));
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner size="lg" text="Loading Tool..." />}>
          <Routes>
            <Route element={<AppLayout />}>
            {/* Homepage — the landing page */}
            <Route path="/" element={<HomePage />} />

            {/* Dashboard — tools overview with search & filters */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Developer Tools */}
            <Route path="/readme-generator" element={<ReadmeGenerator />} />
            <Route path="/api-tester" element={<ApiTester />} />
            <Route path="/mock-api" element={<MockApiGenerator />} />
            <Route path="/jwt-decoder" element={<JwtDecoder />} />
            <Route path="/json-formatter" element={<JsonFormatter />} />
            <Route path="/regex-generator" element={<RegexGenerator />} />
            <Route path="/password-generator" element={<PasswordGenerator />} />

            {/* Frontend Tools */}
            <Route path="/color-palette" element={<ColorPaletteGenerator />} />
            <Route path="/css-gradient" element={<CssGradientGenerator />} />
            <Route path="/box-shadow" element={<BoxShadowGenerator />} />
            <Route path="/glassmorphism" element={<GlassmorphismGenerator />} />
            <Route path="/frontend-playground" element={<FrontendPlayground />} />

            {/* System */}
              <Route path="/settings" element={<Settings />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
