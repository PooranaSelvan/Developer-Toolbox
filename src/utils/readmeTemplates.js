/**
 * README.md template generators — Professional edition.
 * Each template accepts structured formData and returns polished markdown.
 */

/* ── Badge helpers ── */
function shieldBadge(label, message, color, style = 'flat') {
  return `![${label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(message)}-${color}?style=${style})`;
}

function generateBadges(data) {
  const badges = [];

  // Custom badges from the badge builder
  if (data.badges && data.badges.length > 0) {
    const customBadges = typeof data.badges === 'string'
      ? data.badges.split('\n').filter(Boolean)
      : data.badges.filter((b) => b.text);
    customBadges.forEach((b) => {
      if (typeof b === 'string') {
        badges.push(b);
      } else {
        const url = b.url
          ? `[${shieldBadge(b.label || '', b.text, b.color || '333', b.style || 'flat')}](${b.url})`
          : shieldBadge(b.label || '', b.text, b.color || '333', b.style || 'flat');
        badges.push(url);
      }
    });
  }

  if (data.license) {
    badges.push(`![License](https://img.shields.io/badge/License-${encodeURIComponent(data.license)}-blue.svg)`);
  }

  if (data.techStack) {
    const techs = data.techStack.split(',').map((t) => t.trim()).filter(Boolean);
    techs.slice(0, 5).forEach((tech) => {
      badges.push(`![${tech}](https://img.shields.io/badge/-${encodeURIComponent(tech)}-333?style=flat&logo=${encodeURIComponent(tech.toLowerCase())}&logoColor=white)`);
    });
  }

  return badges.length > 0 ? badges.join(' ') + '\n\n' : '';
}

/* ── Section renderers ── */

function renderFeatures(data) {
  if (!data.features) return '';
  const lines = data.features.split('\n').filter(Boolean);
  return lines.map((f) => `- ${f.replace(/^[-*✅🔹•]\s*/, '')}`).join('\n') + '\n';
}

function renderFeaturesEmoji(data) {
  if (!data.features) return '';
  const lines = data.features.split('\n').filter(Boolean);
  return lines.map((f) => `- ✅ ${f.replace(/^[-*✅🔹•]\s*/, '')}`).join('\n') + '\n';
}

function renderTechTable(data) {
  if (!data.techStack) return '';
  const techs = data.techStack.split(',').map((t) => t.trim()).filter(Boolean);
  let md = '| Technology | Description |\n|---|---|\n';
  techs.forEach((tech) => {
    md += `| **${tech}** | - |\n`;
  });
  return md + '\n';
}

function renderTechList(data) {
  if (!data.techStack) return '';
  return data.techStack.split(',').map((t) => t.trim()).filter(Boolean).map((t) => `- ${t}`).join('\n') + '\n';
}

function renderEnvVars(data) {
  if (!data.envVars) return '';
  const lines = data.envVars.split('\n').filter(Boolean);
  let md = '| Variable | Description | Required |\n|---|---|---|\n';
  lines.forEach((line) => {
    const [key, ...desc] = line.split('=');
    const varName = key?.trim() || line;
    const description = desc.join('=').trim() || '-';
    md += `| \`${varName}\` | ${description} | Yes |\n`;
  });
  return md + '\n';
}

function renderRoadmap(data) {
  if (!data.roadmap) return '';
  const lines = data.roadmap.split('\n').filter(Boolean);
  return lines.map((item) => {
    const cleaned = item.replace(/^[-*•]\s*/, '');
    return `- [ ] ${cleaned}`;
  }).join('\n') + '\n';
}

function renderFaq(data) {
  if (!data.faq) return '';
  const lines = data.faq.split('\n').filter(Boolean);
  let md = '';
  lines.forEach((line) => {
    if (line.startsWith('Q:') || line.startsWith('q:')) {
      md += `\n**${line.trim()}**\n\n`;
    } else if (line.startsWith('A:') || line.startsWith('a:')) {
      md += `${line.replace(/^[Aa]:\s*/, '')}\n`;
    } else {
      md += `**Q: ${line.trim()}**\n\n`;
    }
  });
  return md + '\n';
}

