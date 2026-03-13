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
  <a href="#-user-flow">User Flow</a> •
  <a href="#-developer-flow">Developer Flow</a> •
  <a href="#-architecture--data-flow">Architecture</a> •
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
| 🛡️ **Robust Error Handling** | Comprehensive exception handling across all files with graceful fallbacks, safe localStorage wrappers, and ErrorBoundary recovery |

---

## 🧰 Tools Overview

Developer Toolbox ships with **19 professional-grade tools** organized into four categories:

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

### 🎨 Frontend Tools (6)

| # | Tool | Description | Key Features |
|---|------|-------------|--------------|
| 8 | **Color Palette** | Generate, explore & export color palettes | Palette generation, shade/tint exploration, multiple export formats (CSS, Tailwind, SCSS) |
| 9 | **CSS Gradient** | Create CSS gradients with live preview | Linear & radial gradients, multi-stop colors, angle control, one-click CSS copy |
| 10 | **Box Shadow** | Create layered box shadows with a visual editor | Multiple shadow layers, inset shadows, visual controls, live preview with CSS output |
| 11 | **Glassmorphism** | Create frosted glass UI effects | Blur, transparency, border & color controls, live preview, ready-to-use CSS output |
| 12 | **Grid Generator** | Build CSS Grid layouts visually | Click & drag grid builder, named areas, responsive columns/rows, clean CSS export |
| 13 | **Frontend Playground** | Live HTML/CSS/JS code editor & preview | CodeMirror editor with autocomplete, instant live preview, multi-pane layout |

### 📚 Learning Tools (5)

| # | Tool | Description | Key Features |
|---|------|-------------|--------------|
| 14 | **Sorting Visualizer** | Learn sorting algorithms visually | Bubble, Selection, Insertion, Merge, Quick Sort with step-by-step animation, speed control, sound feedback, complexity comparison |
| 15 | **Recursion Visualizer** | Visualize recursive calls with animated call trees | Fibonacci, Factorial, Power, Sum of Array — animated call tree, live call stack, step-by-step or auto play, sound effects |
| 16 | **JS Event Loop Visualizer** | See how JavaScript executes async code | Call Stack, Web APIs, Task/Microtask Queues, Event Loop animation, 4 examples (setTimeout, Promises, Nested Microtasks, Async/Await), comparison tables |
| 17 | **Flexbox Playground** | Learn CSS Flexbox visually | Gamified challenges with 10 levels across 4 worlds, XP & ranking system, achievements, daily challenges, power-ups, live CSS code export |
| 18 | **SQL Playground** | Practice SQL queries in-browser | In-browser SQLite (sql.js), 12 challenges across 4 worlds, gamified with XP/ranks/achievements, schema viewer, query history, sample queries reference |

### ⚙️ Preferences (1)

| # | Tool | Description |
|---|------|-------------|
| 19 | **Settings** | Theme gallery with 31 themes, data management, storage overview, about info |

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

## 👤 User Flow

This section documents how end-users interact with the application from first visit through regular usage.

### First Visit Experience

```
┌─────────────────────────────────────────────────────────────────┐
│                        FIRST VISIT                              │
│                                                                 │
│  Browser loads index.html                                       │
│       │                                                         │
│       ▼                                                         │
│  ThemeProvider initializes                                      │
│  ├─ Checks localStorage for 'devtoolbox-theme'                 │
│  ├─ No saved theme found → defaults to 'toolbox' (light)       │
│  └─ Sets data-theme="toolbox" on <html>                        │
│       │                                                         │
│       ▼                                                         │
│  App shell renders (AppLayout)                                  │
│  ├─ Sidebar: navigation with tool categories                   │
│  ├─ Header: breadcrumbs + quick theme switcher                 │
│  └─ Main: animated route content via <Outlet />                │
│       │                                                         │
│       ▼                                                         │
│  HomePage renders (not lazy-loaded — immediate)                 │
│  ├─ Hero section with animated counter stats                   │
│  ├─ Feature cards (Speed, Privacy, Tools, Themes)              │
│  ├─ Featured tools showcase (6 popular tools)                  │
│  ├─ Category browser (Developer / Frontend / Learning)         │
│  └─ Full tool grid with all 19 tools                           │
│       │                                                         │
│       ▼                                                         │
│  User clicks a tool card                                        │
│  ├─ Tool ID saved to localStorage 'devtoolbox-recent-tools'    │
│  ├─ React Router navigates to /tool-path                       │
│  ├─ React.lazy() triggers chunk download (safeLazy wrapper)    │
│  ├─ <Suspense> shows SkeletonToolPage while loading            │
│  └─ Tool component mounts and renders                          │
└─────────────────────────────────────────────────────────────────┘
```

### Navigation Model

