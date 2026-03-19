/**
 * README.md template generators — Premium Professional Edition.
 * Each template produces a visually stunning, well-structured README
 * with modern GitHub-compatible markdown & HTML enhancements.
 */

function shieldEncode(text) {
  return encodeURIComponent(text).replace(/-/g, '--').replace(/_/g, '__');
}

function shieldBadgeMd(label, message, color, style = 'for-the-badge') {
  const url = `https://img.shields.io/badge/${shieldEncode(label)}-${shieldEncode(message)}-${color}?style=${style}`;
  return `![${label}](${url})`;
}

function shieldBadgeHtml(label, message, color, style = 'for-the-badge') {
  const url = `https://img.shields.io/badge/${shieldEncode(label)}-${shieldEncode(message)}-${color}?style=${style}`;
  return `<img src="${url}" alt="${label}" />`;
}

function generateBadges(data) {
  const mdBadges = [];
  const htmlBadges = [];
  if (data.badges && data.badges.length > 0) {
    const customBadges = typeof data.badges === 'string' ? data.badges.split('\n').filter(Boolean) : data.badges.filter((b) => b.text);
    customBadges.forEach((b) => {
      if (typeof b === 'string') { mdBadges.push(b); htmlBadges.push(b); }
      else {
        const mdB = shieldBadgeMd(b.label || '', b.text, b.color || '333', b.style || 'for-the-badge');
        const htB = shieldBadgeHtml(b.label || '', b.text, b.color || '333', b.style || 'for-the-badge');
        if (b.url) { mdBadges.push(`[${mdB}](${b.url})`); htmlBadges.push(`<a href="${b.url}">${htB}</a>`); }
        else { mdBadges.push(mdB); htmlBadges.push(htB); }
      }
    });
  }
  if (data.license) {
    const u = `https://img.shields.io/badge/License-${shieldEncode(data.license)}-blue?style=for-the-badge`;
    mdBadges.push(`![License](${u})`); htmlBadges.push(`<img src="${u}" alt="License" />`);
  }
  return { md: mdBadges, html: htmlBadges };
}

const TECH_COLOR_MAP = {
  'react':'61DAFB','next.js':'000000','vue.js':'4FC08D','angular':'DD0031','svelte':'FF3E00',
  'node.js':'339933','express.js':'000000','express':'000000','typescript':'3178C6','javascript':'F7DF1E',
  'python':'3776AB','django':'092E20','flask':'000000','go':'00ADD8','rust':'000000','java':'007396',
  'tailwindcss':'06B6D4','bootstrap':'7952B3','mongodb':'47A248','postgresql':'4169E1','mysql':'4479A1',
  'redis':'DC382D','docker':'2496ED','aws':'232F3E','firebase':'FFCA28','graphql':'E10098',
  'prisma':'2D3748','vite':'646CFF','webpack':'8DD6F9','jest':'C21325','vitest':'6E9F18',
  'cypress':'17202C','electron':'47848F','react native':'61DAFB','flutter':'02569B','dart':'0175C2',
  'stripe':'008CDD','vercel':'000000','netlify':'00C7B7','github actions':'2088FF','daisyui':'5A0EF8',
  'material ui':'0081CB','chakra ui':'319795','framer motion':'0055FF','redux':'764ABC','zustand':'433D37',
  'socket.io':'010101','three.js':'000000','d3.js':'F9A03C','storybook':'FF4785','react router':'CA4245','axios':'5A29E4',
};

function generateTechBadges(data) {
  if (!data.techStack) return { md: [], html: [] };
  const techs = data.techStack.split(',').map(t => t.trim()).filter(Boolean);
  const mdB = [], htB = [];
  techs.forEach(tech => {
    const logo = encodeURIComponent(tech.toLowerCase().replace(/\.js$/, '').replace(/\s+/g, ''));
    const color = TECH_COLOR_MAP[tech.toLowerCase()] || '333333';
    const url = `https://img.shields.io/badge/${shieldEncode(tech)}-${color}?style=for-the-badge&logo=${logo}&logoColor=white`;
    mdB.push(`![${tech}](${url})`); htB.push(`<img src="${url}" alt="${tech}" />`);
  });
  return { md: mdB, html: htB };
}

