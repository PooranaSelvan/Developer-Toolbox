import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan, Package, FileJson, Upload, Loader2, CheckCircle2,
  Zap, Code2, Cpu, Globe, BookOpen, Terminal, Layers,
  ChevronDown, ChevronRight, AlertTriangle, Sparkles,
  FileCode, ArrowRight, RotateCcw, Eye, Copy, Check,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════
   Context-Aware README Generator
   Reads package.json, detects project type, auto-generates
   features, installation, API docs from code comments
   ════════════════════════════════════════════════════════ */

// ─── Project Type Detection ───
const PROJECT_SIGNATURES = {
  react: {
    label: 'React App',
    icon: '⚛️',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    deps: ['react', 'react-dom'],
    devDeps: ['@vitejs/plugin-react', 'react-scripts', '@types/react'],
    scripts: ['start', 'dev', 'build'],
    features: [
      'Component-based UI architecture',
      'Virtual DOM for optimal rendering performance',
      'React Hooks for state management',
      'Client-side routing',
    ],
  },
  nextjs: {
    label: 'Next.js App',
    icon: '▲',
    color: 'text-white',
    bgColor: 'bg-neutral/80',
    deps: ['next'],
    devDeps: [],
    scripts: ['dev', 'build', 'start'],
    features: [
      'Server-side rendering (SSR) & static generation (SSG)',
      'File-based routing system',
      'API routes for backend functionality',
      'Automatic code splitting & optimization',
      'Built-in image optimization',
    ],
  },
  vue: {
    label: 'Vue.js App',
    icon: '💚',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    deps: ['vue'],
    devDeps: ['@vitejs/plugin-vue', '@vue/cli-service'],
    scripts: ['serve', 'dev', 'build'],
    features: [
      'Reactive data binding',
      'Component-based architecture',
      'Vue Router for SPA navigation',
      'Vuex/Pinia state management',
    ],
  },
  angular: {
    label: 'Angular App',
    icon: '🅰️',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    deps: ['@angular/core'],
    devDeps: ['@angular/cli'],
    scripts: ['start', 'build', 'test'],
    features: [
      'TypeScript-first framework',
      'Dependency injection system',
      'Two-way data binding',
      'Modular architecture with NgModules',
      'Built-in routing & forms',
    ],
  },
  svelte: {
    label: 'Svelte/SvelteKit App',
    icon: '🔥',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    deps: ['svelte', '@sveltejs/kit'],
    devDeps: ['@sveltejs/adapter-auto'],
    scripts: ['dev', 'build', 'preview'],
    features: [
      'No virtual DOM — compiles to efficient vanilla JS',
      'Reactive declarations & stores',
      'Scoped CSS by default',
      'Server-side rendering with SvelteKit',
    ],
  },
  express: {
    label: 'Express.js API',
    icon: '🚀',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    deps: ['express'],
    devDeps: ['nodemon'],
    scripts: ['start', 'dev'],
    features: [
      'RESTful API architecture',
      'Middleware-based request processing',
      'Route handling with Express Router',
      'Error handling middleware',
    ],
  },
  fastify: {
    label: 'Fastify API',
    icon: '⚡',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    deps: ['fastify'],
    devDeps: [],
    scripts: ['start', 'dev'],
    features: [
      'High-performance Node.js web framework',
      'Schema-based request/response validation',
      'Plugin-based architecture',
      'Built-in logging with Pino',
    ],
  },
  nestjs: {
    label: 'NestJS App',
    icon: '🐱',
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    deps: ['@nestjs/core', '@nestjs/common'],
    devDeps: ['@nestjs/cli'],
    scripts: ['start', 'start:dev', 'build'],
    features: [
      'Progressive Node.js framework with TypeScript',
      'Modular architecture inspired by Angular',
      'Dependency injection container',
      'Built-in support for GraphQL, WebSockets & microservices',
    ],
  },
  cli: {
    label: 'CLI Tool',
    icon: '💻',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    deps: ['commander', 'yargs', 'inquirer', 'meow', 'oclif', 'vorpal', 'caporal', 'clipanion'],
    devDeps: [],
    scripts: [],
    binKey: true,
    features: [
      'Interactive command-line interface',
      'Argument & option parsing',
      'Colorized terminal output',
      'Cross-platform compatibility',
    ],
  },
  electron: {
    label: 'Electron Desktop App',
    icon: '🖥️',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    deps: ['electron'],
    devDeps: ['electron-builder'],
    scripts: ['start', 'build'],
    features: [
      'Cross-platform desktop application',
      'Native OS integration (menus, notifications, file system)',
      'Auto-update support',
      'Web technologies (HTML, CSS, JS) for UI',
    ],
  },
  library: {
    label: 'NPM Library/Package',
    icon: '📦',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    deps: [],
    devDeps: ['rollup', 'tsup', 'esbuild', 'microbundle', 'webpack'],
    scripts: ['build', 'prepublishOnly'],
    mainKey: true,
    features: [
      'Lightweight & tree-shakeable',
      'TypeScript support with type definitions',
      'Comprehensive test coverage',
      'Well-documented API',
    ],
  },
  node: {
    label: 'Node.js Project',
    icon: '🟢',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    deps: [],
    devDeps: [],
    scripts: ['start'],
    features: [
      'Server-side JavaScript runtime',
      'Asynchronous I/O operations',
      'Module-based architecture',
    ],
  },
};

