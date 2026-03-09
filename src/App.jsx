import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';

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

// Encoding & Security
const Base64Tool = lazy(() => import('./tools/base64-tool/Base64Tool'));
const HashGenerator = lazy(() => import('./tools/hash-generator/HashGenerator'));

// Frontend Tools
const ColorPaletteGenerator = lazy(() => import('./tools/color-palette/ColorPaletteGenerator'));
const CssGradientGenerator = lazy(() => import('./tools/css-gradient/CssGradientGenerator'));
const BoxShadowGenerator = lazy(() => import('./tools/box-shadow/BoxShadowGenerator'));
const GlassmorphismGenerator = lazy(() => import('./tools/glassmorphism/GlassmorphismGenerator'));
const CssUnitConverter = lazy(() => import('./tools/css-units/CssUnitConverter'));
const FrontendPlayground = lazy(() => import('./tools/frontend-playground/FrontendPlayground'));

// Utilities
const TimestampConverter = lazy(() => import('./tools/timestamp-converter/TimestampConverter'));
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="text-center space-y-4">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
            <svg className="w-8 h-8 text-primary-content animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-primary mb-1">Loading Tool...</p>
          <p className="text-xs opacity-40">Please wait a moment</p>
        </div>
      </div>
    </div>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />

            {/* Developer Tools */}
            <Route path="/readme-generator" element={<ReadmeGenerator />} />
            <Route path="/api-tester" element={<ApiTester />} />
            <Route path="/mock-api" element={<MockApiGenerator />} />
            <Route path="/jwt-decoder" element={<JwtDecoder />} />
            <Route path="/json-formatter" element={<JsonFormatter />} />
            <Route path="/regex-generator" element={<RegexGenerator />} />

            {/* Encoding & Security */}
            <Route path="/base64-tool" element={<Base64Tool />} />
            <Route path="/hash-generator" element={<HashGenerator />} />

            {/* Frontend Tools */}
            <Route path="/color-palette" element={<ColorPaletteGenerator />} />
            <Route path="/css-gradient" element={<CssGradientGenerator />} />
            <Route path="/box-shadow" element={<BoxShadowGenerator />} />
            <Route path="/glassmorphism" element={<GlassmorphismGenerator />} />
            <Route path="/css-units" element={<CssUnitConverter />} />
            <Route path="/frontend-playground" element={<FrontendPlayground />} />

            {/* Utilities */}
            <Route path="/timestamp-converter" element={<TimestampConverter />} />

            {/* System */}
            <Route path="/settings" element={<Settings />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