function renderFeatures(d) { if (!d.features) return ''; return d.features.split('\n').filter(Boolean).map(f => `- ${f.replace(/^[-*✅🔹•]\s*/u,'')}`).join('\n')+'\n'; }
function renderFeaturesWithIcons(d) {
  if (!d.features) return '';
  const icons = ['🚀','⚡','🎯','🔒','🎨','📱','🔧','✨','💡','🌐','📊','🔥'];
  return d.features.split('\n').filter(Boolean).map((f,i) => `${icons[i%icons.length]} **${f.replace(/^[-*✅🔹•]\s*/u,'').trim()}**`).join('  \n')+'\n';
}
function renderFeaturesTable(d) {
  if (!d.features) return '';
  const icons = ['🚀','⚡','🎯','🔒','🎨','📱','🔧','✨','💡','🌐'];
  const lines = d.features.split('\n').filter(Boolean);
  const rows = [];
  for (let i=0;i<lines.length;i+=2) {
    const l = lines[i]?`${icons[i%icons.length]} **${lines[i].replace(/^[-*✅🔹•]\s*/u,'').trim()}**`:'';
    const r = lines[i+1]?`${icons[(i+1)%icons.length]} **${lines[i+1].replace(/^[-*✅🔹•]\s*/u,'').trim()}**`:'';
    rows.push(`| ${l} | ${r} |`);
  }
  return `| | |\n|---|---|\n${rows.join('\n')}\n`;
}
function renderTechTable(d) {
  if (!d.techStack) return '';
  const techs = d.techStack.split(',').map(t=>t.trim()).filter(Boolean);
  let md = '| Technology | Purpose |\n|:---:|:---|\n';
  techs.forEach(tech => { const logo = encodeURIComponent(tech.toLowerCase().replace(/\.js$/,'').replace(/\s+/g,'')); md += `| <img src="https://img.shields.io/badge/${shieldEncode(tech)}-333?style=flat-square&logo=${logo}&logoColor=white" alt="${tech}" /> | ${tech} |\n`; });
  return md+'\n';
}
function renderTechBadgeRowMd(d) { if (!d.techStack) return ''; return generateTechBadges(d).md.join(' ')+'\n'; }
function renderTechBadgeRowHtml(d) { if (!d.techStack) return ''; return generateTechBadges(d).html.join('\n  ')+'\n'; }
function renderTechList(d) { if (!d.techStack) return ''; return d.techStack.split(',').map(t=>t.trim()).filter(Boolean).map(t=>`- **${t}**`).join('\n')+'\n'; }
function renderEnvVars(d) {
  if (!d.envVars) return '';
  let md = '| Variable | Description | Required |\n|:---|:---|:---:|\n';
  d.envVars.split('\n').filter(Boolean).forEach(line => { const [key,...desc] = line.split('='); md += `| \`${(key||line).trim()}\` | ${desc.join('=').trim()||'Configure as needed'} | ✅ |\n`; });
  return md+'\n';
}
function renderRoadmap(d) { if (!d.roadmap) return ''; return d.roadmap.split('\n').filter(Boolean).map(item => `- [ ] ${item.replace(/^[-*•]\s*/,'')}`).join('\n')+'\n'; }
function renderFaq(d) {
  if (!d.faq) return '';
  const lines = d.faq.split('\n').filter(Boolean);
  let md='', inQ=false;
  lines.forEach(line => {
    if (/^[Qq]:/.test(line)) {
      // Close any previously open question without an answer
      if (inQ) { md += 'Please refer to the documentation for details.\n\n</details>\n\n'; }
      md += `<details>\n<summary><b>${line.replace(/^[Qq]:\s*/,'').trim()}</b></summary>\n\n`;
      inQ=true;
    }
    else if (/^[Aa]:/.test(line)) { md += `${line.replace(/^[Aa]:\s*/,'').trim()}\n\n</details>\n\n`; inQ=false; }
    else if (inQ) { md += `${line.trim()}\n`; }
    else { md += `<details>\n<summary><b>${line.trim()}</b></summary>\n\nPlease refer to the documentation for details.\n\n</details>\n\n`; }
  });
  if (inQ) md += 'Please refer to the documentation for details.\n\n</details>\n\n';
  return md;
}
function renderChangelog(d) { return d.changelog ? d.changelog+'\n\n' : ''; }
function renderAcknowledgments(d) { if (!d.acknowledgments) return ''; return d.acknowledgments.split('\n').filter(Boolean).map(a=>`- ${a.replace(/^[-*•]\s*/,'')}`).join('\n')+'\n'; }
function renderDemoLinks(d) {
  if (!d.demoUrl && !d.screenshots) return '';
  let md = '';
  if (d.demoUrl) md += `<p align="center">\n  <a href="${d.demoUrl}">\n    <img src="https://img.shields.io/badge/🔗_Live_Demo-Click_Here-2ea44f?style=for-the-badge" alt="Live Demo" />\n  </a>\n</p>\n\n`;
  if (d.screenshots) md += d.screenshots+'\n';
  return md+'\n';
}
function renderApiReference(d) {
  if (!d.apiReference) return '';
  const cols = {'GET':'61affe','POST':'49cc90','PUT':'fca130','PATCH':'50e3c2','DELETE':'f93e3e','HEAD':'9012fe','OPTIONS':'0d5aa7'};
  let md = '| Method | Endpoint | Description |\n|:---:|:---|:---|\n';
  d.apiReference.split('\n').filter(Boolean).forEach(line => {
    const p = line.split(/\s+/); const m = (p[0]||'GET').toUpperCase(); const e = p[1]||'/'; const desc = p.slice(2).join(' ')||'-';
    md += `| <img src="https://img.shields.io/badge/${m}-${cols[m]||'333'}?style=flat-square&logoColor=white" alt="${m}" /> | \`${e}\` | ${desc} |\n`;
  });
  return md+'\n';
}
function renderCustomSections(d) {
  if (!d.customSections || d.customSections.length===0) return '';
  let md=''; d.customSections.forEach(s => { if (s.title && s.content) md += `## ${s.title}\n\n${s.content}\n\n`; }); return md;
}
function renderInstallation(d) { return d.installation ? `\`\`\`bash\n${d.installation}\n\`\`\`\n\n` : ''; }
function renderContributingSteps(d) {
  let md = `1. **Fork** the repository\n2. **Clone** your fork: \`git clone https://github.com/your-username/${d.projectName?.toLowerCase().replace(/\s+/g,'-')||'project'}.git\`\n3. **Create** a branch: \`git checkout -b feature/amazing-feature\`\n4. **Commit** changes: \`git commit -m 'Add amazing feature'\`\n5. **Push** to branch: \`git push origin feature/amazing-feature\`\n6. **Submit** a Pull Request\n\n`;
  if (d.contributing) md += `${d.contributing}\n\n`;
  return md;
}
function divider() { return `\n<br>\n\n<div align="center">\n  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">\n</div>\n\n<br>\n\n`; }
function buildTocAnchors(label) { return label.toLowerCase().replace(/[^\w\s-]/gu,'').replace(/\s+/g,'-').replace(/^-+|-+$/g,'').replace(/-{2,}/g, '-'); }