// ─── Dependency-to-Feature Mapping ───
const DEP_FEATURES = {
  // Databases
  'mongoose': '🗄️ MongoDB integration with Mongoose ODM',
  'mongodb': '🗄️ MongoDB database support',
  'pg': '🐘 PostgreSQL database support',
  'mysql2': '🐬 MySQL database support',
  'mysql': '🐬 MySQL database support',
  'sequelize': '🔗 Sequelize ORM for SQL databases',
  'prisma': '💎 Prisma ORM with type-safe database access',
  '@prisma/client': '💎 Prisma ORM with type-safe database access',
  'typeorm': '🏗️ TypeORM for database management',
  'drizzle-orm': '💧 Drizzle ORM — lightweight & performant',
  'redis': '⚡ Redis caching & session storage',
  'ioredis': '⚡ Redis caching with ioredis',
  'sqlite3': '📁 SQLite embedded database',
  'better-sqlite3': '📁 SQLite with synchronous API',

  // Auth
  'passport': '🔐 Authentication with Passport.js strategies',
  'jsonwebtoken': '🔑 JWT-based authentication & authorization',
  'bcrypt': '🔒 Secure password hashing with bcrypt',
  'bcryptjs': '🔒 Secure password hashing',
  'next-auth': '🔐 NextAuth.js authentication',
  '@auth/core': '🔐 Auth.js authentication',
  'firebase-admin': '🔥 Firebase Admin SDK integration',
  'firebase': '🔥 Firebase services integration',

  // State Management
  'redux': '🏪 Redux state management',
  '@reduxjs/toolkit': '🏪 Redux Toolkit for efficient state management',
  'zustand': '🐻 Zustand lightweight state management',
  'mobx': '📊 MobX reactive state management',
  'recoil': '⚛️ Recoil atomic state management',
  'jotai': '👻 Jotai primitive atomic state management',
  'pinia': '🍍 Pinia state management for Vue',
  'vuex': '🏪 Vuex state management for Vue',

  // Styling
  'tailwindcss': '🎨 Utility-first CSS with Tailwind',
  'styled-components': '💅 CSS-in-JS with styled-components',
  '@emotion/react': '💅 Emotion CSS-in-JS styling',
  'sass': '🎨 Sass/SCSS preprocessing',
  'daisyui': '🌼 DaisyUI component library',
  '@mui/material': '🎨 Material UI component library',
  '@chakra-ui/react': '⚡ Chakra UI component library',
  'framer-motion': '🎬 Framer Motion animations',
  'antd': '🐜 Ant Design component library',

  // Testing
  'jest': '🧪 Unit testing with Jest',
  'vitest': '⚡ Fast unit testing with Vitest',
  'mocha': '☕ Testing with Mocha framework',
  '@testing-library/react': '🧪 React Testing Library',
  'cypress': '🌲 End-to-end testing with Cypress',
  'playwright': '🎭 End-to-end testing with Playwright',
  'supertest': '🧪 HTTP assertion testing',

  // API & HTTP
  'axios': '📡 HTTP client with Axios',
  'node-fetch': '📡 Fetch API for Node.js',
  'graphql': '📊 GraphQL query language support',
  'apollo-server': '🚀 Apollo GraphQL server',
  '@apollo/client': '🚀 Apollo GraphQL client',
  'socket.io': '🔌 Real-time communication with Socket.IO',
  'ws': '🔌 WebSocket support',

  // Utilities
  'lodash': '🔧 Utility functions with Lodash',
  'dayjs': '📅 Date manipulation with Day.js',
  'moment': '📅 Date handling with Moment.js',
  'date-fns': '📅 Date utility functions',
  'zod': '✅ Schema validation with Zod',
  'joi': '✅ Data validation with Joi',
  'yup': '✅ Schema validation with Yup',
  'dotenv': '🔧 Environment variable management',
  'winston': '📝 Logging with Winston',
  'pino': '📝 High-performance logging with Pino',
  'cors': '🌐 Cross-Origin Resource Sharing (CORS) support',
  'helmet': '🛡️ Security headers with Helmet',
  'compression': '📦 Response compression',
  'multer': '📎 File upload handling',
  'sharp': '🖼️ High-performance image processing',
  'nodemailer': '📧 Email sending with Nodemailer',
  'bull': '📋 Job queue processing with Bull',
  'bullmq': '📋 Job queue processing with BullMQ',

  // Build / Dev Tools
  'typescript': '📘 TypeScript for type safety',
  'eslint': '🔍 ESLint code linting',
  'prettier': '✨ Prettier code formatting',
  'webpack': '📦 Webpack module bundling',
  'vite': '⚡ Vite for fast development & building',
  'esbuild': '⚡ esbuild for ultra-fast builds',
  'rollup': '📦 Rollup module bundler',
  'babel': '🔄 Babel JavaScript compiler',
  'husky': '🐶 Git hooks with Husky',
  'lint-staged': '🎯 Lint staged files before commit',
  'storybook': '📖 Storybook component documentation',

  // React ecosystem
  'react-router-dom': '🧭 Client-side routing with React Router',
  'react-query': '🔄 Server state management with React Query',
  '@tanstack/react-query': '🔄 TanStack Query for data fetching',
  'swr': '🔄 SWR data fetching & caching',
  'react-hook-form': '📋 Performant form handling',
  'formik': '📋 Form management with Formik',
  'react-i18next': '🌐 Internationalization (i18n) support',
  'next-intl': '🌐 Next.js internationalization',
  'react-helmet': '🪖 Document head management',
  '@tanstack/react-table': '📊 Powerful table/data grid component',

  // Deployment
  'docker': '🐳 Docker containerization',
  'pm2': '🔄 PM2 process management for production',
  'serverless': '☁️ Serverless framework deployment',
};