```
┌────────────────────────────────────────────────────────┐
│                    APP SHELL                            │
│                                                        │
│  ┌──────────┐  ┌────────────────────────────────────┐  │
│  │          │  │  Header                             │  │
│  │          │  │  ├─ Menu toggle (mobile)            │  │
│  │ Sidebar  │  │  ├─ Breadcrumb (Home / Tool Name)  │  │
│  │          │  │  └─ Theme dropdown (8 quick themes) │  │
│  │ ┌──────┐ │  ├────────────────────────────────────┤  │
│  │ │ Logo │ │  │                                     │  │
│  │ └──────┘ │  │          Main Content               │  │
│  │ Search   │  │                                     │  │
│  │ ──────── │  │    ┌───────────────────────────┐    │  │
│  │ Home     │  │    │                           │    │  │
│  │ Dashbrd  │  │    │   Active Tool Component   │    │  │
│  │ ──────── │  │    │   (lazy-loaded on demand) │    │  │
│  │ 🛠️ Dev   │  │    │                           │    │  │
│  │  ├─Tool1 │  │    └───────────────────────────┘    │  │
│  │  ├─Tool2 │  │                                     │  │
│  │  └─...   │  │    Framer Motion page transitions   │  │
│  │ 🎨 Front │  │    (fade + slide + blur)            │  │
│  │  ├─Tool1 │  │                                     │  │
│  │  └─...   │  │                                     │  │
│  │ 📚 Learn │  │                                     │  │
│  │  └─Sort  │  │                                     │  │
│  │ ──────── │  │                                     │  │
│  │ Settings │  │                                     │  │
│  │ ──────── │  │                                     │  │
│  │ Author   │  │                                     │
│  │ v2.0 [19]│  │                                     │
│  └──────────┘  └────────────────────────────────────┘  │└────────────────────────────────────────────────────────┘
```

**Sidebar behavior:**
- **Desktop (≥1024px):** Fixed 272px sidebar, always visible.
- **Mobile (<1024px):** Off-canvas overlay with backdrop blur; toggles via hamburger menu; auto-closes on navigation.
- **Quick Find:** `/` key focuses the sidebar search bar. Filters tools by name, description, and tags in real-time (max 6 results).
- **Categories:** Collapsible accordion groups. Active tool's category auto-expands. Tool count badge per category.
- **Active indicator:** Animated blue bar slides between active links via Framer Motion `layoutId`.

### Tool Usage Patterns

Each tool follows a consistent UX pattern:

```
User opens tool
    │
    ▼
┌─────────────────────────────────────────────┐
│  SEO component updates <title> + meta tags  │
│  Tool header (icon + name + description)    │
│  ────────────────────────────────────────── │
│  Input Section                               │
│  ├─ Text inputs, sliders, dropdowns         │
│  ├─ File upload / paste area (where needed) │
│  └─ Action buttons (Generate / Format / Run)│
│  ────────────────────────────────────────── │
│  Output Section                              │
│  ├─ Live preview / results panel            │
│  ├─ Copy to clipboard (useCopyToClipboard)  │
│  ├─ Download as file (useDownloadFile)      │
│  └─ Export in multiple formats              │
│  ────────────────────────────────────────── │
│  (Optional) Secondary tabs                   │
│  └─ History / Saved / Info / Code Gen       │
└─────────────────────────────────────────────┘
    │
    ▼
Data persisted to localStorage (where applicable)
via useLocalStorage hook
```

### Theme Switching Flow

```
User wants to change theme
    │
    ├──── Quick switch: Header dropdown → pick from 8 popular themes
    │
    └──── Full gallery: Settings page → visual preview of all 31 themes
              │
              ▼
        ThemeContext.setTheme(newTheme)
              │
              ├─ Updates React state
              ├─ Sets data-theme attribute on <html> element
              ├─ Saves to localStorage key 'devtoolbox-theme'
              └─ DaisyUI CSS variables cascade instantly
                  (all colors, backgrounds, borders update via oklch)
```

### Search & Discovery Flow

```
┌──────────────────────────────────────────────────────┐
│                  FINDING A TOOL                       │
│                                                       │
│  Method 1: Sidebar Quick Find                         │
│  ├─ Press "/" or click search box in sidebar          │
│  ├─ Type query → filters by name/desc/tags           │
│  ├─ Results appear inline (max 6)                    │
│  └─ Click result → navigate + clear search           │
│                                                       │
│  Method 2: Dashboard Search                           │
│  ├─ Press Ctrl/⌘+K or click search on Dashboard     │
│  ├─ Full-text search across all tools                │
│  ├─ Filter by category buttons (All/Dev/Front/Learn) │
│  └─ Results show as full tool cards                  │
│                                                       │
│  Method 3: Category Browsing                          │
│  ├─ Sidebar accordion → expand category              │
│  ├─ Dashboard → click category filter button         │
│  └─ Homepage → "Explore by Category" section         │
│                                                       │
│  Method 4: Recent Tools                               │
│  ├─ Homepage → "Continue Where You Left Off"         │
│  └─ Dashboard → "Recently Used" section              │
│      (stored in localStorage, max 8 entries)         │
└──────────────────────────────────────────────────────┘
```

### Data Persistence Model

```
┌────────────────────────────────────────────────────┐
│              localStorage Keys                      │
│                                                     │
│  devtoolbox-theme ────────── Active theme ID        │
│  devtoolbox-recent-tools ─── Array of tool IDs     │
│  [tool-specific keys] ────── Per-tool saved state  │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  Read: useLocalStorage(key, defaultValue)     │ │
│  │  ├─ Returns [value, setValue, removeValue]    │ │
│  │  ├─ Initializes from localStorage or default │ │
│  │  └─ Auto-syncs on setValue() calls           │ │
│  │                                               │ │
│  │  Write: All writes are try-catch wrapped      │ │
│  │  ├─ QuotaExceededError → auto-clears old data│ │
│  │  └─ Parse errors → graceful fallback         │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  Settings page → "Clear All Data" button            │
│  └─ Clears all devtoolbox-* keys from localStorage │
└────────────────────────────────────────────────────┘
```