function renderChangelog(data) {
  if (!data.changelog) return '';
  return data.changelog + '\n\n';
}

function renderAcknowledgments(data) {
  if (!data.acknowledgments) return '';
  const lines = data.acknowledgments.split('\n').filter(Boolean);
  return lines.map((a) => `- ${a.replace(/^[-*•]\s*/, '')}`).join('\n') + '\n';
}

function renderDemoLinks(data) {
  if (!data.demoUrl && !data.screenshots) return '';
  let md = '';
  if (data.demoUrl) {
    md += `🔗 **[Live Demo](${data.demoUrl})**\n\n`;
  }
  if (data.screenshots) {
    md += data.screenshots + '\n';
  }
  return md + '\n';
}

function renderApiReference(data) {
  if (!data.apiReference) return '';
  const lines = data.apiReference.split('\n').filter(Boolean);
  let md = '| Method | Endpoint | Description |\n|---|---|---|\n';
  lines.forEach((line) => {
    const parts = line.split(/\s+/);
    const method = parts[0]?.toUpperCase() || 'GET';
    const endpoint = parts[1] || '/';
    const desc = parts.slice(2).join(' ') || '-';
    md += `| \`${method}\` | \`${endpoint}\` | ${desc} |\n`;
  });
  return md + '\n';
}

function renderCustomSections(data) {
  if (!data.customSections || data.customSections.length === 0) return '';
  let md = '';
  data.customSections.forEach((section) => {
    if (section.title && section.content) {
      md += `## ${section.title}\n\n${section.content}\n\n`;
    }
  });
  return md;
}

function renderToc(sections) {
  let md = '## 📋 Table of Contents\n\n';
  sections.forEach(({ label, anchor }) => {
    md += `- [${label}](#${anchor})\n`;
  });
  return md + '\n';
}

function buildTocSections(data, opts = {}) {
  const sections = [];
  const e = opts.emoji !== false;

  if (data.description) sections.push({ label: `${e ? '📖 ' : ''}About`, anchor: e ? '-about' : 'about' });
  if (data.demoUrl || data.screenshots) sections.push({ label: `${e ? '📸 ' : ''}Demo`, anchor: e ? '-demo--screenshots' : 'demo--screenshots' });
  if (data.features) sections.push({ label: `${e ? '✨ ' : ''}Features`, anchor: e ? '-features' : 'features' });
  if (data.techStack) sections.push({ label: `${e ? '🛠️ ' : ''}Tech Stack`, anchor: e ? '️-tech-stack' : 'tech-stack' });
  sections.push({ label: `${e ? '🚀 ' : ''}Getting Started`, anchor: e ? '-getting-started' : 'getting-started' });
  if (data.envVars) sections.push({ label: `${e ? '⚙️ ' : ''}Environment Variables`, anchor: e ? '️-environment-variables' : 'environment-variables' });
  if (data.usage) sections.push({ label: `${e ? '💻 ' : ''}Usage`, anchor: e ? '-usage' : 'usage' });
  if (data.apiReference) sections.push({ label: `${e ? '🔌 ' : ''}API Reference`, anchor: e ? '-api-reference' : 'api-reference' });
  if (data.roadmap) sections.push({ label: `${e ? '🗺️ ' : ''}Roadmap`, anchor: e ? '️-roadmap' : 'roadmap' });
  if (data.faq) sections.push({ label: `${e ? '❓ ' : ''}FAQ`, anchor: e ? '-faq' : 'faq' });
  if (data.contributing) sections.push({ label: `${e ? '🤝 ' : ''}Contributing`, anchor: e ? '-contributing' : 'contributing' });
  if (data.changelog) sections.push({ label: `${e ? '📝 ' : ''}Changelog`, anchor: e ? '-changelog' : 'changelog' });
  if (data.license) sections.push({ label: `${e ? '📄 ' : ''}License`, anchor: e ? '-license' : 'license' });
  if (data.author) sections.push({ label: `${e ? '👤 ' : ''}Author`, anchor: e ? '-author' : 'author' });
  if (data.acknowledgments) sections.push({ label: `${e ? '🙏 ' : ''}Acknowledgments`, anchor: e ? '-acknowledgments' : 'acknowledgments' });

  return sections;
}

