import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import ReadmeGenerator from './tools/readme-generator/ReadmeGenerator';
import ApiTester from './tools/api-tester/ApiTester';
import MockApiGenerator from './tools/mock-api/MockApiGenerator';
import JwtDecoder from './tools/jwt-decoder/JwtDecoder';
import RegexGenerator from './tools/regex-generator/RegexGenerator';
import ColorPaletteGenerator from './tools/color-palette/ColorPaletteGenerator';
import CssGradientGenerator from './tools/css-gradient/CssGradientGenerator';
import BoxShadowGenerator from './tools/box-shadow/BoxShadowGenerator';
import GlassmorphismGenerator from './tools/glassmorphism/GlassmorphismGenerator';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/readme-generator" element={<ReadmeGenerator />} />
          <Route path="/api-tester" element={<ApiTester />} />
          <Route path="/mock-api" element={<MockApiGenerator />} />
          <Route path="/jwt-decoder" element={<JwtDecoder />} />
          <Route path="/regex-generator" element={<RegexGenerator />} />
          <Route path="/color-palette" element={<ColorPaletteGenerator />} />
          <Route path="/css-gradient" element={<CssGradientGenerator />} />
          <Route path="/box-shadow" element={<BoxShadowGenerator />} />
          <Route path="/glassmorphism" element={<GlassmorphismGenerator />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
