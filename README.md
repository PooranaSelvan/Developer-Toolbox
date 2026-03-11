<p align="center">
  <img src="public/favicon.svg" alt="Developer Toolbox Logo" width="80" height="80" />
</p>

<h1 align="center">🛠️ Developer Toolbox</h1>

<p align="center">
  <strong>A comprehensive, privacy-first collection of developer utilities — all running entirely client-side.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 5" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS 3" />
  <img src="https://img.shields.io/badge/DaisyUI-5-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white" alt="DaisyUI 5" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tools-overview">Tools</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-theming">Theming</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| ⚡ **Lightning Fast** | Instant results with zero server latency — everything processes client-side |
| 🔒 **Privacy First** | Your data never leaves your browser. No servers, no tracking, no analytics |
| 🎨 **31 Themes** | Switch between light, dark, and specialty themes powered by DaisyUI |
| 📱 **Fully Responsive** | Mobile-friendly with adaptive layouts and touch-optimized interactions |
| ♿ **Accessible** | WCAG 2.1 AA compliant with keyboard navigation, ARIA labels, and screen reader support |
| 🌐 **Works Offline** | Once loaded, all tools function without an internet connection |
| 🚀 **Code-Split** | Lazy-loaded tool components for optimal bundle size and fast initial load |
| 💾 **Persistent Settings** | Theme preferences and tool data saved in browser localStorage |

---

## 🧰 Tools Overview

Developer Toolbox ships with **13 professional-grade tools** organized into two categories:

### 🛠️ Developer Tools (7)

| # | Tool | Description | Key Features |
|---|------|-------------|--------------|
| 1 | **README Generator** | Generate professional `README.md` files | GitHub repo import, multiple templates, badge builder, live Markdown preview, custom sections |
| 2 | **API Tester** | Test APIs with a Postman-like interface | GET/POST/PUT/PATCH/DELETE methods, custom headers & params, request history, saved collections, code generation |
| 3 | **Mock API Generator** | Generate fake REST APIs with realistic data | Realistic mock data for users, products, posts & more, instant JSON endpoints |
| 4 | **JWT Toolkit** | Decode, verify, build & analyze JSON Web Tokens | Header/payload inspection, signature verification, token builder, expiration audit |
| 5 | **JSON Formatter** | Format, validate, minify & transform JSON data | Pretty-print, minification, validation with error highlighting, tree view |
| 6 | **Regex Generator** | Build, test & generate regex patterns | Live pattern matching, test string highlighting, common pattern library |
| 7 | **Password Generator** | Generate secure passwords & passphrases | Customizable length & character sets, passphrase mode, PIN generation, strength meter |

### 🎨 Frontend Tools (5)

| # | Tool | Description | Key Features |
|---|------|-------------|--------------|
| 8 | **Color Palette** | Generate, explore & export color palettes | Palette generation, shade/tint exploration, multiple export formats (CSS, Tailwind, SCSS) |
| 9 | **CSS Gradient** | Create CSS gradients with live preview | Linear & radial gradients, multi-stop colors, angle control, one-click CSS copy |
| 10 | **Box Shadow** | Create layered box shadows with a visual editor | Multiple shadow layers, inset shadows, visual controls, live preview with CSS output |
| 11 | **Glassmorphism** | Create frosted glass UI effects | Blur, transparency, border & color controls, live preview, ready-to-use CSS output |
| 12 | **Frontend Playground** | Live HTML/CSS/JS code editor & preview | CodeMirror editor with autocomplete, instant live preview, multi-pane layout |

### ⚙️ Preferences (1)