/* ═══════════════════════════════════════════════
   Template: Minimal — Clean & concise
   ═══════════════════════════════════════════════ */
export function minimalTemplate(data) {
  let md = '';

  md += generateBadges(data);
  md += `# ${data.projectName || 'Project Name'}\n\n`;

  if (data.description) md += `${data.description}\n\n`;

  if (data.features) {
    md += `## Features\n\n${renderFeatures(data)}\n`;
  }

  if (data.installation) {
    md += `## Quick Start\n\n\`\`\`bash\n${data.installation}\n\`\`\`\n\n`;
  }

  if (data.usage) {
    md += `## Usage\n\n\`\`\`bash\n${data.usage}\n\`\`\`\n\n`;
  }

  if (data.envVars) {
    md += `## Environment Variables\n\n${renderEnvVars(data)}`;
  }

  if (data.techStack) {
    md += `## Built With\n\n${renderTechList(data)}\n`;
  }

  if (data.apiReference) {
    md += `## API\n\n${renderApiReference(data)}`;
  }

  if (data.contributing) {
    md += `## Contributing\n\n${data.contributing}\n\n`;
  }

  if (data.license) {
    md += `## License\n\n${data.license}\n\n`;
  }

  if (data.author) {
    md += `---\n\nBuilt by **${data.author}**\n`;
  }

  md += renderCustomSections(data);

  return md;
}

/* ═══════════════════════════════════════════════
   Template: Standard — Balanced open-source README
   ═══════════════════════════════════════════════ */
export function standardTemplate(data) {
  let md = '';

  md += generateBadges(data);
  md += `# ${data.projectName || 'Project Name'}\n\n`;

  if (data.description) md += `> ${data.description}\n\n`;

  if (data.demoUrl) md += `🔗 **[Live Demo](${data.demoUrl})**\n\n`;

  // ToC
  const tocSections = buildTocSections(data, { emoji: false });
  if (tocSections.length > 3) {
    md += `## Table of Contents\n\n`;
    tocSections.forEach(({ label, anchor }) => {
      md += `- [${label}](#${anchor})\n`;
    });
    md += '\n';
  }

  if (data.description) {
    md += `## About\n\n${data.description}\n\n`;
  }

  if (data.screenshots) {
    md += `## Screenshots\n\n${data.screenshots}\n\n`;
  }

  if (data.features) {
    md += `## Features\n\n${renderFeaturesEmoji(data)}\n`;
  }

  if (data.techStack) {
    md += `## Tech Stack\n\n${renderTechList(data)}\n`;
  }

  // Getting Started
  md += `## Getting Started\n\n`;
  md += `### Prerequisites\n\n`;
  if (data.prerequisites) {
    md += `${data.prerequisites}\n\n`;
  } else {
    md += `- [Node.js](https://nodejs.org/) (v16+)\n- npm or yarn\n\n`;
  }

  if (data.installation) {
    md += `### Installation\n\n\`\`\`bash\n${data.installation}\n\`\`\`\n\n`;
  }

  if (data.envVars) {
    md += `## Environment Variables\n\nCreate a \`.env\` file in the root directory:\n\n\`\`\`env\n${data.envVars}\n\`\`\`\n\n${renderEnvVars(data)}`;
  }

  if (data.usage) {
    md += `## Usage\n\n\`\`\`bash\n${data.usage}\n\`\`\`\n\n`;
  }

  if (data.apiReference) {
    md += `## API Reference\n\n${renderApiReference(data)}`;
  }

  if (data.roadmap) {
    md += `## Roadmap\n\n${renderRoadmap(data)}\n`;
  }

  if (data.faq) {
    md += `## FAQ\n\n${renderFaq(data)}`;
  }

  if (data.contributing) {
    md += `## Contributing\n\nContributions are welcome!\n\n`;
    md += `1. Fork the repository\n`;
    md += `2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)\n`;
    md += `3. Commit your changes (\`git commit -m 'Add amazing feature'\`)\n`;
    md += `4. Push to the branch (\`git push origin feature/amazing-feature\`)\n`;
    md += `5. Open a Pull Request\n\n`;
    md += `${data.contributing}\n\n`;
  }

  if (data.changelog) {
    md += `## Changelog\n\n${renderChangelog(data)}`;
  }

  if (data.license) {
    md += `## License\n\nDistributed under the **${data.license}** License. See \`LICENSE\` for more information.\n\n`;
  }

  if (data.author) {
    md += `## Author\n\n**${data.author}**\n\n`;
    md += `- GitHub: [@${data.author}](https://github.com/${data.author})\n`;
  }

  if (data.acknowledgments) {
    md += `\n## Acknowledgments\n\n${renderAcknowledgments(data)}\n`;
  }

  md += renderCustomSections(data);

  md += `\n---\n\n⭐ Star this repo if you find it helpful!\n`;

  return md;
}