/* ═══ Minimal ═══ */
export function minimalTemplate(data) {
  let md = `# ${data.projectName||'Project Name'}\n\n`;
  if (data.description) md += `> ${data.description}\n\n`;
  const b = generateBadges(data), tb = generateTechBadges(data);
  if (b.md.length>0||tb.md.length>0) md += [...b.md,...tb.md].join(' ')+'\n\n';
  if (data.demoUrl) md += `**[→ Live Demo](${data.demoUrl})**\n\n`;
  md += `---\n\n`;
  if (data.features) md += `## Features\n\n${renderFeatures(data)}\n`;
  if (data.techStack) md += `## Built With\n\n${renderTechList(data)}\n`;
  if (data.installation) md += `## Quick Start\n\n${renderInstallation(data)}`;
  if (data.usage) md += `## Usage\n\n\`\`\`bash\n${data.usage}\n\`\`\`\n\n`;
  if (data.envVars) md += `## Environment Variables\n\n${renderEnvVars(data)}`;
  if (data.apiReference) md += `## API\n\n${renderApiReference(data)}`;
  if (data.roadmap) md += `## Roadmap\n\n${renderRoadmap(data)}\n`;
  if (data.contributing) md += `## Contributing\n\n${data.contributing}\n\n`;
  if (data.license) md += `## License\n\n[${data.license}](LICENSE)\n\n`;
  md += renderCustomSections(data);
  if (data.author) md += `---\n\nBuilt by **[@${data.author}](https://github.com/${data.author})**\n`;
  return md;
}

/* ═══ Standard ═══ */
export function standardTemplate(data) {
  let md = '';
  const b = generateBadges(data), tb = generateTechBadges(data);
  md += `<div align="center">\n\n# 📋 ${data.projectName||'Project Name'}\n\n`;
  if (data.description) md += `**${data.description}**\n\n`;
  if (b.html.length>0) md += `<p align="center">\n  ${b.html.join('\n  ')}\n</p>\n\n`;
  if (tb.html.length>0) md += `<p align="center">\n  ${tb.html.join('\n  ')}\n</p>\n\n`;
  const ql = []; if (data.demoUrl) ql.push(`<a href="${data.demoUrl}">Live Demo</a>`); ql.push(`<a href="../../issues">Report Bug</a>`,`<a href="../../issues">Request Feature</a>`);
  md += `<p align="center">${ql.join(' · ')}</p>\n\n</div>\n\n---\n\n`;
  if (data.description) md += `## 📖 About\n\n${data.description}\n\n`;
  if (data.demoUrl||data.screenshots) md += `## 📸 Screenshots\n\n${renderDemoLinks(data)}`;
  if (data.features) md += `## ✨ Features\n\n${renderFeaturesWithIcons(data)}\n`;
  if (data.techStack) md += `## 🛠 Tech Stack\n\n${renderTechBadgeRowMd(data)}\n`;
  md += `## 🚀 Getting Started\n\n### Prerequisites\n\n${data.prerequisites||'- [Node.js](https://nodejs.org/) (v16+)\n- npm or yarn'}\n\n`;
  if (data.installation) md += `### Installation\n\n${renderInstallation(data)}`;
  if (data.envVars) md += `## ⚙️ Environment Variables\n\nCreate a \`.env\` file in the root directory:\n\n\`\`\`env\n${data.envVars}\n\`\`\`\n\n${renderEnvVars(data)}`;
  if (data.usage) md += `## 💻 Usage\n\n\`\`\`bash\n${data.usage}\n\`\`\`\n\n`;
  if (data.apiReference) md += `## 📡 API Reference\n\n${renderApiReference(data)}`;
  if (data.roadmap) md += `## 🗺️ Roadmap\n\n${renderRoadmap(data)}\nSee the [open issues](../../issues) for a full list of proposed features.\n\n`;
  if (data.faq) md += `## ❓ FAQ\n\n${renderFaq(data)}`;
  if (data.contributing) md += `## 🤝 Contributing\n\nContributions are welcome!\n\n${renderContributingSteps(data)}`;
  if (data.changelog) md += `## 📝 Changelog\n\n${renderChangelog(data)}`;
  if (data.license) md += `## 📄 License\n\nDistributed under the **${data.license}** License. See [\`LICENSE\`](LICENSE) for more information.\n\n`;
  if (data.author) { md += `## 👤 Author\n\n**${data.author}**\n\n[![GitHub](https://img.shields.io/badge/GitHub-@${data.author}-181717?style=flat-square&logo=github)](https://github.com/${data.author})`; if (data.authorTwitter) md += `\n[![Twitter](https://img.shields.io/badge/Twitter-@${data.authorTwitter}-1DA1F2?style=flat-square&logo=twitter&logoColor=white)](https://twitter.com/${data.authorTwitter})`; if (data.authorWebsite) md += `\n[![Website](https://img.shields.io/badge/Website-${encodeURIComponent(data.authorWebsite.replace(/https?:\/\//,''))}-4285F4?style=flat-square&logo=google-chrome&logoColor=white)](${data.authorWebsite})`; md += '\n\n'; }
  if (data.acknowledgments) md += `## 🙏 Acknowledgments\n\n${renderAcknowledgments(data)}\n`;
  md += renderCustomSections(data);
  md += `---\n\n<div align="center">\n\n⭐ Star this repo if you find it helpful!\n\n</div>\n`;
  return md;
}