| # | Tool | Description |
|---|------|-------------|
| 13 | **Settings** | Theme gallery with 31 themes, data management, storage overview, about info |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/PooranaSelvan/Developer-Toolbox.git
cd Developer-Toolbox

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at **`http://localhost:5173`**.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server with HMR |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the codebase |

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🏗️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| [React](https://react.dev/) | 19 | UI framework with hooks, lazy loading & Suspense |
| [Vite](https://vitejs.dev/) | 5 | Build tool with instant HMR and optimized bundling |
| [React Router](https://reactrouter.com/) | 7 | Client-side routing with lazy-loaded routes |
| [TailwindCSS](https://tailwindcss.com/) | 3 | Utility-first CSS framework |
| [DaisyUI](https://daisyui.com/) | 5 | Tailwind component library with 31 themes |
| [Framer Motion](https://www.framer.com/motion/) | 12 | Declarative animations and transitions |
| [Lucide React](https://lucide.dev/) | Latest | Beautiful, consistent icon library |
| [CodeMirror](https://codemirror.net/) | 6 | Advanced code editor (Frontend Playground) |
| [Axios](https://axios-http.com/) | 1.x | HTTP client for API Tester and GitHub integration |
| [React Markdown](https://github.com/remarkjs/react-markdown) | 10 | Markdown rendering with GFM and raw HTML support |
| [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) | 16 | Code syntax highlighting |

---

## 📁 Project Structure

```
Developer-Toolbox/
├── public/
│   └── favicon.svg                   # App icon (SVG)
├── src/
│   ├── main.jsx                      # App entry point with ThemeProvider
│   ├── App.jsx                       # Route definitions with lazy loading
│   ├── index.css                     # Global styles & Tailwind directives
│   │
│   ├── components/                   # Shared UI components
│   │   ├── EmptyState.jsx            # Empty state placeholder
│   │   ├── ErrorBoundary.jsx         # React error boundary with recovery UI
│   │   ├── LoadingSpinner.jsx        # Loading indicator with size variants
│   │   ├── SEO.jsx                   # Dynamic meta tags & Open Graph
│   │   ├── Toast.jsx                 # Toast notification component
│   │   ├── ToolCard.jsx              # Reusable tool card with variants
│   │   └── ui/                       # Magic UI animated components
│   │       ├── animated-gradient-text.jsx
│   │       ├── border-beam.jsx
│   │       ├── dot-pattern.jsx
│   │       ├── magic-card.jsx
│   │       ├── number-ticker.jsx
│   │       ├── particles.jsx
│   │       └── shimmer-button.jsx
│   │
│   ├── contexts/
│   │   └── ThemeContext.jsx           # Theme state management (31 themes)
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useCopyToClipboard.js     # Clipboard API with fallback
│   │   ├── useDownloadFile.js        # File download via Blob URLs
│   │   ├── useLocalStorage.js        # Persistent state with localStorage
│   │   └── useToast.js               # Toast notification hook
│   │
│   ├── layouts/                      # App shell components
│   │   ├── AppLayout.jsx             # Main layout with sidebar + header
│   │   ├── Header.jsx                # Top bar with breadcrumbs & theme switcher
│   │   └── Sidebar.jsx               # Navigation sidebar with search & categories
│   │
│   ├── pages/                        # Page-level components
│   │   ├── HomePage.jsx              # Landing page with hero, features & tool grid
│   │   ├── Dashboard.jsx             # Tool dashboard with search & category filters
│   │   ├── Settings.jsx              # Theme gallery, data management & about
│   │   └── NotFound.jsx              # 404 error page
│   │
│   ├── services/                     # External service integrations
│   │   ├── apiService.js             # Axios-based HTTP request executor
│   │   └── githubService.js          # GitHub API: repo analysis & README generation
│   │
│   ├── tools/                        # Individual tool implementations
│   │   ├── api-tester/
│   │   │   ├── ApiTester.jsx         # Main API tester component
│   │   │   ├── CodeGenerator.jsx     # Generate code snippets from requests
│   │   │   ├── RequestConfig.jsx     # Request method, URL, headers & body
│   │   │   ├── RequestHistory.jsx    # Saved request history
│   │   │   ├── ResponsePanel.jsx     # Response viewer with formatting
│   │   │   └── SavedCollections.jsx  # Organize requests into collections
│   │   ├── box-shadow/
│   │   │   └── BoxShadowGenerator.jsx
│   │   ├── color-palette/
│   │   │   └── ColorPaletteGenerator.jsx
│   │   ├── css-gradient/
│   │   │   └── CssGradientGenerator.jsx
│   │   ├── frontend-playground/
│   │   │   ├── FrontendPlayground.jsx  # Main playground component
│   │   │   ├── CodeMirrorEditor.jsx    # CodeMirror wrapper component
│   │   │   ├── codemirrorSetup.js      # Editor configuration & extensions
│   │   │   └── FrontendPlayground.css  # Playground-specific styles
│   │   ├── glassmorphism/
│   │   │   └── GlassmorphismGenerator.jsx
│   │   ├── json-formatter/
│   │   │   └── JsonFormatter.jsx
│   │   ├── jwt-decoder/
│   │   │   └── JwtDecoder.jsx
│   │   ├── mock-api/
│   │   │   └── MockApiGenerator.jsx
│   │   ├── password-generator/
│   │   │   └── PasswordGenerator.jsx
│   │   ├── readme-generator/
│   │   │   ├── ReadmeGenerator.jsx     # Main generator with GitHub import
│   │   │   ├── ReadmeForm.jsx          # Form inputs for README sections
│   │   │   ├── ReadmePreview.jsx       # Live Markdown preview
│   │   │   ├── TemplateSelector.jsx    # Pre-built README templates
│   │   │   ├── BadgeBuilder.jsx        # Shield.io badge generator
│   │   │   ├── GitHubImport.jsx        # Import from GitHub repository
│   │   │   └── CustomSections.jsx      # Add custom README sections
│   │   └── regex-generator/
│   │       └── RegexGenerator.jsx
│   │
│   ├── utils/                        # Utility modules
│   │   ├── toolRegistry.js           # Central tool registry with metadata
│   │   ├── helpers.js                # Shared helper functions
│   │   ├── performance.js            # Debounce, throttle & performance utils
│   │   └── readmeTemplates.js        # Pre-built README template definitions
│   │
│   └── lib/
│       └── utils.js                  # Tailwind merge utility (cn function)
│
├── index.html                        # HTML entry with SEO meta tags
├── package.json                      # Dependencies & scripts
├── vite.config.js                    # Vite configuration with path aliases
├── tailwind.config.js                # Tailwind + DaisyUI theme configuration
├── postcss.config.js                 # PostCSS with autoprefixer
├── eslint.config.js                  # ESLint flat config
├── components.json                   # shadcn/ui configuration
├── jsconfig.json                     # Path alias configuration
├── CHANGELOG.md                      # Version history
├── STYLE_GUIDE.md                    # Design system documentation
└── .gitignore                        # Git ignore rules
```

---

## 🎨 Theming

Developer Toolbox supports **31 themes** powered by DaisyUI, organized into Light and Dark categories:

### Light Themes (19)
Emerald *(default)*, Light, Cupcake, Corporate, Garden, Lo-Fi, Pastel, Fantasy, Wireframe, CMYK, Autumn, Acid, Lemonade, Winter, Nord, Retro, Valentine, Aqua, Cyberpunk

### Dark Themes (12)
Forest, Dark, Synthwave, Halloween, Black, Luxury, Dracula, Business, Night, Coffee, Dim, Sunset

### How to Switch Themes

1. **Header Dropdown** — Quick access to 8 popular themes from any page
2. **Settings Page** — Full visual theme gallery with live previews of all 31 themes

Themes are persisted in `localStorage` and apply instantly across the entire application.

---

## 🏛️ Architecture

### Routing & Code Splitting

All tool components are **lazy-loaded** using `React.lazy()` + `Suspense`, ensuring the initial bundle only contains the shell (layout, navigation, homepage). Each tool is loaded on-demand when the user navigates to it.

```jsx
const ApiTester = lazy(() => import('./tools/api-tester/ApiTester'));
```

### State Management

- **Theme** — React Context (`ThemeContext`) with localStorage persistence
- **Tool Data** — Component-local state with `useLocalStorage` hook for persistence
- **Navigation** — React Router v7 with URL-based state (search params for category filters)

### Custom Hooks

| Hook | Purpose |
|------|---------|
| `useCopyToClipboard` | Clipboard API with textarea fallback for older browsers |
| `useLocalStorage` | `useState`-like API with automatic localStorage sync |
| `useDownloadFile` | Generate and download files via Blob URLs |
| `useToast` | Toast notification management with auto-dismiss |

### Services

| Service | Purpose |
|---------|---------|
| `apiService.js` | Executes HTTP requests via Axios for the API Tester tool |
| `githubService.js` | GitHub API integration — fetches repo metadata, analyzes tech stack, detects project structure, and auto-generates README content |

### Error Handling

- **ErrorBoundary** — Catches render errors with a recovery UI (retry + navigate home)
- **404 Page** — Custom not-found page with navigation back to dashboard
- **Graceful Fallbacks** — All localStorage reads/writes are try-catch wrapped

---

## ♿ Accessibility

- **Skip to main content** link for keyboard users
- **ARIA labels** on all interactive elements
- **Focus indicators** — Visible focus rings on keyboard navigation
- **Semantic HTML** — Proper heading hierarchy, landmarks, and roles
- **Touch targets** — Minimum 44×44px for mobile interactions
- **Reduced motion** — Respects `prefers-reduced-motion` preference
- **Color contrast** — Meets WCAG 2.1 AA minimum ratios
- **Screen reader** support with live regions and announcements

---

## 🔒 Privacy & Security

Developer Toolbox is designed with a **zero-trust, client-side-only** architecture:

- ✅ **No backend server** — All processing happens in the browser
- ✅ **No data collection** — Zero analytics, tracking, or telemetry
- ✅ **No cookies** — Only `localStorage` for theme and tool preferences
- ✅ **No accounts** — No sign-up or authentication required
- ✅ **Open source** — Full codebase is auditable

The only external network requests are:
- **API Tester** — Sends requests to user-specified URLs (by design)
- **GitHub Import** — Fetches public repository data from GitHub's API (README Generator)
- **Google Fonts** — Loads Inter and JetBrains Mono typefaces

---

## 📊 Performance

| Metric | Value |
|--------|-------|
| Initial Bundle | Optimized with route-based code splitting |
| Lighthouse Score | ~95+ |
| Accessibility Score | ~95+ |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 2s |

### Optimizations

- Route-based **code splitting** with `React.lazy()` and `Suspense`
- **Font preloading** and DNS prefetch for external resources
- **Tree-shaking** via Vite's Rollup-based production builds
- **Debounce/throttle** utilities for input-heavy tools
- **Lazy image loading** throughout the application

---

## 🤝 Contributing

Contributions are welcome! Here's how to add a new tool:

### 1. Create the Tool Component

```bash
mkdir src/tools/your-tool-name
touch src/tools/your-tool-name/YourTool.jsx
```

### 2. Build Your Component

Follow existing tool patterns — each tool is a self-contained React component:

```jsx
import { useState } from 'react';
import SEO from '../../components/SEO';

export default function YourTool() {
  return (
    <>
      <SEO
        title="Your Tool - Developer Toolbox"
        description="Description of your tool"
        keywords="relevant, keywords"
      />
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Your tool UI */}
      </div>
    </>
  );
}
```

### 3. Register in Tool Registry

Add your tool entry to `src/utils/toolRegistry.js`:

```js
{
  id: 'your-tool',
  name: 'Your Tool',
  description: 'Brief description of what your tool does',
  icon: IconName,       // from lucide-react
  path: '/your-tool',
  category: 'developer', // or 'frontend'
  tags: ['relevant', 'search', 'tags'],
},
```

### 4. Add the Route

In `src/App.jsx`, add the lazy import and route:

```jsx
const YourTool = lazy(() => import('./tools/your-tool-name/YourTool'));

// Inside <Routes>
<Route path="/your-tool" element={<YourTool />} />
```

### 5. Submit a Pull Request

- Ensure `npm run build` passes with no errors
- Ensure `npm run lint` passes cleanly
- Test responsiveness on mobile and desktop
- Test keyboard navigation and accessibility

---

## 📦 Browser Support

| Browser | Version |
|---------|---------|
| Chrome / Edge | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| iOS Safari | iOS 13+ |
| Chrome Mobile | Last 2 versions |

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/PooranaSelvan">
        <img src="https://avatars.githubusercontent.com/u/130943602?v=4" width="100" alt="Poorana Selvan" style="border-radius: 50%;" /><br />
        <sub><b>Poorana Selvan</b></sub>
      </a><br />
      <a href="https://github.com/PooranaSelvan" title="GitHub">🐙</a>
      <a href="https://poorana-portfolio.vercel.app/" title="Portfolio">🌐</a>
    </td>
  </tr>
</table>

---

<p align="center">
  If you find Developer Toolbox useful, please consider giving it a ⭐ on <a href="https://github.com/PooranaSelvan/Developer-Toolbox">GitHub</a>!
</p>

<p align="center">
  Made with ❤️ using React, TailwindCSS & DaisyUI
</p>