### Keyboard Shortcuts

| Shortcut | Context | Action |
|----------|---------|--------|
| `/` | Anywhere | Focus sidebar search |
| `Ctrl/⌘ + K` | Dashboard | Focus dashboard search |
| `Escape` | Search focused | Clear search & blur |
| `Escape` | Mobile sidebar open | Close sidebar |
| `Tab` | Anywhere | Navigate interactive elements |
| `Enter` | Focused tool card | Open tool |

### Error Handling (User Perspective)

| Scenario | What Happens |
|----------|-------------|
| **Tool crashes** | ErrorBoundary catches → "Oops! Something broke" card → Try Again / Reload / Go Home buttons |
| **Lazy-load failure** | `safeLazy()` wrapper catches import errors → shows "Failed to load" with a Reload button |
| **Invalid URL** | Redirects to `/404` → custom "Page Not Found" with animation → Back to Dashboard button |
| **Network error (API Tester)** | Graceful error response displayed in response panel with status 0 and error message |
| **localStorage full** | `safeLocalStorage` auto-evicts oldest key, retries up to 3 times |
| **Clipboard denied** | `useCopyToClipboard` falls back to legacy `document.execCommand('copy')` via hidden textarea |
| **SQL engine error** | sql.js errors caught with descriptive messages in result panel; DB auto-resets on init failure |

---

## 🔧 Developer Flow

This section documents the development workflow, architecture decisions, and how to extend the codebase.

### Development Setup

```bash
# 1. Clone & install
git clone https://github.com/PooranaSelvan/Developer-Toolbox.git
cd Developer-Toolbox
npm install

# 2. Start dev server (Vite with HMR)
npm run dev
# → http://localhost:5173

# 3. Lint (ESLint flat config)
npm run lint

# 4. Production build
npm run build     # → dist/
npm run preview   # → preview at http://localhost:4173
```

### Application Bootstrap Sequence

```
index.html
    │
    ▼
src/main.jsx
    │
    ├─ <StrictMode>
    │   └─ <ThemeProvider>          ← Theme context wraps entire app
    │       └─ <App />             ← Route definitions
    │
    ▼
src/App.jsx
    │
    ├─ <ErrorBoundary>              ← Top-level crash handler
    │   └─ <BrowserRouter>
    │       └─ <Suspense fallback={SkeletonToolPage}>
    │           └─ <Routes>
    │               └─ <Route element={<AppLayout />}>   ← Shell (sidebar + header)
    │                   ├─ /                   → HomePage (eager-loaded)
    │                   ├─ /dashboard          → Dashboard (eager-loaded)
    │                   ├─ /readme-generator   → safeLazy(ReadmeGenerator)
    │                   ├─ /api-tester         → safeLazy(ApiTester)
    │                   ├─ /mock-api           → safeLazy(MockApiGenerator)
    │                   ├─ /jwt-decoder        → safeLazy(JwtDecoder)
    │                   ├─ /json-formatter     → safeLazy(JsonFormatter)
    │                   ├─ /regex-generator    → safeLazy(RegexGenerator)
    │                   ├─ /password-generator → safeLazy(PasswordGenerator)
    │                   ├─ /sorting-visualizer → safeLazy(SortingVisualizer)
    │                   ├─ /recursion-visual.. → safeLazy(RecursionVisualizer)
    │                   ├─ /event-loop-visual. → safeLazy(EventLoopVisualizer)
    │                   ├─ /flex-playground    → safeLazy(FlexPlayground)
    │                   ├─ /sql-playground     → safeLazy(SqlPlayground)
    │                   ├─ /color-palette      → safeLazy(ColorPaletteGenerator)
    │                   ├─ /css-gradient       → safeLazy(CssGradientGenerator)
    │                   ├─ /box-shadow         → safeLazy(BoxShadowGenerator)
    │                   ├─ /glassmorphism      → safeLazy(GlassmorphismGenerator)
    │                   ├─ /frontend-playground→ safeLazy(FrontendPlayground)
    │                   ├─ /grid-generator     → safeLazy(GridGenerator)
    │                   ├─ /settings           → safeLazy(Settings)
    │                   ├─ /404                → safeLazy(NotFound)
    │                   └─ *                   → Redirect to /404
```

### Adding a New Tool (Step-by-Step)

This is the complete developer workflow for adding a new tool to the application:

```
Step 1: Create tool directory & component
─────────────────────────────────────────

  mkdir src/tools/your-tool-name
  touch src/tools/your-tool-name/YourTool.jsx


Step 2: Build the component (follow the pattern)
─────────────────────────────────────────────────
```

```jsx
// src/tools/your-tool-name/YourTool.jsx
import { useState } from 'react';
import { ToolIcon } from 'lucide-react';
import SEO from '../../components/SEO';

export default function YourTool() {
  const [input, setInput] = useState('');

  return (
    <>
      {/* SEO meta tags — REQUIRED for every tool */}
      <SEO
        title="Your Tool - Developer Toolbox"
        description="Brief tool description for search engines"
        keywords="relevant, search, keywords"
      />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* ── Tool Header ── */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10
                          flex items-center justify-center">
            <ToolIcon size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Your Tool Name</h1>
            <p className="text-sm opacity-50">Tool description</p>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="section-card p-6">
          {/* Input controls */}
        </div>

        {/* ── Output / Preview ── */}
        <div className="section-card p-6">
          {/* Results, preview, export buttons */}
        </div>
      </div>
    </>
  );
}
```