/* ═══ Open Source ═══ */
export function openSourceTemplate(data) {
  let md = '';
  const b = generateBadges(data), tb = generateTechBadges(data);
  const slug = data.projectName?.toLowerCase().replace(/\s+/g,'-')||'project';
  md += `<div align="center">\n\n# ✨ ${data.projectName||'Project Name'}\n\n`;
  if (data.description) md += `<p align="center">\n  <em>${data.description}</em>\n</p>\n\n`;
  if (b.html.length>0) md += `<p align="center">\n  ${b.html.join('\n  ')}\n</p>\n\n`;
  if (tb.html.length>0) md += `<p align="center">\n  ${tb.html.join('\n  ')}\n</p>\n\n`;
  md += `<p align="center">\n`;
  if (data.demoUrl) md += `  <a href="${data.demoUrl}"><strong>🔗 Live Demo</strong></a> ·\n`;
  md += `  <a href="../../issues/new?labels=bug"><strong>🐛 Report Bug</strong></a> ·\n  <a href="../../issues/new?labels=enhancement"><strong>💡 Request Feature</strong></a>\n</p>\n\n</div>\n\n`;
  md += divider();
  const toc = []; if (data.description) toc.push('📖 About'); if (data.demoUrl||data.screenshots) toc.push('📸 Demo & Screenshots'); if (data.features) toc.push('✨ Features'); if (data.techStack) toc.push('🏗️ Tech Stack'); toc.push('🚀 Getting Started'); if (data.envVars) toc.push('⚙️ Environment Variables'); if (data.usage) toc.push('💻 Usage'); if (data.apiReference) toc.push('📡 API Reference'); if (data.roadmap) toc.push('🗺️ Roadmap'); if (data.faq) toc.push('❓ FAQ'); toc.push('🤝 Contributing'); if (data.changelog) toc.push('📝 Changelog'); if (data.license) toc.push('📄 License'); if (data.author) toc.push('👤 Author'); if (data.acknowledgments) toc.push('🙏 Acknowledgments');
  md += `## 📋 Table of Contents\n\n<details>\n<summary>Click to expand</summary>\n\n`;
  toc.forEach(item => { md += `- [${item}](#${buildTocAnchors(item)})\n`; });
  md += `\n</details>\n\n`;
  if (data.description) { md += `## 📖 About\n\n${data.description}\n\n`; if (data.author) md += `> **Built with ❤️ by [@${data.author}](https://github.com/${data.author})**\n\n`; }
  if (data.demoUrl||data.screenshots) md += `## 📸 Demo & Screenshots\n\n${renderDemoLinks(data)}`;
  if (data.features) md += `## ✨ Features\n\n${renderFeaturesTable(data)}\n`;
  if (data.techStack) md += `## 🏗️ Tech Stack\n\n<div align="center">\n\n<p>\n  ${renderTechBadgeRowHtml(data)}</p>\n\n</div>\n\n`;
  md += `## 🚀 Getting Started\n\n### Prerequisites\n\n${data.prerequisites||'- [Node.js](https://nodejs.org/) (v16+)\n- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)'}\n\n`;
  if (data.installation) md += `### 📥 Installation\n\n${renderInstallation(data)}`;
  if (data.envVars) md += `## ⚙️ Environment Variables\n\n> **Note:** Create a \`.env\` file in the root directory based on \`.env.example\`\n\n\`\`\`env\n${data.envVars}\n\`\`\`\n\n${renderEnvVars(data)}`;
  if (data.usage) md += `## 💻 Usage\n\n\`\`\`bash\n${data.usage}\n\`\`\`\n\n`;
  if (data.apiReference) md += `## 📡 API Reference\n\n${renderApiReference(data)}`;
  if (data.roadmap) md += `## 🗺️ Roadmap\n\n${renderRoadmap(data)}\nSee the [open issues](../../issues) for a full list of proposed features and known issues.\n\n`;
  if (data.faq) md += `## ❓ FAQ\n\n${renderFaq(data)}`;
  md += `## 🤝 Contributing\n\nContributions are what make the open source community such an amazing place to learn, inspire, and create.\nAny contributions you make are **greatly appreciated**.\n\n${renderContributingSteps(data)}`;
  if (data.changelog) md += `## 📝 Changelog\n\n${renderChangelog(data)}`;
  if (data.license) md += `## 📄 License\n\nThis project is licensed under the **${data.license}** License — see the [\`LICENSE\`](LICENSE) file for details.\n\n`;
  if (data.author) { md += `## 👤 Author\n\n<table>\n  <tr>\n    <td align="center">\n      <a href="https://github.com/${data.author}">\n        <img src="https://github.com/${data.author}.png" width="100px;" alt="${data.author}"/><br />\n        <sub><b>${data.author}</b></sub>\n      </a><br />\n`; const al = [`<a href="https://github.com/${data.author}" title="GitHub">💻</a>`]; if (data.authorTwitter) al.push(`<a href="https://twitter.com/${data.authorTwitter}" title="Twitter">🐦</a>`); if (data.authorWebsite) al.push(`<a href="${data.authorWebsite}" title="Website">🌐</a>`); md += `      ${al.join(' ')}\n    </td>\n  </tr>\n</table>\n\n`; }
  if (data.acknowledgments) md += `## 🙏 Acknowledgments\n\n${renderAcknowledgments(data)}\n`;
  md += renderCustomSections(data);
  md += divider();
  md += `<div align="center">\n\n**If you found this project helpful, please consider giving it a ⭐**\n\n[![Star History](https://img.shields.io/github/stars/${data.author||'username'}/${slug}?style=social)](../../stargazers)\n\nMade with ❤️ and lots of ☕\n\n</div>\n`;
  return md;
}

