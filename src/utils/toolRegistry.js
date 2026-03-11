import {
  FileText, Send, Settings, Server, KeyRound, Regex, Palette,
  Blend, Square, Gem, Braces,
  Layout,
  Lock, Ruler,
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
    name: 'JWT Toolkit',
    description: 'Decode, verify, build, audit & analyze JSON Web Tokens',
    icon: KeyRound,
    path: '/jwt-decoder',
    category: 'developer',
    tags: ['jwt', 'token', 'auth', 'security', 'decode', 'verify', 'build'],
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
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure passwords, passphrases, PINs & check strength',
    icon: Lock,
    path: '/password-generator',
    category: 'developer',
    tags: ['password', 'security', 'passphrase', 'pin', 'strength', 'generator'],
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
    description: 'Convert between px, rem, em, vw, vh, pt & more',
    icon: Ruler,
    path: '/css-units',
    category: 'frontend',
    tags: ['css', 'units', 'px', 'rem', 'em', 'vw', 'converter', 'responsive'],
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
  { id: 'frontend', label: 'Frontend Tools', emoji: '🎨' },
  
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