```
Step 3: Register in Tool Registry
──────────────────────────────────

  Edit: src/utils/toolRegistry.js
```

```js
// Add to the TOOLS array in the appropriate category section:
{
  id: 'your-tool',
  name: 'Your Tool',
  description: 'Brief description of what your tool does',
  icon: ToolIcon,         // from lucide-react
  path: '/your-tool',
  category: 'developer',  // 'developer' | 'frontend' | 'learning'
  tags: ['relevant', 'search', 'tags'],
},
```

```
Step 4: Add the lazy route
──────────────────────────

  Edit: src/App.jsx
```

```jsx
// Add safeLazy import at top (provides fallback UI on load failure):
const YourTool = safeLazy(() => import('./tools/your-tool-name/YourTool'), 'Your Tool');

// Add route inside <Route element={<AppLayout />}>:
<Route path="/your-tool" element={<ToolSkeleton><YourTool /></ToolSkeleton>} />
```

```
Step 5: Verify
──────────────

  1. npm run dev          → Check HMR picks up changes
  2. Navigate to /your-tool → Tool loads with skeleton
  3. Check sidebar        → Tool appears under correct category
  4. Check dashboard      → Tool appears in grid + searchable
  5. npm run build        → Verify production build succeeds
  6. npm run lint         → Verify no lint errors
```

### Component Architecture Patterns

```
┌───────────────────────────────────────────────────────────┐
│                   COMPONENT PATTERNS                       │
│                                                            │
│  Shared Components (src/components/)                       │
│  ├─ SEO.jsx           → useEffect to update <head> tags   │
│  ├─ ErrorBoundary.jsx → Class component, catches renders  │
│  ├─ EmptyState.jsx    → Reusable empty/no-data state      │
│  ├─ LoadingSpinner.jsx→ Size variants (sm/md/lg)          │
│  ├─ Toast.jsx         → Notification with auto-dismiss    │
│  ├─ ToolCard.jsx      → default/compact/skeleton variants │
│  ├─ Skeleton.jsx      → SkeletonToolPage, SkeletonCard    │
│  ├─ ScrollToTop.jsx   → Scrolls to top on route change    │
│  ├─ PageProgress.jsx  → Top progress bar on navigation    │
│  └─ LazyImage.jsx     → Image with lazy loading + fadeIn  │
│                                                            │
│  Magic UI Components (src/components/ui/)                  │
│  ├─ animated-gradient-text.jsx                             │
│  ├─ border-beam.jsx                                        │
│  ├─ dot-pattern.jsx                                        │
│  ├─ magic-card.jsx                                         │
│  ├─ number-ticker.jsx                                      │
│  ├─ particles.jsx                                          │
│  └─ shimmer-button.jsx                                     │
│                                                            │
│  Tool Components (src/tools/{tool-name}/)                  │
│  ├─ Self-contained: each tool is a standalone component    │
│  ├─ Single-file tools: BoxShadow, Glassmorphism, etc.     │
│  ├─ Multi-file tools: ApiTester (6 files), README Gen (7) │
│  ├─ Gamified tools: FlexPlayground, SqlPlayground          │
│  │   └─ XP, ranks, achievements, challenges, daily quests │
│  └─ Learning tools: SortingVis, RecursionVis, EventLoopVis│
└───────────────────────────────────────────────────────────┘
```

### State Management Strategy

```
┌────────────────────────────────────────────────────────────┐
│                   STATE MANAGEMENT                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Layer 1: React Context (Global)                    │   │
│  │  └─ ThemeContext                                    │   │
│  │     ├─ theme: string (current theme ID)             │   │
│  │     ├─ setTheme(id): updates theme + localStorage   │   │
│  │     └─ themes: array of 31 theme objects            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Layer 2: URL State (Navigation)                    │   │
│  │  └─ React Router v7                                 │   │
│  │     ├─ Route path → determines active tool          │   │
│  │     └─ Search params → category filter on dashboard │   │
│  │        e.g., /dashboard?category=frontend            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Layer 3: Component-Local State (Per-Tool)          │   │
│  │  ├─ useState: transient UI state (inputs, toggles)  │   │
│  │  └─ useLocalStorage: persistent data (history, etc.)│   │
│  │     ├─ API Tester → request history, collections    │   │
│  │     ├─ README Gen → form data, badge list           │   │
│  │     └─ Other tools → tool-specific preferences      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Design Decision: NO global state library (Redux/Zustand)  │
│  Reason: Tools are independent — no cross-tool state       │
│  sharing needed. Context handles the only global concern   │
│  (theme). This keeps the bundle small and tools isolated.  │
└────────────────────────────────────────────────────────────┘
```

### Custom Hooks API Reference

