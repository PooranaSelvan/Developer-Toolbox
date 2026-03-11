import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { SkeletonToolPage, SkeletonSettings } from './components/Skeleton';

const NotFound = lazy(() => import('./pages/NotFound'));
const Settings = lazy(() => import('./pages/Settings'));

const ReadmeGenerator = lazy(() => import('./tools/readme-generator/ReadmeGenerator'));
const ApiTester = lazy(() => import('./tools/api-tester/ApiTester'));
const MockApiGenerator = lazy(() => import('./tools/mock-api/MockApiGenerator'));
const JwtDecoder = lazy(() => import('./tools/jwt-decoder/JwtDecoder'));
const JsonFormatter = lazy(() => import('./tools/json-formatter/JsonFormatter'));
const RegexGenerator = lazy(() => import('./tools/regex-generator/RegexGenerator'));
const PasswordGenerator = lazy(() => import('./tools/password-generator/PasswordGenerator'));

const SortingVisualizer = lazy(() => import('./tools/sorting-visualizer/SortingVisualizer'));

const ColorPaletteGenerator = lazy(() => import('./tools/color-palette/ColorPaletteGenerator'));
const CssGradientGenerator = lazy(() => import('./tools/css-gradient/CssGradientGenerator'));
const BoxShadowGenerator = lazy(() => import('./tools/box-shadow/BoxShadowGenerator'));
const GlassmorphismGenerator = lazy(() => import('./tools/glassmorphism/GlassmorphismGenerator'));
const FrontendPlayground = lazy(() => import('./tools/frontend-playground/FrontendPlayground'));
const GridGenerator = lazy(() => import('./tools/grid-generator/GridGenerator'));

/* Skeleton wrapper for tool pages — shows contextual skeleton instead of spinner */
function ToolSkeleton({ children }) {
  return <Suspense fallback={<SkeletonToolPage />}>{children}</Suspense>;
}

function SettingsSkeleton({ children }) {
  return <Suspense fallback={<SkeletonSettings />}>{children}</Suspense>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<SkeletonToolPage />}>
          <Routes>
            <Route element={<AppLayout />}>
            {/* Home & Dashboard — eagerly loaded */}
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Developer Tools — skeleton loading */}
            <Route path="/readme-generator" element={<ToolSkeleton><ReadmeGenerator /></ToolSkeleton>} />
            <Route path="/api-tester" element={<ToolSkeleton><ApiTester /></ToolSkeleton>} />
            <Route path="/mock-api" element={<ToolSkeleton><MockApiGenerator /></ToolSkeleton>} />
            <Route path="/jwt-decoder" element={<ToolSkeleton><JwtDecoder /></ToolSkeleton>} />
            <Route path="/json-formatter" element={<ToolSkeleton><JsonFormatter /></ToolSkeleton>} />
            <Route path="/regex-generator" element={<ToolSkeleton><RegexGenerator /></ToolSkeleton>} />
            <Route path="/password-generator" element={<ToolSkeleton><PasswordGenerator /></ToolSkeleton>} />

            {/* Learning Tools — skeleton loading */}
            <Route path="/sorting-visualizer" element={<ToolSkeleton><SortingVisualizer /></ToolSkeleton>} />

            {/* Frontend Tools — skeleton loading */}
            <Route path="/color-palette" element={<ToolSkeleton><ColorPaletteGenerator /></ToolSkeleton>} />
            <Route path="/css-gradient" element={<ToolSkeleton><CssGradientGenerator /></ToolSkeleton>} />
            <Route path="/box-shadow" element={<ToolSkeleton><BoxShadowGenerator /></ToolSkeleton>} />
            <Route path="/glassmorphism" element={<ToolSkeleton><GlassmorphismGenerator /></ToolSkeleton>} />
            <Route path="/frontend-playground" element={<ToolSkeleton><FrontendPlayground /></ToolSkeleton>} />
            <Route path="/grid-generator" element={<ToolSkeleton><GridGenerator /></ToolSkeleton>} />

            {/* Settings & Error Pages */}
              <Route path="/settings" element={<SettingsSkeleton><Settings /></SettingsSkeleton>} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