/* ═══ Enterprise ═══ */
export function enterpriseTemplate(data) {
  const slug = data.projectName?.toLowerCase().replace(/\s+/g,'-')||'project';
  let md = '';
  const b = generateBadges(data), tb = generateTechBadges(data);
  md += `<div align="center">\n\n<br>\n\n# ${data.projectName||'Project Name'}\n\n`;
  if (data.description) md += `### ${data.description}\n\n`;
  if (b.html.length>0) md += `<p>\n  ${b.html.join('\n  ')}\n</p>\n\n`;
  if (tb.html.length>0) md += `<p>\n  ${tb.html.join('\n  ')}\n</p>\n\n`;
  md += `<p>\n  <a href="#-getting-started"><strong>Getting Started</strong></a> · \n  <a href="#-documentation"><strong>Documentation</strong></a> · \n  <a href="#-contributing"><strong>Contributing</strong></a>`;
  if (data.roadmap) md += ` · \n  <a href="#️-roadmap"><strong>Roadmap</strong></a>`;
  if (data.apiReference) md += ` · \n  <a href="#-api-reference"><strong>API</strong></a>`;
  md += `\n</p>\n\n<br>\n\n</div>\n\n---\n\n`;
  md += `## 📖 About\n\n${data.description||'Add a detailed project description.'}\n\n`;
  if (data.features) { const fl = data.features.split('\n').filter(Boolean); if (fl.length>0) { md += `> **Key Highlights:**\n`; fl.slice(0,3).forEach(f => { md += `> - ${f.replace(/^[-*✅🔹•]\s*/u,'').trim()}\n`; }); md += '\n'; } }
  if (data.demoUrl||data.screenshots) md += `## 📸 Demo & Screenshots\n\n${renderDemoLinks(data)}`;
  if (data.features) md += `## ✨ Key Features\n\n${renderFeaturesTable(data)}\n`;
  if (data.techStack) md += `## 🏗️ Architecture & Tech Stack\n\n${renderTechTable(data)}`;
  md += `## 🚀 Getting Started\n\n### System Requirements\n\n${data.prerequisites||'| Requirement | Version |\\n|:---|:---|\\n| Node.js | `>= 16.x` |\\n| npm / yarn | `>= 8.x` / `>= 1.22.x` |'}\n\n`;
  if (data.installation) md += `### 📥 Installation\n\n\`\`\`bash\n# Clone the repository\ngit clone https://github.com/${data.author||'username'}/${slug}.git\n\n# Navigate to project directory\ncd ${slug}\n\n# Install dependencies\n${data.installation}\n\`\`\`\n\n`;
  if (data.envVars) md += `### ⚙️ Environment Configuration\n\nCopy the example env file and configure:\n\n\`\`\`bash\ncp .env.example .env\n\`\`\`\n\n\`\`\`env\n${data.envVars}\n\`\`\`\n\n${renderEnvVars(data)}`;
  if (data.usage) md += `### ▶️ Running the Application\n\n\`\`\`bash\n${data.usage}\n\`\`\`\n\n`;
  md += `## 📚 Documentation\n\n| Resource | Link |\n|:---|:---|\n| 📖 Wiki | [Project Wiki](../../wiki) |\n| 📁 Docs Directory | [\`/docs\`](./docs) |\n`;
  if (data.apiReference) md += `| 📡 API Reference | [API Docs](#-api-reference) |\n`;
  if (data.demoUrl) md += `| 🔗 Live Demo | [${data.demoUrl}](${data.demoUrl}) |\n`;
  md += '\n';
  if (data.apiReference) md += `## 📡 API Reference\n\n${renderApiReference(data)}`;
  if (data.roadmap) md += `## 🗺️ Roadmap\n\n${renderRoadmap(data)}\n> See the [open issues](../../issues) for a full list of proposed features and known bugs.\n\n`;
  if (data.faq) md += `## ❓ FAQ\n\n${renderFaq(data)}`;
  md += `## 🤝 Contributing\n\nWe welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a PR.\n\n${renderContributingSteps(data)}`;
  if (data.changelog) md += `## 📝 Changelog\n\nSee [CHANGELOG.md](CHANGELOG.md) for detailed release notes.\n\n${renderChangelog(data)}`;
  if (data.license) md += `## 📄 License\n\nDistributed under the **${data.license}** License. See [\`LICENSE\`](LICENSE) for more information.\n\n`;
  if (data.author) md += `## 👥 Team & Maintainers\n\n<table>\n  <tr>\n    <td align="center">\n      <a href="https://github.com/${data.author}">\n        <img src="https://github.com/${data.author}.png" width="80px;" alt="${data.author}" style="border-radius:50%"/><br />\n        <sub><b>${data.author}</b></sub>\n      </a><br />\n      <sub>Lead Developer</sub>\n    </td>\n  </tr>\n</table>\n\n`;
  if (data.acknowledgments) md += `## 🙏 Acknowledgments\n\n${renderAcknowledgments(data)}\n`;
  md += renderCustomSections(data);
  md += `---\n\n<div align="center">\n\n<sub>Built with precision by ${data.author?`<a href="https://github.com/${data.author}">@${data.author}</a>`:'the team'}</sub>\n\n[![Star this repo](https://img.shields.io/badge/⭐_Star_This_Repo-FFD700?style=for-the-badge)](../../stargazers)\n\n</div>\n`;
  return md;
}