```
┌───────────────────────────────────────────────────────────────┐
│  useCopyToClipboard(resetDelay?: number)                      │
│  ├─ Returns: { copied: boolean, copyToClipboard: (text) => } │
│  ├─ Uses Clipboard API with textarea fallback                 │
│  └─ Auto-resets `copied` after resetDelay ms (default: 2000) │
│                                                               │
│  useLocalStorage(key: string, initialValue: any)              │
│  ├─ Returns: [value, setValue, removeValue]                   │
│  ├─ Auto-syncs to localStorage on every setValue call         │
│  ├─ Handles JSON parse/stringify automatically                │
│  └─ try-catch wrapped for SSR safety & quota errors           │
│                                                               │
│  useDownloadFile()                                            │
│  ├─ Returns: { downloadFile: (content, filename, mime) => }  │
│  ├─ Creates Blob → Object URL → triggers <a> download        │
│  └─ Auto-revokes Object URL after download                   │
│                                                               │
│  useToast()                                                   │
│  ├─ Returns: { toasts, addToast, removeToast,                │
│  │             success, error, info, warning }               │
│  ├─ Auto-increments toast IDs                                 │
│  └─ Duration parameter controls auto-dismiss (default: 3s)   │
└───────────────────────────────────────────────────────────────┘
```

### Services Layer

```
┌─────────────────────────────────────────────────────────────┐
│  apiService.js — HTTP Request Executor                       │
│  ├─ executeRequest({ method, url, headers, params, body })  │
│  ├─ Uses Axios with validateStatus: () => true              │
│  │   (never rejects — returns all status codes)              │
│  ├─ Auto-detects JSON body and sets Content-Type            │
│  ├─ Measures request duration via performance.now()         │
│  └─ Returns: { success, status, statusText, headers,        │
│               data, duration, size, error? }                │
│                                                              │
│  githubService.js — GitHub API Integration                   │
│  ├─ parseGitHubUrl(url) → { owner, repo } | null           │
│  ├─ fetchRepoDetails(owner, repo) → repo metadata           │
│  └─ deepAnalyzeRepo(owner, repo, onProgress) → full analysis│
│     ├─ Step 1: Fetch repo metadata + languages + tree       │
│     ├─ Step 2: Analyze file structure                        │
│     ├─ Step 3: Detect tech stack from deps + file patterns  │
│     ├─ Step 4: Generate README form data auto-populated     │
│     └─ Returns: { formData, meta } for ReadmeGenerator      │
│                                                              │
│  sqlEngine.js — In-Browser SQLite (SQL Playground)           │
│  ├─ Uses sql.js (SQLite compiled to WebAssembly)            │
│  ├─ initDB() → downloads WASM binary, initializes database  │
│  ├─ runSQL(db, sql) → executes query, returns { columns,    │
│  │   rows } or error                                        │
│  ├─ loadSampleData(db) → populates tables with sample data  │
│  ├─ getTables(db) → introspects schema for schema viewer    │
│  └─ All operations wrapped in try-catch with descriptive     │
│      error messages                                          │
│                                                              │
│  External network requests are ONLY made by:                 │
│  1. API Tester → user-specified URLs                         │
│  2. GitHub Import → api.github.com (README Generator)        │
│  3. sql.js WASM → CDN download of SQLite WebAssembly binary │
│  4. Google Fonts → Inter + JetBrains Mono (CSS)             │
└─────────────────────────────────────────────────────────────┘
```