// ─── Parse package.json ───
function analyzePackageJson(pkgJson) {
  try {
    const pkg = typeof pkgJson === 'string' ? JSON.parse(pkgJson) : pkgJson;
    const result = {
      raw: pkg,
      name: pkg.name || '',
      version: pkg.version || '',
      description: pkg.description || '',
      author: '',
      license: pkg.license || '',
      homepage: pkg.homepage || '',
      repository: '',
      
      // Deps
      dependencies: Object.keys(pkg.dependencies || {}),
      devDependencies: Object.keys(pkg.devDependencies || {}),
      allDeps: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})],
      
      // Scripts
      scripts: pkg.scripts || {},
      
      // Detect
      projectType: null,
      projectTypes: [],
      detectedFeatures: [],
      techStack: [],
      
      // Generated content
      installation: '',
      usage: '',
      prerequisites: [],
      envVars: '',
      badges: [],
    };

    // Parse author
    if (typeof pkg.author === 'string') {
      result.author = pkg.author.replace(/<.*?>/, '').replace(/\(.*?\)/, '').trim();
    } else if (pkg.author?.name) {
      result.author = pkg.author.name;
    }

    // Parse repository
    if (typeof pkg.repository === 'string') {
      result.repository = pkg.repository;
    } else if (pkg.repository?.url) {
      result.repository = pkg.repository.url.replace(/^git\+/, '').replace(/\.git$/, '');
    }

    // ─── Detect project type(s) ───
    const allDeps = result.allDeps;
    const scripts = result.scripts;

    const typeScores = {};

    Object.entries(PROJECT_SIGNATURES).forEach(([type, sig]) => {
      let score = 0;

      // Check dependencies
      sig.deps.forEach(dep => {
        if (allDeps.includes(dep)) score += 10;
      });

      // Check devDependencies
      sig.devDeps.forEach(dep => {
        if (allDeps.includes(dep)) score += 5;
      });

      // Check scripts
      sig.scripts.forEach(script => {
        if (scripts[script]) score += 3;
      });

      // Special checks
      if (sig.binKey && pkg.bin) score += 15;
      if (sig.mainKey && (pkg.main || pkg.module || pkg.exports)) score += 8;

      if (score > 0) {
        typeScores[type] = score;
      }
    });

    // Sort by score, pick top types
    const sortedTypes = Object.entries(typeScores)
      .sort(([, a], [, b]) => b - a)
      .map(([type]) => type);

    result.projectType = sortedTypes[0] || 'node';
    result.projectTypes = sortedTypes.slice(0, 3);

    // ─── Detect features from dependencies ───
    const primarySig = PROJECT_SIGNATURES[result.projectType];
    if (primarySig?.features) {
      result.detectedFeatures.push(...primarySig.features);
    }

    allDeps.forEach(dep => {
      if (DEP_FEATURES[dep]) {
        result.detectedFeatures.push(DEP_FEATURES[dep]);
      }
    });

    // Deduplicate
    result.detectedFeatures = [...new Set(result.detectedFeatures)];

    // ─── Build tech stack ───
    const techMap = new Map();
    
    // Core framework
    if (allDeps.includes('react')) techMap.set('React', true);
    if (allDeps.includes('next')) techMap.set('Next.js', true);
    if (allDeps.includes('vue')) techMap.set('Vue.js', true);
    if (allDeps.includes('@angular/core')) techMap.set('Angular', true);
    if (allDeps.includes('svelte')) techMap.set('Svelte', true);
    if (allDeps.includes('express')) techMap.set('Express.js', true);
    if (allDeps.includes('fastify')) techMap.set('Fastify', true);
    if (allDeps.includes('@nestjs/core')) techMap.set('NestJS', true);
    if (allDeps.includes('electron')) techMap.set('Electron', true);

    // Languages
    if (allDeps.includes('typescript')) techMap.set('TypeScript', true);
    else techMap.set('JavaScript', true);

    // Styling
    if (allDeps.includes('tailwindcss')) techMap.set('TailwindCSS', true);
    if (allDeps.includes('daisyui')) techMap.set('DaisyUI', true);
    if (allDeps.includes('@mui/material')) techMap.set('Material UI', true);
    if (allDeps.includes('@chakra-ui/react')) techMap.set('Chakra UI', true);
    if (allDeps.includes('styled-components')) techMap.set('Styled Components', true);

    // Database
    if (allDeps.includes('mongoose') || allDeps.includes('mongodb')) techMap.set('MongoDB', true);
    if (allDeps.includes('pg')) techMap.set('PostgreSQL', true);
    if (allDeps.includes('mysql2') || allDeps.includes('mysql')) techMap.set('MySQL', true);
    if (allDeps.includes('redis') || allDeps.includes('ioredis')) techMap.set('Redis', true);
    if (allDeps.includes('prisma') || allDeps.includes('@prisma/client')) techMap.set('Prisma', true);
    if (allDeps.includes('sqlite3') || allDeps.includes('better-sqlite3')) techMap.set('SQLite', true);

    // Build tools
    if (allDeps.includes('vite')) techMap.set('Vite', true);
    if (allDeps.includes('webpack')) techMap.set('Webpack', true);

    // API
    if (allDeps.includes('graphql')) techMap.set('GraphQL', true);
    if (allDeps.includes('socket.io')) techMap.set('Socket.IO', true);

    // Testing
    if (allDeps.includes('jest')) techMap.set('Jest', true);
    if (allDeps.includes('vitest')) techMap.set('Vitest', true);
    if (allDeps.includes('cypress')) techMap.set('Cypress', true);
    if (allDeps.includes('playwright')) techMap.set('Playwright', true);

    // Deployment
    if (allDeps.includes('docker')) techMap.set('Docker', true);

    result.techStack = [...techMap.keys()];

    // ─── Generate installation commands ───
    const hasYarn = scripts.start?.includes('yarn') || pkg.packageManager?.includes('yarn');
    const hasPnpm = scripts.start?.includes('pnpm') || pkg.packageManager?.includes('pnpm');
    
    const installParts = [];
    installParts.push('# Clone the repository');
    if (result.repository) {
      installParts.push(`git clone ${result.repository}`);
    } else {
      installParts.push(`git clone https://github.com/username/${result.name || 'project'}.git`);
    }
    installParts.push(`cd ${result.name || 'project'}`);
    installParts.push('');
    installParts.push('# Install dependencies');
    if (hasPnpm) {
      installParts.push('pnpm install');
    } else if (hasYarn) {
      installParts.push('yarn install');
    } else {
      installParts.push('npm install');
    }

    result.installation = installParts.join('\n');

    // ─── Generate usage commands ───
    const usageParts = [];
    if (scripts.dev) {
      usageParts.push(`# Development mode`);
      usageParts.push(hasPnpm ? 'pnpm dev' : hasYarn ? 'yarn dev' : 'npm run dev');
    }
    if (scripts.start && !scripts.dev) {
      usageParts.push(`# Start the application`);
      usageParts.push(hasPnpm ? 'pnpm start' : hasYarn ? 'yarn start' : 'npm start');
    }
    if (scripts.build) {
      usageParts.push('');
      usageParts.push('# Build for production');
      usageParts.push(hasPnpm ? 'pnpm build' : hasYarn ? 'yarn build' : 'npm run build');
    }
    if (scripts.test) {
      usageParts.push('');
      usageParts.push('# Run tests');
      usageParts.push(hasPnpm ? 'pnpm test' : hasYarn ? 'yarn test' : 'npm test');
    }
    if (scripts.lint) {
      usageParts.push('');
      usageParts.push('# Lint code');
      usageParts.push(hasPnpm ? 'pnpm lint' : hasYarn ? 'yarn lint' : 'npm run lint');
    }

    result.usage = usageParts.join('\n');

    // ─── Detect prerequisites ───
    const prereqs = [];
    if (pkg.engines?.node) {
      prereqs.push(`- Node.js ${pkg.engines.node}`);
    } else {
      prereqs.push('- Node.js >= 16.x');
    }
    if (hasPnpm) {
      prereqs.push(pkg.engines?.pnpm ? `- pnpm ${pkg.engines.pnpm}` : '- pnpm >= 8.x');
    } else if (hasYarn) {
      prereqs.push('- yarn >= 1.22.x');
    } else {
      prereqs.push(pkg.engines?.npm ? `- npm ${pkg.engines.npm}` : '- npm >= 8.x');
    }
    // Detect DB prerequisites
    if (allDeps.includes('mongoose') || allDeps.includes('mongodb')) prereqs.push('- MongoDB (local or Atlas)');
    if (allDeps.includes('pg')) prereqs.push('- PostgreSQL');
    if (allDeps.includes('mysql2') || allDeps.includes('mysql')) prereqs.push('- MySQL');
    if (allDeps.includes('redis') || allDeps.includes('ioredis')) prereqs.push('- Redis server');
    
    result.prerequisites = prereqs;

    // ─── Generate badges ───
    if (result.version) {
      result.badges.push({ label: 'version', text: result.version, color: '0969da', style: 'for-the-badge', url: '' });
    }
    if (result.license) {
      // License badge handled by template, skip here
    }
    if (allDeps.includes('typescript')) {
      result.badges.push({ label: 'TypeScript', text: 'typed', color: '3178C6', style: 'for-the-badge', url: '' });
    }
    if (scripts.test) {
      result.badges.push({ label: 'tests', text: 'passing', color: '2ea043', style: 'for-the-badge', url: '' });
    }
    if (pkg.bin) {
      result.badges.push({ label: 'CLI', text: 'ready', color: '8b5cf6', style: 'for-the-badge', url: '' });
    }

    return result;
  } catch (err) {
    return { error: err.message };
  }
}