/* ═══ API Docs ═══ */
export function apiDocsTemplate(data) {
  let md = '';
  const b = generateBadges(data), tb = generateTechBadges(data);
  md += `<div align="center">\n\n# 📡 ${data.projectName||'API Name'}\n\n`;
  if (data.description) md += `**${data.description}**\n\n`;
  if (b.html.length>0||tb.html.length>0) md += `<p align="center">\n  ${[...b.html,...tb.html].join('\n  ')}\n</p>\n\n`;
  md += `</div>\n\n---\n\n`;
  if (data.demoUrl) md += `## 🌐 Base URL\n\n\`\`\`\n${data.demoUrl}\n\`\`\`\n\n`;
  md += `## 🔐 Authentication\n\nAll API requests require authentication. Include your API key in the request headers:\n\n\`\`\`http\nAuthorization: Bearer YOUR_API_KEY\nContent-Type: application/json\n\`\`\`\n\n> **⚠️ Important:** Never expose your API key in client-side code or public repositories.\n\n`;
  if (data.installation) md += `## ⚡ Quick Start\n\n\`\`\`bash\n${data.installation}\n\`\`\`\n\n`;
  if (data.envVars) md += `## ⚙️ Configuration\n\n\`\`\`env\n${data.envVars}\n\`\`\`\n\n${renderEnvVars(data)}`;
  if (data.apiReference) md += `## 📡 Endpoints\n\n${renderApiReference(data)}`;
  if (data.usage) md += `## 💡 Usage Examples\n\n### cURL\n\n\`\`\`bash\n${data.usage}\n\`\`\`\n\n`;
  if (data.features) md += `## ✨ Features\n\n${renderFeaturesWithIcons(data)}\n`;
  if (data.techStack) md += `## 🛠️ Built With\n\n<div align="center">\n<p>\n  ${renderTechBadgeRowHtml(data)}</p>\n</div>\n\n`;
  md += `## 📊 Rate Limiting\n\n| Plan | Requests/min | Requests/day | Burst |\n|:---:|:---:|:---:|:---:|\n| 🆓 Free | 60 | 1,000 | 10 |\n| 💎 Pro | 300 | 10,000 | 50 |\n| 🏢 Enterprise | Unlimited | Unlimited | Unlimited |\n\n`;
  md += `## 🚨 Error Handling\n\nAll errors follow a consistent format:\n\n\`\`\`json\n{\n  "error": {\n    "code": 400,\n    "message": "Invalid request parameters",\n    "details": "The 'email' field is required"\n  }\n}\n\`\`\`\n\n### Status Codes\n\n| Code | Status | Description |\n|:---:|:---|:---|\n| \`200\` | ✅ OK | Request successful |\n| \`201\` | ✅ Created | Resource created successfully |\n| \`400\` | ⚠️ Bad Request | Invalid parameters |\n| \`401\` | 🔒 Unauthorized | Invalid or missing API key |\n| \`403\` | 🚫 Forbidden | Insufficient permissions |\n| \`404\` | ❓ Not Found | Resource doesn't exist |\n| \`429\` | ⏳ Too Many Requests | Rate limit exceeded |\n| \`500\` | 💥 Server Error | Internal server error |\n\n`;
  if (data.faq) md += `## ❓ FAQ\n\n${renderFaq(data)}`;
  if (data.changelog) md += `## 📝 Changelog\n\n${renderChangelog(data)}`;
  if (data.roadmap) md += `## 🗺️ Roadmap\n\n${renderRoadmap(data)}\n`;
  if (data.license) md += `## 📄 License\n\n[${data.license}](LICENSE)\n\n`;
  md += renderCustomSections(data);
  md += `---\n\n<div align="center">\n\n`;
  if (data.author) md += `Maintained by **[@${data.author}](https://github.com/${data.author})**\n\n`;
  md += `[![API Status](https://img.shields.io/badge/API_Status-Operational-2ea043?style=for-the-badge)](${data.demoUrl||'#'})\n\n</div>\n`;
  return md;
}