### Styling Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    STYLING LAYERS                           │
│                                                             │
│  Layer 1: DaisyUI Theme Variables                           │
│  ├─ 31 themes define CSS custom properties (oklch colors)  │
│  ├─ 2 custom themes: 'toolbox' (light) & 'toolbox-dark'   │
│  ├─ Applied via data-theme attribute on <html>             │
│  └─ All colors cascade automatically on theme switch       │
│                                                             │
│  Layer 2: TailwindCSS Utilities                             │
│  ├─ Utility-first classes for layout, spacing, typography  │
│  ├─ DaisyUI semantic classes: btn, badge, card, tabs, etc. │
│  └─ Custom animation utilities in tailwind.config.js       │
│                                                             │
│  Layer 3: Custom CSS (src/index.css)                        │
│  ├─ Enhanced form controls (input/select/textarea sizing)  │
│  ├─ Glass effects (.glass-card, .glass-elevated)           │
│  ├─ Section cards (.section-card, .section-card-elevated)  │
│  ├─ Gradient utilities (.gradient-text, .gradient-line)    │
│  ├─ Animation effects (.card-shine, .cta-glow)            │
│  ├─ Markdown preview styles (.markdown-preview)            │
│  ├─ Skeleton loading animations                             │
│  ├─ Accessibility: skip-link, focus-visible, reduced-motion│
│  └─ Print styles, safe-area insets, touch targets          │
│                                                             │
│  Layer 4: Framer Motion (Runtime Animations)                │
│  ├─ Page transitions (fade + slide + blur)                 │
│  ├─ Sidebar accordion expand/collapse                       │
│  ├─ Staggered list entrances (containerVariants/itemVariants)│
│  ├─ Hover/tap micro-interactions on cards                  │
│  └─ Layout animations (sidebar active indicator)           │
│                                                             │
│  Key CSS Classes for Tool Development:                      │
│  ├─ .section-card → rounded card with glass effect + hover │
│  ├─ .glass-base   → semi-transparent blurred background    │
│  ├─ .gradient-text → primary→secondary gradient on text    │
│  ├─ .field-label  → consistent form label styling          │
│  ├─ .separator    → thin horizontal divider line           │
│  └─ .scrollbar-thin → minimal custom scrollbar             │
└────────────────────────────────────────────────────────────┘
```

### Performance Utilities

```
┌────────────────────────────────────────────────────────────┐
│  src/utils/performance.js                                   │
│                                                             │
│  debounce(fn, wait)                                         │
│  ├─ Delays execution until wait ms after last call         │
│  └─ Used for: search inputs, resize handlers               │
│                                                             │
│  throttle(fn, limit)                                        │
│  ├─ Executes at most once per limit ms                     │
│  └─ Used for: scroll handlers, rapid UI updates            │
│                                                             │
│  prefersReducedMotion()                                     │
│  ├─ Returns true if user has reduced motion preference     │
│  └─ Used to disable animations for accessibility           │
│                                                             │
│  safeLocalStorage                                           │
│  ├─ .setItem(key, value) → auto-retries on QuotaExceeded  │
│  ├─ .getItem(key, default) → parse errors return default   │
│  └─ .removeItem(key) → try-catch wrapped                   │
│                                                             │
│  requestIdleCallback / cancelIdleCallback                   │
│  └─ Polyfilled for browsers without native support         │
└────────────────────────────────────────────────────────────┘
```

### Code Splitting & Bundle Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    BUNDLE ARCHITECTURE                        │
│                                                              │
│  Entry chunk (always loaded):                                │
│  ├─ React, React DOM, React Router                          │
│  ├─ Framer Motion (animation engine)                        │
│  ├─ ThemeContext, AppLayout, Header, Sidebar                │
│  ├─ HomePage, Dashboard (not lazy — immediate navigation)   │
│  ├─ Shared components (ErrorBoundary, SEO, Skeleton, etc.) │
│  └─ Tool registry + utility modules                         │
│                                                              │
│  Lazy chunks (loaded on demand via safeLazy):                │
│  ├─ Each tool = separate JS chunk                           │
│  │   e.g., SortingVisualizer-Blwc_r-b.js (27.85 kB)       │
│  ├─ Heavy tools with additional deps:                       │
│  │   ├─ SqlPlayground → loads sql.js WASM (~1MB)           │
│  │   ├─ FrontendPlayground → loads CodeMirror              │
│  │   ├─ ApiTester → loads Axios                            │
│  │   └─ ReadmeGenerator → loads React Markdown             │
│  ├─ Settings page (includes theme gallery)                  │
│  ├─ NotFound page                                           │
│  └─ safeLazy() wrapper catches import failures and shows    │
│      a "Failed to load" fallback UI with reload button      │
│                                                              │
│  Vite Build Optimizations:                                   │
│  ├─ Tree-shaking via Rollup                                 │
│  ├─ CSS extraction and minification                         │
│  ├─ Asset hashing for cache-busting                         │
│  └─ Chunk splitting based on dynamic import() boundaries   │
│                                                              │
│  Path Alias:                                                 │
│  └─ @ → src/ (configured in vite.config.js + jsconfig.json)│
└─────────────────────────────────────────────────────────────┘
```

### Testing Checklist (Pre-PR)

```
□ npm run build passes with zero errors
□ npm run lint passes cleanly
□ Tool appears in sidebar under correct category
□ Tool appears in dashboard search results
□ Tool renders correctly on desktop (≥1024px)
□ Tool renders correctly on mobile (<768px)
□ Keyboard navigation works (Tab, Enter, Escape)
□ Theme switching doesn't break tool styling
□ Copy-to-clipboard works
□ No console errors during normal usage
□ ErrorBoundary gracefully handles tool crashes
□ SEO component updates page title and meta tags
```

---

## 🏗️ Architecture & Data Flow

### Request Lifecycle (API Tester Example)

```
User fills form (method, URL, headers, body)
    │
    ▼
RequestConfig.jsx → collects input state
    │
    ▼
ApiTester.jsx → calls executeRequest()
    │
    ▼
apiService.js
    ├─ Cleans headers/params (filters empty keys)
    ├─ Parses JSON body string
    ├─ Builds Axios config (validateStatus: () => true)
    ├─ Starts timer: performance.now()
    ├─ Sends HTTP request via Axios
    ├─ Stops timer: calculates duration
    └─ Returns normalized response object
    │
    ▼
ApiTester.jsx → updates response state
    │
    ├─ ResponsePanel.jsx → renders status, headers, body
    ├─ RequestHistory.jsx → saves to localStorage
    └─ CodeGenerator.jsx → generates cURL/fetch/axios snippets
```

### GitHub Import Lifecycle (README Generator)

