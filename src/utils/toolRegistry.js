import { FileText, Send, Settings, Server, KeyRound, Regex, Palette, Blend, Square, Gem } from 'lucide-react';

const TOOLS = [
  {
    id: 'readme-generator',
    name: 'README Generator',
    description: 'Generate professional README.md files with GitHub integration',
    icon: FileText,
    path: '/readme-generator',
  },
  {
    id: 'api-tester',
    name: 'API Tester',
    description: 'Test APIs with a powerful Postman-like interface',
    icon: Send,
    path: '/api-tester',
  },
  {
    id: 'mock-api',
    name: 'Mock API Generator',
    description: 'Generate fake REST APIs with realistic data for testing',
    icon: Server,
    path: '/mock-api',
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Tokens instantly',
    icon: KeyRound,
    path: '/jwt-decoder',
  },
  {
    id: 'regex-generator',
    name: 'Regex Generator',
    description: 'Build, test & generate regex patterns with live preview',
    icon: Regex,
    path: '/regex-generator',
  },
  {
    id: 'color-palette',
    name: 'Color Palette',
    description: 'Generate, explore & export beautiful color palettes',
    icon: Palette,
    path: '/color-palette',
  },
  {
    id: 'css-gradient',
    name: 'CSS Gradient',
    description: 'Create beautiful CSS gradients with live preview',
    icon: Blend,
    path: '/css-gradient',
  },
  {
    id: 'box-shadow',
    name: 'Box Shadow',
    description: 'Create layered box shadows with visual editor',
    icon: Square,
    path: '/box-shadow',
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Create stunning frosted glass UI effects',
    icon: Gem,
    path: '/glassmorphism',
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Customize themes, appearance, and manage your data',
    icon: Settings,
    path: '/settings',
  },
];

export const getTools = () => TOOLS;
export const getToolById = (id) => TOOLS.find((tool) => tool.id === id);

export default TOOLS;