/* ═══════════════════════════════════════════════
   Template: Open Source — Community-focused with emojis
   ═══════════════════════════════════════════════ */
export function openSourceTemplate(data) {
  let md = '';

  md += generateBadges(data);
  md += `# ${data.projectName || 'Project Name'}\n\n`;

  if (data.description) md += `> ${data.description}\n\n`;

  if (data.demoUrl) md += `🔗 **[Live Demo](${data.demoUrl})** | `;
  if (data.author) md += `👤 [@${data.author}](https://github.com/${data.author})`;
  if (data.demoUrl || data.author) md += '\n\n';

  // ToC
  const tocSections = buildTocSections(data);
  if (tocSections.length > 3) {
    md += renderToc(tocSections);
  }

  if (data.description) {
    md += `## 📖 About\n\n${data.description}\n\n`;
  }

  if (data.demoUrl || data.screenshots) {
    md += `## 📸 Demo & Screenshots\n\n${renderDemoLinks(data)}`;
  }

  if (data.features) {
    md += `## ✨ Features\n\n${renderFeaturesEmoji(data)}\n`;
  }

  if (data.techStack) {
    md += `## 🛠️ Tech Stack\n\n${renderTechTable(data)}`;
  }

  // Getting Started
  md += `## 🚀 Getting Started\n\n`;
  md += `### Prerequisites\n\n`;
  if (data.prerequisites) {
    md += `${data.prerequisites}\n\n`;
  } else {
    md += `- [Node.js](https://nodejs.org/) (v16+)\n- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)\n\n`;
  }

  if (data.installation) {
    md += `### Installation\n\n\`\`\`bash\n${data.installation}\n\`\`\`\n\n`;
  }

  if (data.envVars) {
    md += `## ⚙️ Environment Variables\n\nCreate a \`.env\` file in the root directory:\n\n\`\`\`env\n${data.envVars}\n\`\`\`\n\n${renderEnvVars(data)}`;
  }

  if (data.usage) {
    md += `## 💻 Usage\n\n\`\`\`bash\n${data.usage}\n\`\`\`\n\n`;
  }

  if (data.apiReference) {
    md += `## 🔌 API Reference\n\n${renderApiReference(data)}`;
  }

  if (data.roadmap) {
    md += `## 🗺️ Roadmap\n\n${renderRoadmap(data)}\n`;
  }

  if (data.faq) {
    md += `## ❓ FAQ\n\n${renderFaq(data)}`;
  }

  if (data.contributing) {
    md += `## 🤝 Contributing\n\n`;
    md += `Contributions are what make the open source community amazing! Any contributions you make are **greatly appreciated**.\n\n`;
    md += `1. Fork the Project\n`;
    md += `2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)\n`;
    md += `3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)\n`;
    md += `4. Push to the Branch (\`git push origin feature/AmazingFeature\`)\n`;
    md += `5. Open a Pull Request\n\n`;
    md += `${data.contributing}\n\n`;
  }

  if (data.changelog) {
    md += `## 📝 Changelog\n\n${renderChangelog(data)}`;
  }

  if (data.license) {
    md += `## 📄 License\n\n`;
    md += `This project is licensed under the **${data.license}** License — see the [LICENSE](LICENSE) file for details.\n\n`;
  }

  if (data.author) {
    md += `## 👤 Author\n\n`;
    md += `**${data.author}**\n\n`;
    md += `- GitHub: [@${data.author}](https://github.com/${data.author})\n`;
    if (data.authorTwitter) md += `- Twitter: [@${data.authorTwitter}](https://twitter.com/${data.authorTwitter})\n`;
    if (data.authorWebsite) md += `- Website: [${data.authorWebsite}](${data.authorWebsite})\n`;
  }

  if (data.acknowledgments) {
    md += `\n## 🙏 Acknowledgments\n\n${renderAcknowledgments(data)}\n`;
  }

  md += renderCustomSections(data);

  md += `\n---\n\n`;
  md += `⭐ Star this repo if you find it helpful!\n`;

  return md;
}