```
User pastes GitHub URL
    │
    ▼
GitHubImport.jsx → parseGitHubUrl(url)
    │
    ▼
deepAnalyzeRepo(owner, repo, onProgress)
    │
    ├─ Step 1 (parallel):
    │   ├─ GET /repos/{owner}/{repo}         → metadata
    │   ├─ GET /repos/{owner}/{repo}/languages → language stats
    │   ├─ GET /repos/{owner}/{repo}/git/trees/HEAD?recursive=1 → file tree
    │   └─ GET /repos/{owner}/{repo}/contributors?per_page=5
    │
    ├─ Step 2: Analyze file tree
    │   ├─ Detect package.json, requirements.txt, Dockerfile, etc.
    │   └─ Fetch file contents for: package.json, .env.example, CONTRIBUTING.md
    │
    ├─ Step 3: Infer tech stack
    │   ├─ Map dependencies to framework names (React, Express, etc.)
    │   ├─ Check file patterns (tsconfig.json → TypeScript, etc.)
    │   └─ Deduplicate (TypeScript present → remove JavaScript)
    │
    └─ Step 4: Generate README form data
        ├─ Auto-populate: name, description, install steps, usage, features
        ├─ Detect prerequisites (Node.js version, package manager)
        └─ Return formData + meta (stars, forks, files count)
    │
    ▼
ReadmeGenerator.jsx → populates ReadmeForm
    │
    ▼
ReadmePreview.jsx → renders live Markdown preview
```

### Learning Tools Data Flow

#### Sorting Visualizer

```
User selects algorithm + array size + speed
    │
    ▼
SortingVisualizer.jsx
    │
    ├─ generateArray(size) → random values 5..100
    │
    ├─ User clicks "Play"
    │   ├─ Generator function yields step-by-step states
    │   │   { array, comparing, swapping, sorted, phase }
    │   ├─ Timer interval reads next step from generator
    │   ├─ Each step updates state → triggers re-render
    │   ├─ Bar heights/colors reflect current step state
    │   └─ AudioContext plays tone proportional to bar value
    │
    ├─ User adjusts speed slider
    │   └─ Timer interval restarts with new delay
    │
    ├─ User clicks "Pause"
    │   └─ Timer interval cleared, step index preserved
    │
    └─ Algorithm completes
        └─ All bars marked as "sorted" → green color
```

#### Recursion Visualizer

```
User selects function (Fibonacci / Factorial / Power / Sum) + input
    │
    ▼
RecursionVisualizer.jsx
    │
    ├─ buildCallTree(funcKey, input)
    │   ├─ Recursively builds complete call tree as node graph
    │   ├─ Records every step: { type: call|base|return, nodeId, detail }
    │   └─ assignPositions(root) → lays out nodes for SVG rendering
    │
    ├─ Auto Play or Step-by-Step mode
    │   ├─ Each step highlights the active node in the SVG call tree
    │   ├─ Call stack panel shows live stack frames (push/pop)
    │   ├─ Code execution panel highlights current line
    │   └─ Sound effects per step type (optional)
    │
    ├─ Tabs: Visualize | Learn | Compare
    │   ├─ Visualize → SVG tree + call stack + timeline
    │   ├─ Learn → algorithm explanation + code + tips
    │   └─ Compare → complexity table across all functions
    │
    └─ Timeline clickable → jump to any step
```

#### JS Event Loop Visualizer

```
User selects example (setTimeout Basic / Promises / Nested / Async-Await)
    │
    ▼
EventLoopVisualizer.jsx
    │
    ├─ Pre-defined step arrays model exact JS engine behavior
    │   Each step: { phase, action, item, detail, callStack,
    │                webApis, taskQueue, microTaskQueue, consoleOutput }
    │
    ├─ Auto Play or Step-by-Step navigation
    │   ├─ Call Stack panel (LIFO) — push/pop animations
    │   ├─ Web APIs panel — timer registrations
    │   ├─ Task Queue panel (FIFO) — macrotask callbacks
    │   ├─ Microtask Queue panel (FIFO, higher priority)
    │   ├─ Event Loop indicator — shows active processing
    │   ├─ Console Output — logs appear in real-time
    │   └─ Source Code — highlights current executing line
    │
    ├─ Tabs: Visualize | Learn | Compare
    │   ├─ Learn → how the event loop works + key concepts
    │   └─ Compare → Microtasks vs Macrotasks table + interview Q&A
    │
    └─ Sound effects per phase (optional)
```

#### Flexbox Playground (Gamified)

```
User opens Flex Playground → 4 tabs: Sandbox | Challenge | Worlds | Achievements
    │
    ├─ Sandbox Mode
    │   ├─ Visual flexbox container with live CSS property controls
    │   ├─ Add/remove/edit flex items with per-item properties
    │   ├─ Live CSS + HTML code export with copy-to-clipboard
    │   └─ Property descriptions and value selectors
    │
    └─ Challenge Mode (Gamified)
        ├─ 10 challenges across 4 themed worlds (Grasslands → Volcano)
        ├─ Each challenge: match target layout using flex properties
        ├─ Scoring: base points × star multiplier + streak/combo/time bonuses
        ├─ Lives system (5 lives, auto-regen every 5 min)
        ├─ Power-ups: Free Hint, Time Freeze, Skip Level
        ├─ XP → Rank progression (Novice → Flex Master)
        ├─ 12 achievements (e.g., "Speed Demon", "No Hints Hero")
        ├─ Daily challenge with bonus XP
        └─ All progress persisted in localStorage
```

#### SQL Playground (Gamified)