/* ═══ Library ═══ */
export function libraryTemplate(data) {
  const slug = data.projectName?.toLowerCase().replace(/\s+/g,'-')||'package';
  let md = '';
  const b = generateBadges(data), tb = generateTechBadges(data);
  md += `<div align="center">\n\n# 📦 ${data.projectName||'Package Name'}\n\n`;
  if (data.description) md += `<p align="center">\n  <em>${data.description}</em>\n</p>\n\n`;
  if (b.html.length>0) md += `<p align="center">\n  ${b.html.join('\n  ')}\n</p>\n\n`;
  md += `<p align="center">\n  <a href="https://www.npmjs.com/package/${slug}"><img src="https://img.shields.io/npm/v/${slug}?style=flat-square&color=cb3837&label=npm" alt="npm version" /></a>\n  <a href="https://www.npmjs.com/package/${slug}"><img src="https://img.shields.io/npm/dm/${slug}?style=flat-square&color=blue&label=downloads" alt="npm downloads" /></a>\n  <a href="https://bundlephobia.com/package/${slug}"><img src="https://img.shields.io/bundlephobia/minzip/${slug}?style=flat-square&label=size" alt="bundle size" /></a>\n</p>\n\n`;
  if (tb.html.length>0) md += `<p align="center">\n  ${tb.html.join('\n  ')}\n</p>\n\n`;
  md += `</div>\n\n---\n\n`;
  md += `## 📥 Installation\n\n\`\`\`bash\n# npm\nnpm install ${slug}\n\n# yarn\nyarn add ${slug}\n\n# pnpm\npnpm add ${slug}\n\`\`\`\n\n`;
  if (data.installation) md += `### Additional Setup\n\n\`\`\`bash\n${data.installation}\n\`\`\`\n\n`;
  if (data.usage) md += `## 🚀 Quick Start\n\n\`\`\`javascript\n${data.usage}\n\`\`\`\n\n`;
  if (data.features) md += `## ✨ Features\n\n${renderFeaturesTable(data)}\n`;
  if (data.apiReference) md += `## 📖 API Reference\n\n${renderApiReference(data)}`;
  if (data.envVars) md += `## ⚙️ Configuration\n\n${renderEnvVars(data)}`;
  if (data.techStack) md += `## 🛠️ Built With\n\n<div align="center">\n<p>\n  ${renderTechBadgeRowHtml(data)}</p>\n</div>\n\n`;
  if (data.faq) md += `## ❓ FAQ\n\n${renderFaq(data)}`;
  if (data.contributing) md += `## 🤝 Contributing\n\n${renderContributingSteps(data)}`;
  if (data.changelog) md += `## 📝 Changelog\n\n${renderChangelog(data)}`;
  if (data.roadmap) md += `## 🗺️ Roadmap\n\n${renderRoadmap(data)}\n`;
  if (data.license) md += `## 📄 License\n\n[${data.license}](LICENSE)\n\n`;
  md += renderCustomSections(data);
  if (data.acknowledgments) md += `## 🙏 Acknowledgments\n\n${renderAcknowledgments(data)}\n`;
  md += `---\n\n<div align="center">\n\n`;
  if (data.author) md += `Made with ❤️ by **[@${data.author}](https://github.com/${data.author})**\n\n`;
  md += `If this package helps you, consider giving it a ⭐\n\n</div>\n`;
  return md;
}

/* ═══ Profile ═══ */
export function profileTemplate(data) {
  const user = data.author||'username';
  let md = '';
  const tb = generateTechBadges(data);
  md += `<div align="center">\n\n<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=28&duration=3000&pause=1000&color=2D79FF&center=true&vCenter=true&random=false&width=500&lines=${encodeURIComponent(`Hi 👋, I'm ${data.projectName||user}`)};${encodeURIComponent(data.description||'A passionate developer')}" alt="Typing SVG" />\n\n`;
  const sb = [`[![GitHub followers](https://img.shields.io/github/followers/${user}?style=for-the-badge&logo=github&color=181717)](https://github.com/${user})`];
  if (data.authorTwitter) sb.push(`[![Twitter](https://img.shields.io/badge/@${data.authorTwitter}-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/${data.authorTwitter})`);
  if (data.authorWebsite) sb.push(`[![Portfolio](https://img.shields.io/badge/Portfolio-000?style=for-the-badge&logo=vercel&logoColor=white)](${data.authorWebsite})`);
  sb.push(`![Profile Views](https://komarev.com/ghpvc/?username=${user}&color=blueviolet&style=for-the-badge&label=PROFILE+VIEWS)`);
  md += sb.join(' ')+'\n\n</div>\n\n';
  md += `<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">\n\n`;
  md += `## 🙋‍♂️ About Me\n\n`;
  if (data.description) md += `${data.description}\n\n`;
  if (data.features) { data.features.split('\n').filter(Boolean).forEach(l => { md += `- ${l.replace(/^[-*✅🔹•]\s*/u,'').trim()}\n`; }); md += '\n'; }
  if (data.demoUrl) md += `- 🔗 **Portfolio:** [${data.demoUrl.replace(/https?:\/\//,'')}](${data.demoUrl})\n\n`;
  if (data.techStack) md += `## 🛠️ Tech Stack\n\n<div align="center">\n<p>\n  ${tb.html.join('\n  ')}\n</p>\n</div>\n\n`;
  md += `## 📊 GitHub Stats\n\n<div align="center">\n\n<img src="https://github-readme-stats.vercel.app/api?username=${user}&show_icons=true&theme=tokyonight&hide_border=true&count_private=true" alt="GitHub Stats" height="180" />\n<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${user}&layout=compact&theme=tokyonight&hide_border=true&langs_count=8" alt="Top Languages" height="180" />\n\n</div>\n\n<div align="center">\n\n<img src="https://streak-stats.demolab.com/?user=${user}&theme=tokyonight&hide_border=true" alt="GitHub Streak" />\n\n</div>\n\n`;
  md += `## 🏆 GitHub Trophies\n\n<div align="center">\n\n<img src="https://github-profile-trophy.vercel.app/?username=${user}&theme=tokyonight&no-frame=true&no-bg=true&row=1&column=7" alt="Trophies" />\n\n</div>\n\n`;
  md += `## 📈 Contribution Graph\n\n<img src="https://github-readme-activity-graph.vercel.app/graph?username=${user}&theme=tokyo-night&hide_border=true" alt="Contribution Graph" width="100%" />\n\n`;
  if (data.roadmap) md += `## 🗺️ Current Focus\n\n${renderRoadmap(data)}\n`;
  if (data.usage) { md += `## ✍️ Latest Blog Posts\n\n`; data.usage.split('\n').filter(Boolean).forEach(p => { md += `- ${p}\n`; }); md += `\n<!-- BLOG-POST-LIST:START -->\n<!-- BLOG-POST-LIST:END -->\n\n`; }
  md += `## 😄 Random Dev Quote\n\n<div align="center">\n\n<img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=tokyonight" alt="Random Dev Quote" />\n\n</div>\n\n`;
  if (data.acknowledgments) md += `## 💖 Support\n\n${renderAcknowledgments(data)}\n`;
  md += renderCustomSections(data);
  md += `---\n\n<div align="center">\n\n**Thanks for visiting! ⭐ Star my repos if you find them interesting!**\n\n<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=80&section=footer" width="100%" />\n\n</div>\n`;
  return md;
}