/* ═══════════════════════════════════════════════
   Template: Enterprise — Full professional README
   ═══════════════════════════════════════════════ */
export function enterpriseTemplate(data) {
  const slug = data.projectName?.toLowerCase().replace(/\s+/g, '-') || 'project';
  let md = '';

  md += `<div align="center">\n\n`;
  md += generateBadges(data);
  md += `# ${data.projectName || 'Project Name'}\n\n`;
  if (data.description) md += `**${data.description}**\n\n`;
  md += `[Getting Started](#-getting-started) · [Documentation](#-documentation) · [Contributing](#-contributing)`;
  if (data.roadmap) md += ` · [Roadmap](#️-roadmap)`;
  md += `\n\n</div>\n\n`;
  md += `---\n\n`;

  // About
  md += `## 📖 About\n\n${data.description || 'Add a detailed project description.'}\n\n`;

  if (data.demoUrl || data.screenshots) {
    md += `## 📸 Demo & Screenshots\n\n${renderDemoLinks(data)}`;
  }

  if (data.features) {
    md += `## ✨ Key Features\n\n`;
    data.features.split('\n').filter(Boolean).forEach((f) => {
      md += `- 🔹 ${f.replace(/^[-*🔹•]\s*/, '')}\n`;
    });
    md += '\n';
  }

  if (data.techStack) {
    md += `## 🏗️ Architecture & Tech Stack\n\n${renderTechTable(data)}`;
  }

  // Getting Started
  md += `## 🚀 Getting Started\n\n`;
  md += `### System Requirements\n\n`;
  if (data.prerequisites) {
    md += `${data.prerequisites}\n\n`;
  } else {
    md += `- Node.js >= 16.x\n- npm >= 8.x or yarn >= 1.22.x\n\n`;
  }

  if (data.installation) {
    md += `### Installation\n\n`;
    md += `\`\`\`bash\n# Clone the repository\ngit clone https://github.com/${data.author || 'username'}/${slug}.git\n\n`;
    md += `# Navigate to project directory\ncd ${slug}\n\n`;
    md += `# Install dependencies\n${data.installation}\n\`\`\`\n\n`;
  }

  if (data.envVars) {
    md += `### Environment Configuration\n\nCopy the example env file and configure:\n\n`;
    md += `\`\`\`bash\ncp .env.example .env\n\`\`\`\n\n`;
    md += `\`\`\`env\n${data.envVars}\n\`\`\`\n\n${renderEnvVars(data)}`;
  }

  if (data.usage) {
    md += `### Running the Application\n\n\`\`\`bash\n${data.usage}\n\`\`\`\n\n`;
  }

  // Documentation
  md += `## 📚 Documentation\n\n`;
  md += `For detailed documentation, visit the [Wiki](../../wiki) or check the \`/docs\` directory.\n\n`;

  if (data.apiReference) {
    md += `## 🔌 API Reference\n\n${renderApiReference(data)}`;
  }

  if (data.roadmap) {
    md += `## 🗺️ Roadmap\n\n${renderRoadmap(data)}\n`;
    md += `See the [open issues](../../issues) for a full list of proposed features and known bugs.\n\n`;
  }

  if (data.faq) {
    md += `## ❓ FAQ\n\n${renderFaq(data)}`;
  }

  // Contributing
  md += `## 🤝 Contributing\n\n`;
  if (data.contributing) md += `${data.contributing}\n\n`;
  md += `Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.\n\n`;

  if (data.changelog) {
    md += `## 📝 Changelog\n\nSee [CHANGELOG.md](CHANGELOG.md) for release notes.\n\n${renderChangelog(data)}`;
  }

  if (data.license) {
    md += `## 📄 License\n\nDistributed under the **${data.license}** License. See \`LICENSE\` for more information.\n\n`;
  }

  if (data.author) {
    md += `## 👥 Contact & Maintainers\n\n`;
    md += `| Maintainer | GitHub | Role |\n|---|---|---|\n`;
    md += `| ${data.author} | [@${data.author}](https://github.com/${data.author}) | Lead Developer |\n\n`;
  }

  if (data.acknowledgments) {
    md += `## 🙏 Acknowledgments\n\n${renderAcknowledgments(data)}\n`;
  }

  md += renderCustomSections(data);

  md += `---\n\n<div align="center">\nMade with ❤️ by ${data.author || 'the team'}\n</div>\n`;

  return md;
}