// ─── Parse JSDoc/TSDoc Comments for API Docs ───
function parseCodeComments(code) {
  const apiDocs = [];
  
  // Match JSDoc blocks: /** ... */
  const jsdocRegex = /\/\*\*[\s\S]*?\*\//g;
  const blocks = code.match(jsdocRegex) || [];

  blocks.forEach(block => {
    const doc = {
      description: '',
      params: [],
      returns: '',
      example: '',
      tags: {},
    };

    // Extract description (first non-tag lines)
    const lines = block
      .replace(/\/\*\*\s*/, '')
      .replace(/\s*\*\//, '')
      .split('\n')
      .map(l => l.replace(/^\s*\*\s?/, '').trim())
      .filter(Boolean);

    let descLines = [];
    let currentTag = null;
    let currentContent = [];

    lines.forEach(line => {
      if (line.startsWith('@')) {
        // Save previous tag
        if (currentTag) {
          if (currentTag === 'param') {
            doc.params.push(currentContent.join(' '));
          } else if (currentTag === 'returns' || currentTag === 'return') {
            doc.returns = currentContent.join(' ');
          } else if (currentTag === 'example') {
            doc.example = currentContent.join('\n');
          } else {
            doc.tags[currentTag] = currentContent.join(' ');
          }
        }

        const tagMatch = line.match(/^@(\w+)\s*(.*)/);
        if (tagMatch) {
          currentTag = tagMatch[1];
          currentContent = tagMatch[2] ? [tagMatch[2]] : [];
        }
      } else if (currentTag) {
        currentContent.push(line);
      } else {
        descLines.push(line);
      }
    });

    // Save last tag
    if (currentTag) {
      if (currentTag === 'param') {
        doc.params.push(currentContent.join(' '));
      } else if (currentTag === 'returns' || currentTag === 'return') {
        doc.returns = currentContent.join(' ');
      } else if (currentTag === 'example') {
        doc.example = currentContent.join('\n');
      } else {
        doc.tags[currentTag] = currentContent.join(' ');
      }
    }

    doc.description = descLines.join(' ').trim();

    // Only include if it has meaningful content
    if (doc.description || doc.params.length > 0 || doc.tags.route || doc.tags.api) {
      apiDocs.push(doc);
    }
  });

  // Also detect Express/Fastify route patterns
  const routeRegex = /(?:app|router|server)\.(get|post|put|patch|delete|head|options)\s*\(\s*['"`]([^'"`]+)['"`]/gi;
  let routeMatch;
  while ((routeMatch = routeRegex.exec(code)) !== null) {
    const method = routeMatch[1].toUpperCase();
    const path = routeMatch[2];
    
    // Check if we already have a JSDoc for this route
    const hasDoc = apiDocs.some(d => 
      d.tags.route === path || d.description.includes(path)
    );
    
    if (!hasDoc) {
      apiDocs.push({
        description: `${method} ${path}`,
        params: [],
        returns: '',
        example: '',
        tags: { method, route: path },
        isRoute: true,
      });
    }
  }

  return apiDocs;
}

function formatApiDocsAsMarkdown(docs) {
  if (docs.length === 0) return '';

  const routes = docs.filter(d => d.isRoute || d.tags.route || d.tags.method || d.tags.api);
  const functions = docs.filter(d => !d.isRoute && !d.tags.route && !d.tags.method && !d.tags.api);

  let md = '';

  // Routes as API reference format
  if (routes.length > 0) {
    routes.forEach(route => {
      const method = (route.tags.method || 'GET').toUpperCase();
      const path = route.tags.route || route.description.split(' ').pop() || '/';
      const desc = route.description.replace(/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+\S+\s*/i, '').trim() || 'No description';
      md += `${method} ${path} ${desc}\n`;
    });
  }

  // Functions as documentation
  if (functions.length > 0) {
    md += '\n### Functions\n\n';
    functions.forEach(fn => {
      if (fn.description) {
        md += `#### ${fn.tags.function || fn.tags.name || 'Function'}\n\n`;
        md += `${fn.description}\n\n`;
        if (fn.params.length > 0) {
          md += '**Parameters:**\n';
          fn.params.forEach(p => md += `- ${p}\n`);
          md += '\n';
        }
        if (fn.returns) {
          md += `**Returns:** ${fn.returns}\n\n`;
        }
        if (fn.example) {
          md += `**Example:**\n\`\`\`\n${fn.example}\n\`\`\`\n\n`;
        }
      }
    });
  }

  return md.trim();
}

