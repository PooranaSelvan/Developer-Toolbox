# 🛠️ Developer Toolbox

> **A comprehensive, privacy-first collection of 18+ developer utilities — all running entirely client-side.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI-5-5A0EF8?logo=daisyui&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- ⚡ **Lightning Fast** — instant results with zero server latency
- 🔒 **Privacy First** — everything runs in your browser, no data sent anywhere
- 🎨 **30+ Themes** — switch between light, dark, and specialty themes
- 📱 **Responsive** — fully mobile-friendly with adaptive layouts
- 🧩 **18 Developer Tools** — one toolkit for all your daily needs

---

## 🧰 Tools

### 🛠️ Developer Tools
| Tool | Description |
|------|-------------|
| **README Generator** | Generate professional README.md files with GitHub integration |
| **API Tester** | Test APIs with a powerful Postman-like interface |
| **Mock API Generator** | Generate fake REST APIs with realistic data |
| **JWT Decoder** | Decode and inspect JSON Web Tokens instantly |
| **JSON Formatter** | Format, validate, minify, and transform JSON |
| **Regex Generator** | Build, test & generate regex patterns with live preview |
| **Diff Checker** | Compare two texts side-by-side with highlighting |
| **Markdown Editor** | Write & preview Markdown with live rendering |

### 🔐 Encoding & Security
| Tool | Description |
|------|-------------|
| **Encoder / Decoder** | Base64, URL, HTML, Unicode & Hex encoding |
| **Hash Generator** | SHA hashing, hash verification & password tools |

### 🎨 Frontend Tools
| Tool | Description |
|------|-------------|
| **Color Palette** | Generate, explore & export beautiful color palettes |
| **CSS Gradient** | Create beautiful CSS gradients with live preview |
| **Box Shadow** | Create layered box shadows with visual editor |
| **Glassmorphism** | Create stunning frosted glass UI effects |
| **CSS Unit Converter** | Convert between px, rem, em, vw, vh & more |

### 📝 Content & SEO
| Tool | Description |
|------|-------------|
| **Meta Tag Generator** | Generate SEO meta tags with live preview & analysis |
| **Lorem Ipsum Generator** | Generate placeholder text in multiple styles |
| **Timestamp Converter** | Convert Unix timestamps, ISO dates & more |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and **npm** 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd developer-toolbox

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🏗️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework with latest features |
| **Vite 5** | Build tool with instant HMR |
| **TailwindCSS 3** | Utility-first CSS framework |
| **DaisyUI 5** | Tailwind component library with 30+ themes |
| **Framer Motion** | Fluid animations and transitions |
| **React Router 7** | Client-side routing |
| **Lucide React** | Beautiful icon library |
| **React Markdown** | Markdown rendering with GFM support |
| **Axios** | HTTP client for API testing |

---

## 📁 Project Structure

```
developer-toolbox/
├── public/                 # Static assets (favicon, logo)
├── src/
│   ├── components/ui/      # Reusable UI components (Magic UI)
│   ├── contexts/           # React contexts (Theme)
│   ├── hooks/              # Custom hooks (clipboard, storage, download)
│   ├── layouts/            # App layout (Header, Sidebar, AppLayout)
│   ├── pages/              # Page components (Dashboard, Settings, 404)
│   ├── services/           # API services
│   ├── tools/              # Individual tool implementations
│   │   ├── api-tester/
│   │   ├── base64-tool/
│   │   ├── box-shadow/
│   │   ├── color-palette/
│   │   ├── css-gradient/
│   │   ├── css-units/
│   │   ├── diff-checker/
│   │   ├── glassmorphism/
│   │   ├── hash-generator/
│   │   ├── json-formatter/
│   │   ├── jwt-decoder/
│   │   ├── lorem-generator/
│   │   ├── markdown-editor/
│   │   ├── meta-tags/
│   │   ├── mock-api/
│   │   ├── readme-generator/
│   │   ├── regex-generator/
│   │   └── timestamp-converter/
│   └── utils/              # Utilities and tool registry
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🎨 Theming

Developer Toolbox supports **31 themes** powered by DaisyUI. Switch themes instantly from:
- The **header dropdown** for quick access to popular themes
- The **Settings page** for the complete theme gallery with visual previews

Themes are persisted in `localStorage` and apply instantly across the entire application.

---

## 🤝 Contributing

Contributions are welcome! To add a new tool:

1. Create a new directory under `src/tools/your-tool-name/`
2. Build your tool component following the existing patterns
3. Register it in `src/utils/toolRegistry.js` with metadata
4. Add the route in `src/App.jsx`
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