/* ═══════════════════════════════════════════════
   Template: API Docs — Focused on API documentation
   ═══════════════════════════════════════════════ */
export function apiDocsTemplate(data) {
  let md = '';

  md += generateBadges(data);
  md += `# ${data.projectName || 'API Name'} Documentation\n\n`;

  if (data.description) md += `> ${data.description}\n\n`;

  if (data.demoUrl) md += `**Base URL:** \`${data.demoUrl}\`\n\n`;

  // Auth
  md += `## 🔐 Authentication\n\n`;
  md += `All API requests require authentication via Bearer token:\n\n`;
  md += `\`\`\`\nAuthorization: Bearer <your-api-key>\n\`\`\`\n\n`;

  if (data.installation) {
    md += `## ⚡ Quick Start\n\n\`\`\`bash\n${data.installation}\n\`\`\`\n\n`;
  }

  if (data.envVars) {
    md += `## ⚙️ Configuration\n\n\`\`\`env\n${data.envVars}\n\`\`\`\n\n${renderEnvVars(data)}`;
  }

  if (data.apiReference) {
    md += `## 📡 Endpoints\n\n${renderApiReference(data)}`;
  }

  if (data.usage) {
    md += `## 💡 Examples\n\n\`\`\`bash\n${data.usage}\n\`\`\`\n\n`;
  }

  if (data.features) {
    md += `## ✨ Features\n\n${renderFeaturesEmoji(data)}\n`;
  }

  if (data.techStack) {
    md += `## 🛠️ Built With\n\n${renderTechList(data)}\n`;
  }

  md += `## 📊 Rate Limiting\n\n`;
  md += `| Plan | Requests/min | Requests/day |\n|---|---|---|\n`;
  md += `| Free | 60 | 1,000 |\n| Pro | 300 | 10,000 |\n| Enterprise | Unlimited | Unlimited |\n\n`;

  md += `## 🚨 Error Codes\n\n`;
  md += `| Code | Description |\n|---|---|\n`;
  md += `| 400 | Bad Request — Invalid parameters |\n`;
  md += `| 401 | Unauthorized — Invalid API key |\n`;
  md += `| 404 | Not Found — Resource doesn't exist |\n`;
  md += `| 429 | Too Many Requests — Rate limit exceeded |\n`;
  md += `| 500 | Internal Server Error |\n\n`;

  if (data.faq) {
    md += `## ❓ FAQ\n\n${renderFaq(data)}`;
  }

  if (data.changelog) {
    md += `## 📝 Changelog\n\n${renderChangelog(data)}`;
  }

  if (data.license) {
    md += `## 📄 License\n\n${data.license}\n\n`;
  }

  md += renderCustomSections(data);

  if (data.author) {
    md += `---\n\nMaintained by **${data.author}**\n`;
  }

  return md;
}