```
User opens SQL Playground → 5 tabs: Sandbox | Challenge | Worlds | Reference | Achievements
    │
    ├─ Sandbox Mode
    │   ├─ In-browser SQLite database (sql.js / WebAssembly)
    │   ├─ SQL query editor with Ctrl+Enter execution
    │   ├─ Results table with column headers and row data
    │   ├─ Schema viewer (expandable table definitions)
    │   ├─ Query history log with duration tracking
    │   ├─ Sample queries organized by category
    │   └─ Load sample datasets / Reset database
    │
    └─ Challenge Mode (Gamified)
        ├─ 12 SQL challenges across 4 worlds (Tutorial → Mastery)
        ├─ Each challenge: write correct SQL against provided tables
        ├─ Server-side validation via validateResult() per challenge
        ├─ Same gamification as Flex: lives, XP, ranks, achievements, daily
        ├─ SQL-specific achievements (e.g., "Join Master", "Speed Demon")
        └─ All progress persisted in localStorage
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
| [sql.js](https://sql.js.org/) | 1.x | In-browser SQLite via WebAssembly (SQL Playground) |
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
│   │   ├── LazyImage.jsx             # Image with lazy loading
│   │   ├── LoadingSpinner.jsx        # Loading indicator with size variants
│   │   ├── PageProgress.jsx          # Top navigation progress bar
│   │   ├── ScrollToTop.jsx           # Scroll restoration on navigation
│   │   ├── SEO.jsx                   # Dynamic meta tags & Open Graph
│   │   ├── Skeleton.jsx              # Skeleton loading placeholders
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
│   │   ├── event-loop-visualizer/
│   │   │   └── EventLoopVisualizer.jsx # JS Event Loop step-by-step visualizer
│   │   ├── flex-playground/
│   │   │   └── FlexPlayground.jsx      # Gamified CSS Flexbox playground
│   │   ├── frontend-playground/
│   │   │   ├── FrontendPlayground.jsx  # Main playground component
│   │   │   ├── CodeMirrorEditor.jsx    # CodeMirror wrapper component
│   │   │   ├── codemirrorSetup.js      # Editor configuration & extensions
│   │   │   └── FrontendPlayground.css  # Playground-specific styles
│   │   ├── glassmorphism/
│   │   │   └── GlassmorphismGenerator.jsx
│   │   ├── grid-generator/
│   │   │   └── GridGenerator.jsx
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
│   │   ├── recursion-visualizer/
│   │   │   └── RecursionVisualizer.jsx # Animated recursive call tree visualizer
│   │   ├── regex-generator/
│   │   │   └── RegexGenerator.jsx
│   │   ├── sorting-visualizer/
│   │   │   └── SortingVisualizer.jsx
│   │   └── sql-playground/
│   │       ├── SqlPlayground.jsx       # Gamified SQL playground with challenges
│   │       └── sqlEngine.js            # sql.js wrapper & query execution engine
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
└── .gitignore                        # Git ignore rules
```

---

## 🎨 Theming

Developer Toolbox supports **31 themes** powered by DaisyUI, organized into Light and Dark categories:

### Light Themes (19)

Toolbox *(default)*, Light, Cupcake, Corporate, Garden, Lo-Fi, Pastel, Fantasy, Wireframe, CMYK, Autumn, Acid, Lemonade, Winter, Nord, Retro, Valentine, Aqua, Cyberpunk

### Dark Themes (12)

Toolbox Dark, Dark, Synthwave, Halloween, Black, Luxury, Dracula, Business, Night, Coffee, Dim, Sunset

### Custom Toolbox Themes

Two custom themes are defined in `src/index.css` using DaisyUI's CSS variable API:

| Theme | Primary (#2D79FF) | Style |
|-------|-------------------|-------|
| `toolbox` | `oklch(57.5% 0.22 264)` | Clean white background, blue primary, light mode |
| `toolbox-dark` | `oklch(57.5% 0.22 264)` | Dark slate background, same blue primary, dark mode |

### How to Switch Themes

1. **Header Dropdown** — Quick access to 8 popular themes from any page
2. **Settings Page** — Full visual theme gallery with live previews of all 31 themes

Themes are persisted in `localStorage` key `devtoolbox-theme` and apply instantly across the entire application via DaisyUI's `data-theme` attribute.

---

## ♿ Accessibility

- **Skip to main content** link for keyboard users
- **ARIA labels** on all interactive elements
- **Focus indicators** — Visible focus rings on keyboard navigation (2px solid primary, 2px offset)
- **Semantic HTML** — Proper heading hierarchy, landmarks, and roles
- **Touch targets** — Minimum 44×44px for mobile interactions (enforced via CSS)
- **Reduced motion** — Respects `prefers-reduced-motion` preference (disables all animations)
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
- **SQL Playground** — Downloads the sql.js WebAssembly binary from CDN on first use
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
- **RequestIdleCallback** polyfill for deferred non-critical work

---

## 🤝 Contributing

Contributions are welcome! Please follow the [Developer Flow](#-developer-flow) section above for the complete guide on adding new tools.

### Quick Contribution Checklist

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-tool-name`
3. Follow the [Adding a New Tool](#adding-a-new-tool-step-by-step) pattern
4. Run the [Testing Checklist](#testing-checklist-pre-pr)
5. Submit a Pull Request

### Code Style Guidelines

- **Components:** Functional components with hooks only (no class components except ErrorBoundary)
- **Styling:** TailwindCSS utilities + DaisyUI semantic classes + custom CSS from `index.css`
- **State:** `useState` for local, `useLocalStorage` for persistent, `useContext` for theme only
- **Naming:** PascalCase components, camelCase functions/variables, kebab-case file paths
- **Exports:** Default export for page/tool components, named exports for utilities/hooks

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