// ─── Component: Detected Badge ───
function DetectedBadge({ icon, label, color = 'primary' }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-${color}/10 text-${color} border border-${color}/20`}
    >
      <span>{icon}</span>
      {label}
    </motion.span>
  );
}

// ─── Component: Feature Checkbox ───
function FeatureCheckbox({ feature, checked, onChange }) {
  return (
    <label className="flex items-start gap-2.5 py-1.5 px-2 rounded-lg hover:bg-base-200/50 transition-colors cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="checkbox checkbox-xs checkbox-primary mt-0.5 shrink-0"
      />
      <span className={`text-xs leading-relaxed transition-all ${checked ? 'text-base-content' : 'text-base-content/60 group-hover:text-base-content/80'}`}>
        {feature}
      </span>
    </label>
  );
}


/* ════════════════════════════════════════════════════════
   Main Context Analyzer Component
   ════════════════════════════════════════════════════════ */
export default function ContextAnalyzer({ onApply, formData }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('package'); // 'package' | 'code'
  const [packageInput, setPackageInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [codeAnalysis, setCodeAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState({});
  const [appliedSections, setAppliedSections] = useState({});

  // ─── Analyze package.json ───
  const handleAnalyzePackage = useCallback(() => {
    if (!packageInput.trim()) return;
    setAnalyzing(true);
    
    // Simulate a brief analysis delay for UX
    setTimeout(() => {
      const result = analyzePackageJson(packageInput);
      setAnalysis(result);
      setAnalyzing(false);

      if (!result.error && result.detectedFeatures) {
        // Pre-select all features
        const featureMap = {};
        result.detectedFeatures.forEach((f, i) => { featureMap[i] = true; });
        setSelectedFeatures(featureMap);
      }
    }, 600);
  }, [packageInput]);

  // ─── Analyze code comments ───
  const handleAnalyzeCode = useCallback(() => {
    if (!codeInput.trim()) return;
    setAnalyzing(true);
    
    setTimeout(() => {
      const docs = parseCodeComments(codeInput);
      const markdown = formatApiDocsAsMarkdown(docs);
      setCodeAnalysis({ docs, markdown, count: docs.length });
      setAnalyzing(false);
    }, 400);
  }, [codeInput]);

  // ─── Apply to form ───
  const handleApplySection = useCallback((section, value) => {
    onApply(section, value);
    setAppliedSections(prev => ({ ...prev, [section]: true }));
    setTimeout(() => {
      setAppliedSections(prev => ({ ...prev, [section]: false }));
    }, 2000);
  }, [onApply]);

  const handleApplyAll = useCallback(() => {
    if (!analysis) return;

    // Batch all updates into a single object to avoid multiple setState calls
    // where only the last one wins
    const batch = {};

    // Project name
    if (analysis.name && !formData.projectName) {
      batch.projectName = analysis.name;
    }

    // Description
    if (analysis.description && !formData.description) {
      batch.description = analysis.description;
    }

    // Features
    const features = analysis.detectedFeatures
      .filter((_, i) => selectedFeatures[i] !== false)
      .join('\n');
    if (features) {
      batch.features = features;
    }

    // Tech stack
    if (analysis.techStack.length > 0) {
      batch.techStack = analysis.techStack.join(', ');
    }

    // Installation
    if (analysis.installation) {
      batch.installation = analysis.installation;
    }

    // Usage
    if (analysis.usage) {
      batch.usage = analysis.usage;
    }

    // Prerequisites
    if (analysis.prerequisites.length > 0) {
      batch.prerequisites = analysis.prerequisites.join('\n');
    }

    // License
    if (analysis.license && !formData.license) {
      batch.license = analysis.license;
    }

    // Author
    if (analysis.author && !formData.author) {
      batch.author = analysis.author;
    }

    // Badges
    if (analysis.badges.length > 0) {
      batch.badges = [...(formData.badges || []), ...analysis.badges];
    }

    // Demo URL
    if (analysis.homepage && !formData.demoUrl) {
      batch.demoUrl = analysis.homepage;
    }

    // Apply all at once via batch mode
    if (Object.keys(batch).length > 0) {
      onApply(batch);
    }

    setAppliedSections(prev => ({ ...prev, all: true }));
    setTimeout(() => {
      setAppliedSections(prev => ({ ...prev, all: false }));
    }, 2500);
  }, [analysis, selectedFeatures, formData, onApply]);

  // ─── File Upload Handler ───
  const handleFileUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result;
      if (content) {
        setPackageInput(content);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleReset = useCallback(() => {
    setPackageInput('');
    setCodeInput('');
    setAnalysis(null);
    setCodeAnalysis(null);
    setSelectedFeatures({});
    setAppliedSections({});
  }, []);

  const projectSig = analysis?.projectType ? PROJECT_SIGNATURES[analysis.projectType] : null;

  return (
    <div className="rounded-xl border border-base-300 bg-base-100 overflow-hidden">
      {/* ─── Header (always visible) ─── */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:p-5 flex items-center gap-3 hover:bg-base-200/30 transition-colors"
      >
        <motion.div
          animate={analyzing ? { rotate: 360 } : { rotate: 0 }}
          transition={analyzing ? { duration: 1.5, repeat: Infinity, ease: 'linear' } : {}}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center shrink-0 shadow-sm border border-primary/10"
        >
          <Scan size={18} className="text-primary" />
        </motion.div>

        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold">Context-Aware Generator</h3>
            <span className="badge badge-xs badge-primary gap-1 shadow-sm">
              <Sparkles size={8} />
              Smart
            </span>
            {analysis && !analysis.error && (
              <span className="badge badge-xs badge-success gap-1">
                <CheckCircle2 size={8} />
                {projectSig?.label || 'Analyzed'}
              </span>
            )}
          </div>
          <p className="text-[11px] text-base-content/60 mt-0.5">
            Paste your package.json or code → auto-detect project type, features, installation & API docs
          </p>
        </div>

        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-base-content/50" />
        </motion.div>
      </button>

      {/* ─── Expanded Content ─── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-4 border-t border-base-200">
              {/* ─── Tab Switcher ─── */}
              <div className="flex items-center gap-2 pt-4">
                <div className="flex bg-base-200/50 rounded-xl p-1 border border-base-200/60">
                  <button
                    onClick={() => setActiveTab('package')}
                    className={`btn btn-xs gap-1.5 rounded-lg transition-all duration-200 ${
                      activeTab === 'package' ? 'btn-primary shadow-sm' : 'btn-ghost'
                    }`}
                  >
                    <Package size={12} />
                    package.json
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`btn btn-xs gap-1.5 rounded-lg transition-all duration-200 ${
                      activeTab === 'code' ? 'btn-primary shadow-sm' : 'btn-ghost'
                    }`}
                  >
                    <Code2 size={12} />
                    Code → API Docs
                  </button>
                </div>

                {(analysis || codeAnalysis) && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="btn btn-ghost btn-xs gap-1 rounded-lg text-base-content/60 hover:text-error ml-auto"
                  >
                    <RotateCcw size={10} />
                    Reset
                  </motion.button>
                )}
              </div>

              {/* ═══════ PACKAGE.JSON TAB ═══════ */}
              {activeTab === 'package' && (
                <div className="space-y-4">
                  {/* Input Area */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-base-content/70 flex items-center gap-2">
                        <FileJson size={12} className="text-primary" />
                        Paste your package.json
                      </label>
                      <label className="btn btn-ghost btn-xs gap-1.5 rounded-lg cursor-pointer hover:bg-primary/10 hover:text-primary">
                        <Upload size={10} />
                        Upload
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <textarea
                      value={packageInput}
                      onChange={(e) => setPackageInput(e.target.value)}
                      placeholder={`{\n  "name": "my-project",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.2.0",\n    "express": "^4.18.0"\n  },\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build"\n  }\n}`}
                      rows={8}
                      className="textarea text-xs font-mono w-full rounded-xl bg-base-200/40 border-base-300 focus:border-primary/50 focus:shadow-[0_0_0_4px] focus:shadow-primary/10"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAnalyzePackage}
                      disabled={!packageInput.trim() || analyzing}
                      className="btn btn-primary btn-sm gap-2 rounded-xl w-full"
                    >
                      {analyzing ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap size={14} />
                          Analyze & Detect
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* ─── Analysis Results ─── */}
                  <AnimatePresence>
                    {analysis?.error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="alert alert-error text-sm py-3"
                      >
                        <AlertTriangle size={14} />
                        <span>Invalid JSON: {analysis.error}</span>
                      </motion.div>
                    )}

                    {analysis && !analysis.error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        {/* ── Detection Summary ── */}
                        <div className="rounded-xl border border-success/20 bg-success/5 p-4 space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <CheckCircle2 size={14} className="text-success" />
                            <span className="text-xs font-bold text-success">Analysis Complete</span>
                            <span className="text-[10px] text-base-content/60">
                              {analysis.allDeps.length} deps • {Object.keys(analysis.scripts).length} scripts
                            </span>
                          </div>

                          {/* Project Type */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold text-base-content/60 uppercase tracking-wider">Detected:</span>
                            {analysis.projectTypes.map(type => {
                              const sig = PROJECT_SIGNATURES[type];
                              return sig ? (
                                <span
                                  key={type}
                                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg ${sig.bgColor} border border-base-300/50`}
                                >
                                  <span>{sig.icon}</span>
                                  {sig.label}
                                </span>
                              ) : null;
                            })}
                          </div>

                          {/* Quick Info */}
                          <div className="flex flex-wrap gap-2">
                            {analysis.name && (
                              <span className="badge badge-sm badge-ghost gap-1">📦 {analysis.name}</span>
                            )}
                            {analysis.version && (
                              <span className="badge badge-sm badge-ghost gap-1">🏷️ v{analysis.version}</span>
                            )}
                            {analysis.license && (
                              <span className="badge badge-sm badge-ghost gap-1">📄 {analysis.license}</span>
                            )}
                            {analysis.techStack.length > 0 && (
                              <span className="badge badge-sm badge-ghost gap-1">🛠️ {analysis.techStack.length} technologies</span>
                            )}
                          </div>
                        </div>

                        {/* ── Tech Stack ── */}
                        {analysis.techStack.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-base-content/70 flex items-center gap-2">
                                <Layers size={12} className="text-secondary" />
                                Detected Tech Stack
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleApplySection('techStack', analysis.techStack.join(', '))}
                                className={`btn btn-xs gap-1 rounded-lg ${
                                  appliedSections.techStack ? 'btn-success' : 'btn-ghost hover:btn-primary'
                                }`}
                              >
                                {appliedSections.techStack ? <Check size={10} /> : <ArrowRight size={10} />}
                                {appliedSections.techStack ? 'Applied!' : 'Apply'}
                              </motion.button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {analysis.techStack.map(tech => (
                                <span key={tech} className="badge badge-sm badge-outline gap-1">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* ── Detected Features ── */}
                        {analysis.detectedFeatures.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-base-content/70 flex items-center gap-2">
                                <Sparkles size={12} className="text-accent" />
                                Auto-Generated Features ({analysis.detectedFeatures.length})
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => {
                                  const features = analysis.detectedFeatures
                                    .filter((_, i) => selectedFeatures[i] !== false)
                                    .join('\n');
                                  handleApplySection('features', features);
                                }}
                                className={`btn btn-xs gap-1 rounded-lg ${
                                  appliedSections.features ? 'btn-success' : 'btn-ghost hover:btn-primary'
                                }`}
                              >
                                {appliedSections.features ? <Check size={10} /> : <ArrowRight size={10} />}
                                {appliedSections.features ? 'Applied!' : 'Apply Selected'}
                              </motion.button>
                            </div>
                            <div className="rounded-lg border border-base-200 bg-base-200/20 p-2 max-h-52 overflow-y-auto scrollbar-thin space-y-0.5">
                              {analysis.detectedFeatures.map((feature, i) => (
                                <FeatureCheckbox
                                  key={i}
                                  feature={feature}
                                  checked={selectedFeatures[i] !== false}
                                  onChange={(checked) => setSelectedFeatures(prev => ({ ...prev, [i]: checked }))}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* ── Installation & Usage Preview ── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Installation */}
                          {analysis.installation && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-base-content/70 flex items-center gap-2">
                                  <Terminal size={12} className="text-info" />
                                  Installation
                                </span>
                                <motion.button
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => handleApplySection('installation', analysis.installation)}
                                  className={`btn btn-xs gap-1 rounded-lg ${
                                    appliedSections.installation ? 'btn-success' : 'btn-ghost hover:btn-primary'
                                  }`}
                                >
                                  {appliedSections.installation ? <Check size={10} /> : <ArrowRight size={10} />}
                                  {appliedSections.installation ? 'Applied!' : 'Apply'}
                                </motion.button>
                              </div>
                              <pre className="text-[10px] font-mono bg-base-200/50 rounded-lg p-2.5 border border-base-200 max-h-32 overflow-auto whitespace-pre-wrap leading-relaxed">
                                {analysis.installation}
                              </pre>
                            </div>
                          )}

                          {/* Usage */}
                          {analysis.usage && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-base-content/70 flex items-center gap-2">
                                  <Globe size={12} className="text-warning" />
                                  Usage Commands
                                </span>
                                <motion.button
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => handleApplySection('usage', analysis.usage)}
                                  className={`btn btn-xs gap-1 rounded-lg ${
                                    appliedSections.usage ? 'btn-success' : 'btn-ghost hover:btn-primary'
                                  }`}
                                >
                                  {appliedSections.usage ? <Check size={10} /> : <ArrowRight size={10} />}
                                  {appliedSections.usage ? 'Applied!' : 'Apply'}
                                </motion.button>
                              </div>
                              <pre className="text-[10px] font-mono bg-base-200/50 rounded-lg p-2.5 border border-base-200 max-h-32 overflow-auto whitespace-pre-wrap leading-relaxed">
                                {analysis.usage}
                              </pre>
                            </div>
                          )}
                        </div>

                        {/* ── Prerequisites ── */}
                        {analysis.prerequisites.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-base-content/70 flex items-center gap-2">
                                <Cpu size={12} className="text-error" />
                                Prerequisites
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleApplySection('prerequisites', analysis.prerequisites.join('\n'))}
                                className={`btn btn-xs gap-1 rounded-lg ${
                                  appliedSections.prerequisites ? 'btn-success' : 'btn-ghost hover:btn-primary'
                                }`}
                              >
                                {appliedSections.prerequisites ? <Check size={10} /> : <ArrowRight size={10} />}
                                {appliedSections.prerequisites ? 'Applied!' : 'Apply'}
                              </motion.button>
                            </div>
                            <div className="text-[11px] text-base-content/70 bg-base-200/30 rounded-lg p-2.5 border border-base-200">
                              {analysis.prerequisites.map((p, i) => (
                                <div key={i}>{p}</div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* ── Scripts Overview ── */}
                        {Object.keys(analysis.scripts).length > 0 && (
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-base-content/70 flex items-center gap-2">
                              <FileCode size={12} className="text-primary" />
                              Available Scripts ({Object.keys(analysis.scripts).length})
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {Object.entries(analysis.scripts).map(([name, cmd]) => (
                                <span
                                  key={name}
                                  className="badge badge-sm font-mono gap-1 bg-base-200/60 border-base-300"
                                  title={cmd}
                                >
                                  <Terminal size={8} />
                                  {name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* ── Apply All Button ── */}
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={handleApplyAll}
                          className={`btn btn-sm w-full gap-2 rounded-xl ${
                            appliedSections.all
                              ? 'btn-success shadow-md shadow-success/20'
                              : 'btn-primary shadow-md shadow-primary/20'
                          }`}
                        >
                          {appliedSections.all ? (
                            <>
                              <CheckCircle2 size={14} />
                              All Sections Applied!
                            </>
                          ) : (
                            <>
                              <Zap size={14} />
                              Apply All to README
                            </>
                          )}
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ═══════ CODE → API DOCS TAB ═══════ */}
              {activeTab === 'code' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-base-content/70 flex items-center gap-2">
                      <Code2 size={12} className="text-secondary" />
                      Paste code with JSDoc/TSDoc comments or route definitions
                    </label>
                    <textarea
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      placeholder={`/**
 * Get all users
 * @route GET /api/users
 * @param {string} role - Filter by role
 * @returns {Array} List of users
 */
app.get('/api/users', (req, res) => { ... });

/**
 * Create a new user
 * @route POST /api/users
 * @param {string} name - User name
 * @param {string} email - User email
 * @returns {Object} Created user
 */
app.post('/api/users', (req, res) => { ... });`}
                      rows={10}
                      className="textarea text-xs font-mono w-full rounded-xl bg-base-200/40 border-base-300 focus:border-primary/50 focus:shadow-[0_0_0_4px] focus:shadow-primary/10"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAnalyzeCode}
                      disabled={!codeInput.trim() || analyzing}
                      className="btn btn-secondary btn-sm gap-2 rounded-xl w-full"
                    >
                      {analyzing ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Parsing Comments...
                        </>
                      ) : (
                        <>
                          <BookOpen size={14} />
                          Extract API Docs
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Code Analysis Results */}
                  <AnimatePresence>
                    {codeAnalysis && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-secondary" />
                            <span className="text-xs font-bold text-secondary">
                              Found {codeAnalysis.count} documented endpoint{codeAnalysis.count !== 1 ? 's' : ''} / function{codeAnalysis.count !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>

                        {codeAnalysis.markdown && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-base-content/70 flex items-center gap-2">
                                <Eye size={12} />
                                Generated API Reference
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleApplySection('apiReference', codeAnalysis.markdown)}
                                className={`btn btn-xs gap-1 rounded-lg ${
                                  appliedSections.apiReference ? 'btn-success' : 'btn-ghost hover:btn-secondary'
                                }`}
                              >
                                {appliedSections.apiReference ? <Check size={10} /> : <ArrowRight size={10} />}
                                {appliedSections.apiReference ? 'Applied!' : 'Apply to API Reference'}
                              </motion.button>
                            </div>
                            <pre className="text-[10px] font-mono bg-base-200/50 rounded-lg p-3 border border-base-200 max-h-48 overflow-auto whitespace-pre-wrap leading-relaxed">
                              {codeAnalysis.markdown}
                            </pre>
                          </div>
                        )}

                        {codeAnalysis.count === 0 && (
                          <div className="text-center py-4 text-xs text-base-content/50">
                            <Code2 size={20} className="mx-auto mb-2 text-base-content/30" />
                            <p>No JSDoc comments or route definitions found.</p>
                            <p className="text-[10px] mt-1">
                              Add <code className="bg-base-200 px-1 rounded">/** @route GET /path */</code> comments to your code.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