/* ═══════════════════════════════════════════════
   Template: Library/Package — npm/pip package README
   ═══════════════════════════════════════════════ */
export function libraryTemplate(data) {
  const slug = data.projectName?.toLowerCase().replace(/\s+/g, '-') || 'package';
  let md = '';

  md += `<div align="center">\n\n`;
  md += generateBadges(data);
  md += `# ${data.projectName || 'Package Name'}\n\n`;
  if (data.description) md += `${data.description}\n\n`;
  md += `</div>\n\n`;

  // Install
  md += `## 📦 Installation\n\n`;
  md += `\`\`\`bash\n# npm\nnpm install ${slug}\n\n# yarn\nyarn add ${slug}\n\n# pnpm\npnpm add ${slug}\n\`\`\`\n\n`;

  if (data.installation) {
    md += `### Additional Setup\n\n\`\`\`bash\n${data.installation}\n\`\`\`\n\n`;
  }

  if (data.usage) {
    md += `## 🚀 Quick Start\n\n\`\`\`javascript\n${data.usage}\n\`\`\`\n\n`;
  }

  if (data.features) {
    md += `## ✨ Features\n\n${renderFeaturesEmoji(data)}\n`;
  }

  if (data.apiReference) {
    md += `## 📖 API\n\n${renderApiReference(data)}`;
  }

  if (data.envVars) {
    md += `## ⚙️ Configuration\n\n${renderEnvVars(data)}`;
  }

  if (data.techStack) {
    md += `## 🛠️ Built With\n\n${renderTechList(data)}\n`;
  }

  if (data.faq) {
    md += `## ❓ FAQ\n\n${renderFaq(data)}`;
  }

  if (data.contributing) {
    md += `## 🤝 Contributing\n\n${data.contributing}\n\n`;
  }

  if (data.changelog) {
    md += `## 📝 Changelog\n\n${renderChangelog(data)}`;
  }

  if (data.roadmap) {
    md += `## 🗺️ Roadmap\n\n${renderRoadmap(data)}\n`;
  }

  if (data.license) {
    md += `## 📄 License\n\n[${data.license}](LICENSE)\n\n`;
  }

  md += renderCustomSections(data);

  if (data.acknowledgments) {
    md += `## 🙏 Acknowledgments\n\n${renderAcknowledgments(data)}\n`;
  }

  if (data.author) {
    md += `---\n\nMade with ❤️ by **[@${data.author}](https://github.com/${data.author})**\n`;
  }

  return md;
}

/* ═══ Template registry ═══ */
export const TEMPLATES = {
  minimal:    { name: 'Minimal',     emoji: '📄', description: 'Clean & concise for small projects',              fn: minimalTemplate },
  standard:   { name: 'Standard',    emoji: '📘', description: 'Balanced README for most projects',               fn: standardTemplate },
  openSource: { name: 'Open Source', emoji: '🌍', description: 'Community-focused with emojis & full sections',   fn: openSourceTemplate },
  enterprise: { name: 'Enterprise',  emoji: '🏢', description: 'Enterprise-grade with professional structure',     fn: enterpriseTemplate },
  apiDocs:    { name: 'API Docs',    emoji: '📡', description: 'Focused on API documentation & endpoints',        fn: apiDocsTemplate },
  library:    { name: 'Library',     emoji: '📦', description: 'npm/pip package README with install instructions', fn: libraryTemplate },
};
