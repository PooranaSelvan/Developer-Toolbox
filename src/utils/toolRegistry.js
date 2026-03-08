import {
  FileText, Send, Settings, Server, KeyRound, Regex, Palette,
  Blend, Square, Gem, Braces, Binary, Fingerprint,
  Clock, Ruler, Layout,
} from 'lucide-react';

const TOOLS = [
  // ─── Developer Tools ───
  {
    id: 'readme-generator',
    name: 'README Generator',
    description: 'Generate professional README.md files with GitHub integration',
    icon: FileText,
    path: '/readme-generator',
    category: 'developer',
    tags: ['markdown', 'github', 'documentation'],
  },
  {
    id: 'api-tester',
    name: 'API Tester',
    description: 'Test APIs with a powerful Postman-like interface',
    icon: Send,
    path: '/api-tester',
    category: 'developer',
    tags: ['api', 'rest', 'http', 'postman'],
  },
  {
    id: 'mock-api',
    name: 'Mock API Generator',
    description: 'Generate fake REST APIs with realistic data for testing',
    icon: Server,
    path: '/mock-api',
    category: 'developer',
    tags: ['api', 'mock', 'data', 'testing'],
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Tokens instantly',
    icon: KeyRound,
    path: '/jwt-decoder',
    category: 'developer',
    tags: ['jwt', 'token', 'auth', 'security'],
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, minify, and transform JSON data',
    icon: Braces,
    path: '/json-formatter',
    category: 'developer',
    tags: ['json', 'format', 'validate', 'minify'],
  },
  {
    id: 'regex-generator',
    name: 'Regex Generator',
    description: 'Build, test & generate regex patterns with live preview',
    icon: Regex,
    path: '/regex-generator',
    category: 'developer',
    tags: ['regex', 'pattern', 'match', 'test'],
  },
  // ─── Encoding & Security ───
  {
    id: 'base64-tool',
    name: 'Encoder / Decoder',
    description: 'Base64, URL, HTML, Unicode & Hex encoding tools',
    icon: Binary,
    path: '/base64-tool',
    category: 'encoding',
    tags: ['base64', 'encode', 'decode', 'url', 'hex'],
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'SHA hashing, hash verification & password tools',
    icon: Fingerprint,
    path: '/hash-generator',
    category: 'encoding',
    tags: ['hash', 'sha', 'password', 'security'],
  },

  // ─── Frontend Tools ───
  {
    id: 'color-palette',
    name: 'Color Palette',
    description: 'Generate, explore & export beautiful color palettes',
    icon: Palette,
    path: '/color-palette',
    category: 'frontend',
    tags: ['color', 'palette', 'design', 'css'],
  },
  {
    id: 'css-gradient',
    name: 'CSS Gradient',
    description: 'Create beautiful CSS gradients with live preview',
    icon: Blend,
    path: '/css-gradient',
    category: 'frontend',
    tags: ['gradient', 'css', 'design', 'visual'],
  },
  {
    id: 'box-shadow',
    name: 'Box Shadow',
    description: 'Create layered box shadows with visual editor',
    icon: Square,
    path: '/box-shadow',
    category: 'frontend',
    tags: ['shadow', 'css', 'design', 'visual'],
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Create stunning frosted glass UI effects',
    icon: Gem,
    path: '/glassmorphism',
    category: 'frontend',
    tags: ['glass', 'blur', 'css', 'design'],
  },
  {
    id: 'css-units',
    name: 'CSS Unit Converter',
    description: 'Convert between px, rem, em, vw, vh & more',
    icon: Ruler,
    path: '/css-units',
    category: 'frontend',
    tags: ['css', 'units', 'rem', 'px', 'converter'],
  },
  {
    id: 'frontend-playground',
    name: 'Frontend Playground',
    description: 'Paste code and test quickly with typing intelligence',
    icon: Layout,
    path: '/frontend-playground',
    category: 'frontend',
    tags: ['html', 'css', 'javascript', 'playground', 'preview', 'live', 'editor'],
  },

  // ─── Utilities ───
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    description: 'Convert Unix timestamps, ISO dates & more',
    icon: Clock,
    path: '/timestamp-converter',
    category: 'utilities',
    tags: ['timestamp', 'unix', 'date', 'time', 'converter'],
  },

  // ─── Preferences ───
  {
    id: 'settings',
    name: 'Settings',
    description: 'Customize themes, appearance, and manage your data',
    icon: Settings,
    path: '/settings',
    category: 'preferences',
    tags: ['settings', 'theme', 'preferences'],
  },
];

export const CATEGORIES = [
  { id: 'developer', label: 'Developer Tools', emoji: '🛠️' },
  { id: 'encoding', label: 'Encoding & Security', emoji: '🔐' },
  { id: 'frontend', label: 'Frontend Tools', emoji: '🎨' },
  { id: 'utilities', label: 'Utilities', emoji: '🧰' },
  { id: 'preferences', label: 'Preferences', emoji: '⚙️' },
];

export const getTools = () => TOOLS;
export const getToolById = (id) => TOOLS.find((tool) => tool.id === id);
export const getToolsByCategory = (category) => TOOLS.filter((tool) => tool.category === category);
export const searchTools = (query) => {
  const q = query.toLowerCase();
  return TOOLS.filter(
    (t) =>
      t.id !== 'settings' &&
      (t.name.toLowerCase().includes(q) ||
       t.description.toLowerCase().includes(q) ||
       t.tags.some((tag) => tag.includes(q)))
  );
};

export default TOOLS;