/* ═══ Hackathon ═══ */
export function hackathonTemplate(data) {
  let md = '';
  const b = generateBadges(data), tb = generateTechBadges(data);
  md += `<div align="center">\n\n# 🏆 ${data.projectName||'Project Name'}\n\n`;
  if (data.description) md += `### _${data.description}_\n\n`;
  if (b.html.length>0||tb.html.length>0) md += `<p align="center">\n  ${[...b.html,...tb.html].join('\n  ')}\n</p>\n\n`;
  const links = []; if (data.demoUrl) links.push(`[🔗 Live Demo](${data.demoUrl})`); links.push(`[📹 Demo Video](#-demo)`,`[📊 Slides](#-presentation)`);
  md += links.join(' • ')+'\n\n</div>\n\n---\n\n';
  md += `## 💡 Problem Statement\n\n${data.description||'Describe the problem your project solves...'}\n\n`;
  if (data.features) md += `## 🚀 Our Solution\n\n${renderFeaturesWithIcons(data)}\n`;
  md += `## 🎬 Demo\n\n`;
  if (data.demoUrl) md += `🔗 **Live Demo:** [${data.demoUrl}](${data.demoUrl})\n\n`;
  md += data.screenshots ? data.screenshots+'\n\n' : `> Add screenshots, GIFs, or a video link of your project in action!\n\n`;
  if (data.techStack) md += `## 🛠️ Built With\n\n<div align="center">\n<p>\n  ${tb.html.join('\n  ')}\n</p>\n</div>\n\n`;
  md += `## ⚡ Quick Setup\n\n`;
  if (data.prerequisites) md += `### Prerequisites\n\n${data.prerequisites}\n\n`;
  if (data.installation) md += `\`\`\`bash\n# Clone & install\ngit clone https://github.com/${data.author||'team'}/${data.projectName?.toLowerCase().replace(/\s+/g,'-')||'project'}.git\ncd ${data.projectName?.toLowerCase().replace(/\s+/g,'-')||'project'}\n${data.installation}\n\`\`\`\n\n`;
  if (data.envVars) md += `\`\`\`env\n${data.envVars}\n\`\`\`\n\n`;
  if (data.usage) md += `\`\`\`bash\n${data.usage}\n\`\`\`\n\n`;
  if (data.apiReference) md += `## 📡 API Endpoints\n\n${renderApiReference(data)}`;
  md += `## 🏗️ Architecture\n\n> _Add your system architecture diagram here_\n\n\`\`\`\n┌─────────────┐     ┌─────────────┐     ┌─────────────┐\n│   Frontend   │────▶│   Backend    │────▶│  Database    │\n│  (React)     │◀────│  (Node.js)   │◀────│  (MongoDB)   │\n└─────────────┘     └─────────────┘     └─────────────┘\n\`\`\`\n\n`;
  if (data.roadmap) md += `## 🔮 What's Next\n\n${renderRoadmap(data)}\n`;
  md += `## 👥 Team\n\n`;
  if (data.author) md += `| Name | Role | GitHub |\n|:---|:---|:---|\n| ${data.author} | Lead Developer | [@${data.author}](https://github.com/${data.author}) |\n\n`;
  if (data.license) md += `## 📄 License\n\n[${data.license}](LICENSE)\n\n`;
  md += renderCustomSections(data);
  md += `---\n\n<div align="center">\n\n**Built with ❤️ at [Hackathon Name]**\n\n⭐ Star this repo if you like our project!\n\n</div>\n`;
  return md;
}

/* ═══ Template registry ═══ */
export const TEMPLATES = {
  minimal:    { name: 'Minimal',     emoji: '📄', description: 'Elegant & clean for small projects',                fn: minimalTemplate },
  standard:   { name: 'Standard',    emoji: '📘', description: 'Professional balanced README',                      fn: standardTemplate },
  openSource: { name: 'Open Source', emoji: '🌍', description: 'Premium community-focused with visual flair',       fn: openSourceTemplate },
  enterprise: { name: 'Enterprise',  emoji: '🏢', description: 'Comprehensive enterprise-grade documentation',      fn: enterpriseTemplate },
  apiDocs:    { name: 'API Docs',    emoji: '📡', description: 'Complete API documentation with status codes',       fn: apiDocsTemplate },
  library:    { name: 'Library',     emoji: '📦', description: 'npm/pip package with install badges & size info',    fn: libraryTemplate },
  profile:    { name: 'Profile',     emoji: '👤', description: 'GitHub profile README with stats & widgets',         fn: profileTemplate },
  hackathon:  { name: 'Hackathon',   emoji: '🏆', description: 'Quick project submission with problem/solution',     fn: hackathonTemplate },
};
