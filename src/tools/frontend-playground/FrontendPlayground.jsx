import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Copy, Check, Trash2, Download, Upload,
  Maximize2, RotateCcw, Eye, EyeOff,
  Smartphone, Monitor, Tablet, Sparkles,
  Palette, Braces, Code,
  Zap, ExternalLink, X, Columns, Rows,
  ChevronDown, AlertTriangle, Info, FileCode,
  Terminal, Eraser, SquareCode, WrapText, AlignLeft,
  Keyboard, Search, Replace, Undo2, Redo2,
  ZoomIn, ZoomOut, Sun, Moon, Library,
  Gauge, Save, BookOpen,
} from 'lucide-react';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';
import useLocalStorage from '../../hooks/useLocalStorage';
import CodeMirrorEditor from './CodeMirrorEditor';
import './FrontendPlayground.css';



/* ═══════════════════════════════════════════════════════════
   CDN LIBRARIES
   ═══════════════════════════════════════════════════════════ */
const CDN_LIBRARIES = [
  { name: 'Tailwind CSS', type: 'css', url: 'https://cdn.jsdelivr.net/npm/tailwindcss@3/dist/tailwind.min.css', icon: '🌊' },
  { name: 'Bootstrap 5', type: 'css', url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css', icon: '🅱️' },
  { name: 'Animate.css', type: 'css', url: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css', icon: '🎬' },
  { name: 'Font Awesome', type: 'css', url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css', icon: '🎨' },
  { name: 'Normalize.css', type: 'css', url: 'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css', icon: '📐' },
  { name: 'GSAP', type: 'js', url: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', icon: '🚀' },
  { name: 'Lodash', type: 'js', url: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js', icon: '🔧' },
  { name: 'Axios', type: 'js', url: 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js', icon: '📡' },
  { name: 'Chart.js', type: 'js', url: 'https://cdn.jsdelivr.net/npm/chart.js', icon: '📊' },
  { name: 'Three.js', type: 'js', url: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', icon: '🧊' },
  { name: 'Anime.js', type: 'js', url: 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.2/anime.min.js', icon: '✨' },
  { name: 'Alpine.js', type: 'js', url: 'https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js', icon: '⛰️' },
];

/* ═══════════════════════════════════════════════════════════
   SNIPPET LIBRARY
   ═══════════════════════════════════════════════════════════ */
const SNIPPET_LIBRARY = {
  html: [
    { name: 'Boilerplate', emoji: '📄', code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n</head>\n<body>\n  \n</body>\n</html>' },
    { name: 'Nav Bar', emoji: '🧭', code: '<nav class="navbar">\n  <div class="logo">Logo</div>\n  <ul class="nav-links">\n    <li><a href="#">Home</a></li>\n    <li><a href="#">About</a></li>\n    <li><a href="#">Contact</a></li>\n  </ul>\n</nav>' },
    { name: 'Card Grid', emoji: '🃏', code: '<div class="grid">\n  <div class="card">\n    <img src="https://picsum.photos/300/200" alt="Card">\n    <div class="card-body">\n      <h3>Card Title</h3>\n      <p>Card description goes here.</p>\n      <button>Learn More</button>\n    </div>\n  </div>\n</div>' },
    { name: 'Hero Section', emoji: '🦸', code: '<section class="hero">\n  <div class="hero-content">\n    <h1>Welcome to My Site</h1>\n    <p>A beautiful hero section with a call to action.</p>\n    <button class="btn-primary">Get Started</button>\n  </div>\n</section>' },
    { name: 'Modal Dialog', emoji: '💬', code: '<div class="modal-overlay" id="modal">\n  <div class="modal">\n    <div class="modal-header">\n      <h3>Modal Title</h3>\n      <button class="modal-close">&times;</button>\n    </div>\n    <div class="modal-body">\n      <p>Modal content goes here.</p>\n    </div>\n  </div>\n</div>' },
  ],
  css: [
    { name: 'Flex Center', emoji: '🎯', code: 'display: flex;\nalign-items: center;\njustify-content: center;\nmin-height: 100vh;' },
    { name: 'CSS Grid', emoji: '📐', code: 'display: grid;\ngrid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\ngap: 1.5rem;\npadding: 2rem;' },
    { name: 'Glass Card', emoji: '🔮', code: 'background: rgba(255, 255, 255, 0.05);\nbackdrop-filter: blur(20px);\nborder: 1px solid rgba(255, 255, 255, 0.1);\nborder-radius: 1rem;\npadding: 2rem;\nbox-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);' },
    { name: 'Gradient Text', emoji: '🌈', code: 'background: linear-gradient(135deg, #667eea, #764ba2);\n-webkit-background-clip: text;\n-webkit-text-fill-color: transparent;\nbackground-clip: text;' },
    { name: 'Smooth Shadow', emoji: '🌑', code: 'box-shadow:\n  0 1px 1px rgba(0,0,0,0.04),\n  0 2px 2px rgba(0,0,0,0.04),\n  0 4px 4px rgba(0,0,0,0.04),\n  0 8px 8px rgba(0,0,0,0.04),\n  0 16px 16px rgba(0,0,0,0.04);' },
    { name: 'Keyframe Spin', emoji: '🔄', code: '@keyframes spin {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}\n.spinner { animation: spin 1s linear infinite; }' },
    { name: 'Media Queries', emoji: '📱', code: '@media (min-width: 640px) { /* sm */ }\n@media (min-width: 768px) { /* md */ }\n@media (min-width: 1024px) { /* lg */ }\n@media (min-width: 1280px) { /* xl */ }' },
  ],
  js: [
    { name: 'DOM Ready', emoji: '📋', code: "document.addEventListener('DOMContentLoaded', () => {\n  console.log('DOM loaded');\n});" },
    { name: 'Fetch API', emoji: '📡', code: "async function fetchData(url) {\n  try {\n    const res = await fetch(url);\n    if (!res.ok) throw new Error(`HTTP ${res.status}`);\n    const data = await res.json();\n    console.log(data);\n    return data;\n  } catch (err) {\n    console.error('Fetch error:', err);\n  }\n}" },
    { name: 'Debounce', emoji: '⏱️', code: "function debounce(fn, delay = 300) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}" },
    { name: 'Observer', emoji: '👁️', code: "const observer = new IntersectionObserver((entries) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      entry.target.classList.add('visible');\n    }\n  });\n}, { threshold: 0.1 });\n\ndocument.querySelectorAll('.animate').forEach(el => observer.observe(el));" },
    { name: 'Local Storage', emoji: '💾', code: "function save(key, data) {\n  localStorage.setItem(key, JSON.stringify(data));\n}\nfunction load(key, fallback = null) {\n  const d = localStorage.getItem(key);\n  return d ? JSON.parse(d) : fallback;\n}" },
    { name: 'Dark Mode', emoji: '🌓', code: "function setTheme(dark) {\n  document.documentElement.classList.toggle('dark', dark);\n  localStorage.setItem('theme', dark ? 'dark' : 'light');\n}\nconst saved = localStorage.getItem('theme');\nsetTheme(saved ? saved === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches);" },
  ],
};

/* ═══════════════════════════════════════════════════════════
   SAMPLES
   ═══════════════════════════════════════════════════════════ */
const SAMPLES = [
  { name: 'Animated Card', emoji: '✨',
    html: '<div class="card">\n  <div class="card-glow"></div>\n  <h2>✨ Hover Me</h2>\n  <p>A beautiful glassmorphic card with smooth hover animations.</p>\n  <button class="btn">Explore</button>\n</div>',
    css: "body{display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);font-family:'Segoe UI',sans-serif}.card{position:relative;padding:2.5rem;border-radius:1.25rem;background:rgba(255,255,255,.05);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.1);color:#fff;text-align:center;max-width:320px;transition:transform .4s,box-shadow .4s;overflow:hidden}.card:hover{transform:translateY(-8px);box-shadow:0 20px 60px rgba(99,102,241,.3)}.card-glow{position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(circle,rgba(99,102,241,.15),transparent 60%);opacity:0;transition:opacity .4s;pointer-events:none}.card:hover .card-glow{opacity:1}h2{font-size:1.5rem;margin:0 0 .75rem}p{font-size:.9rem;opacity:.7;line-height:1.6;margin:0 0 1.5rem}.btn{padding:.6rem 1.8rem;border:none;border-radius:.75rem;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:.85rem;font-weight:600;cursor:pointer;transition:all .3s}.btn:hover{transform:scale(1.05);box-shadow:0 8px 24px rgba(99,102,241,.4)}",
    js: "const card=document.querySelector('.card');card.addEventListener('mousemove',(e)=>{const r=card.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;card.style.transform=`perspective(1000px) rotateX(${(y-r.height/2)/15}deg) rotateY(${(r.width/2-x)/15}deg) translateY(-8px)`});card.addEventListener('mouseleave',()=>{card.style.transform=''});" },
  { name: 'Flex Layout', emoji: '📐',
    html: '<div class="container">\n  <div class="box box-1">1</div>\n  <div class="box box-2">2</div>\n  <div class="box box-3">3</div>\n  <div class="box box-4">4</div>\n</div>',
    css: "body{display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#1a1a2e;font-family:sans-serif}.container{display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;padding:2rem}.box{width:100px;height:100px;border-radius:1rem;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;color:#fff;transition:transform .3s}.box:hover{transform:scale(1.1) rotate(5deg)}.box-1{background:linear-gradient(135deg,#667eea,#764ba2)}.box-2{background:linear-gradient(135deg,#f093fb,#f5576c)}.box-3{background:linear-gradient(135deg,#4facfe,#00f2fe)}.box-4{background:linear-gradient(135deg,#43e97b,#38f9d7)}",
    js: "document.querySelectorAll('.box').forEach(b=>{b.addEventListener('click',()=>{b.style.transform='scale(1.2) rotate(360deg)';setTimeout(()=>b.style.transform='',600)})});" },
  { name: 'CSS Animation', emoji: '🎭',
    html: '<div class="scene">\n  <div class="loader"><span></span><span></span><span></span><span></span><span></span></div>\n  <p class="text">Loading...</p>\n</div>',
    css: "body{display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#0a0a0a}.scene{text-align:center}.loader{display:flex;gap:6px;justify-content:center;margin-bottom:1.5rem}.loader span{width:12px;height:12px;border-radius:50%;background:#6366f1;animation:bounce 1.4s ease-in-out infinite}.loader span:nth-child(1){animation-delay:0s}.loader span:nth-child(2){animation-delay:.1s}.loader span:nth-child(3){animation-delay:.2s}.loader span:nth-child(4){animation-delay:.3s}.loader span:nth-child(5){animation-delay:.4s}@keyframes bounce{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1.2);opacity:1}}.text{color:rgba(255,255,255,.5);font-family:'Segoe UI',sans-serif;font-size:.85rem;letter-spacing:.15em;text-transform:uppercase}",
    js: "const colors=['#6366f1','#ec4899','#10b981','#f59e0b','#06b6d4'];let idx=0;document.addEventListener('click',()=>{idx=(idx+1)%colors.length;document.querySelectorAll('.loader span').forEach(s=>{s.style.background=colors[idx]})});" },
  { name: 'Form UI', emoji: '🚀',
    html: '<form class="form" onsubmit="return false">\n  <h2>🚀 Sign Up</h2>\n  <div class="field"><label>Username</label><input type="text" placeholder="Enter username" /></div>\n  <div class="field"><label>Email</label><input type="email" placeholder="Enter email" /></div>\n  <div class="field"><label>Password</label><input type="password" placeholder="Enter password" id="password" /><div class="strength-bar"><div class="strength-fill" id="strengthFill"></div></div></div>\n  <button type="submit" class="submit-btn">Create Account</button>\n</form>',
    css: "body{display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#0f172a;font-family:'Segoe UI',sans-serif}.form{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:1.25rem;padding:2.5rem;width:340px;backdrop-filter:blur(12px)}h2{color:#fff;text-align:center;margin:0 0 1.75rem;font-size:1.4rem}.field{margin-bottom:1.25rem}label{display:block;color:rgba(255,255,255,.6);font-size:.8rem;margin-bottom:.4rem;font-weight:500}input{width:100%;padding:.7rem .9rem;border:1px solid rgba(255,255,255,.1);border-radius:.6rem;background:rgba(255,255,255,.04);color:#fff;font-size:.85rem;outline:none;transition:border-color .3s,box-shadow .3s;box-sizing:border-box}input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15)}.strength-bar{height:3px;background:rgba(255,255,255,.06);border-radius:4px;margin-top:.5rem;overflow:hidden}.strength-fill{height:100%;width:0;border-radius:4px;transition:width .4s,background .4s}.submit-btn{width:100%;padding:.75rem;border:none;border-radius:.7rem;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-weight:600;font-size:.9rem;cursor:pointer;transition:transform .2s,box-shadow .2s;margin-top:.5rem}.submit-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(99,102,241,.3)}",
    js: "const pw=document.getElementById('password'),fill=document.getElementById('strengthFill');pw.addEventListener('input',()=>{const v=pw.value;let s=0;if(v.length>=6)s++;if(v.length>=10)s++;if(/[A-Z]/.test(v))s++;if(/[0-9]/.test(v))s++;if(/[^A-Za-z0-9]/.test(v))s++;fill.style.width=(s/5)*100+'%';fill.style.background=['#ef4444','#f97316','#eab308','#22c55e','#10b981'][s-1]||'#333'});document.querySelector('.submit-btn').addEventListener('click',function(){this.textContent='✓ Created!';this.style.background='linear-gradient(135deg,#10b981,#059669)';setTimeout(()=>{this.textContent='Create Account';this.style.background=''},2000)});" },
  { name: 'Dashboard', emoji: '📊',
    html: '<div class="dashboard">\n  <header class="dash-header"><h1>📊 Dashboard</h1><span class="badge">Live</span></header>\n  <div class="stats-grid">\n    <div class="stat-card"><span class="stat-icon">👥</span><div><span class="stat-value" id="users">0</span><span class="stat-label">Users</span></div></div>\n    <div class="stat-card"><span class="stat-icon">💰</span><div><span class="stat-value" id="revenue">$0</span><span class="stat-label">Revenue</span></div></div>\n    <div class="stat-card"><span class="stat-icon">📦</span><div><span class="stat-value" id="orders">0</span><span class="stat-label">Orders</span></div></div>\n  </div>\n  <div class="chart-area"><h3>Activity</h3><div class="bars" id="chart"></div></div>\n</div>',
    css: "body{margin:0;background:#0f172a;font-family:'Segoe UI',sans-serif;color:#e2e8f0;padding:2rem}.dashboard{max-width:700px;margin:0 auto}.dash-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem}.dash-header h1{font-size:1.5rem;margin:0}.badge{padding:.25rem .75rem;border-radius:9999px;font-size:.7rem;font-weight:700;background:rgba(16,185,129,.15);color:#10b981;animation:pulse 2s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin-bottom:2rem}.stat-card{display:flex;align-items:center;gap:1rem;padding:1.25rem;border-radius:1rem;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);transition:transform .3s}.stat-card:hover{transform:translateY(-2px)}.stat-icon{font-size:1.75rem}.stat-value{font-size:1.375rem;font-weight:800;color:#fff;display:block}.stat-label{font-size:.7rem;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.05em}.chart-area{padding:1.5rem;border-radius:1rem;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)}.chart-area h3{font-size:.9rem;margin:0 0 1.25rem;color:rgba(255,255,255,.6)}.bars{display:flex;align-items:flex-end;gap:6px;height:120px}.bar{flex:1;border-radius:4px 4px 0 0;background:linear-gradient(to top,#6366f1,#818cf8);transition:height .6s cubic-bezier(.34,1.56,.64,1);min-width:8px}",
    js: "function anim(id,end,pre='',dur=1500){const el=document.getElementById(id);let s=0;const step=()=>{s+=end/(dur/16);if(s>=end){el.textContent=pre+end.toLocaleString();return}el.textContent=pre+Math.floor(s).toLocaleString();requestAnimationFrame(step)};requestAnimationFrame(step)}anim('users',12847);anim('revenue',48293,'$');anim('orders',3842);const ch=document.getElementById('chart');[40,65,45,80,55,90,60,75,50,85,70,95].forEach((v,i)=>{const b=document.createElement('div');b.className='bar';b.style.height='0%';ch.appendChild(b);setTimeout(()=>b.style.height=v+'%',100+i*80)});" },
  { name: 'Responsive Grid', emoji: '🔲',
    html: '<div class="grid-container">\n  <div class="grid-item item-1">01</div>\n  <div class="grid-item item-2">02</div>\n  <div class="grid-item item-3">03</div>\n  <div class="grid-item item-4">04</div>\n  <div class="grid-item item-5">05</div>\n  <div class="grid-item item-6">06</div>\n</div>',
    css: "body{margin:0;min-height:100vh;background:#0a0a1a;display:flex;align-items:center;justify-content:center;padding:2rem;font-family:'Segoe UI',sans-serif}.grid-container{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;width:100%;max-width:600px;aspect-ratio:3/2}.grid-item{border-radius:1rem;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:800;color:#fff;cursor:pointer;transition:transform .3s,box-shadow .3s}.grid-item:hover{transform:scale(1.05);box-shadow:0 8px 32px rgba(0,0,0,.3)}.item-1{background:linear-gradient(135deg,#6366f1,#8b5cf6)}.item-2{background:linear-gradient(135deg,#ec4899,#f43f5e)}.item-3{background:linear-gradient(135deg,#14b8a6,#06b6d4)}.item-4{background:linear-gradient(135deg,#f59e0b,#ef4444)}.item-5{background:linear-gradient(135deg,#22c55e,#10b981)}.item-6{background:linear-gradient(135deg,#3b82f6,#6366f1)}@media(max-width:480px){.grid-container{grid-template-columns:repeat(2,1fr)}}",
    js: "document.querySelectorAll('.grid-item').forEach(item=>{item.addEventListener('click',()=>{item.style.transform='scale(0.9) rotate(5deg)';setTimeout(()=>item.style.transform='',300)});item.addEventListener('mousemove',(e)=>{const r=item.getBoundingClientRect();item.style.transform=`perspective(600px) rotateY(${((e.clientX-r.left)/r.width-.5)*10}deg) rotateX(${(.5-(e.clientY-r.top)/r.height)*10}deg) scale(1.05)`});item.addEventListener('mouseleave',()=>item.style.transform='')});" },
];



/* ═══════════════════════════════════════════════════════════
   FIND & REPLACE PANEL
   ═══════════════════════════════════════════════════════════ */
function FindReplacePanel({ code, onReplace, onClose }) {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const matchCount = useMemo(() => { if (!findText) return 0; try { const flags = caseSensitive ? 'g' : 'gi'; const pattern = useRegex ? new RegExp(findText, flags) : new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags); return (code.match(pattern) || []).length; } catch { return 0; } }, [code, findText, caseSensitive, useRegex]);
  const doReplace = useCallback((all) => { if (!findText) return; try { const flags = caseSensitive ? (all ? 'g' : '') : (all ? 'gi' : 'i'); const pattern = useRegex ? new RegExp(findText, flags) : new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags); onReplace(code.replace(pattern, replaceText)); } catch {} }, [code, findText, replaceText, caseSensitive, useRegex, onReplace]);
  return (
    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }} className="playground-find-replace">
      <div className="playground-find-replace-inner">
        <div className="playground-find-row">
          <div className="playground-find-input-wrap"><Search size={11} className="playground-find-icon" /><input value={findText} onChange={e => setFindText(e.target.value)} placeholder="Find..." className="playground-find-input" autoFocus />{findText && <span className="playground-find-count">{matchCount} {matchCount === 1 ? 'match' : 'matches'}</span>}</div>
          <div className="playground-find-input-wrap"><Replace size={11} className="playground-find-icon" /><input value={replaceText} onChange={e => setReplaceText(e.target.value)} placeholder="Replace..." className="playground-find-input" /></div>
        </div>
        <div className="playground-find-actions">
          <button onClick={() => setCaseSensitive(!caseSensitive)} className={`playground-find-toggle ${caseSensitive ? 'active' : ''}`} title="Case sensitive">Aa</button>
          <button onClick={() => setUseRegex(!useRegex)} className={`playground-find-toggle ${useRegex ? 'active' : ''}`} title="Use regex">.*</button>
          <div className="playground-find-sep" />
          <button onClick={() => doReplace(false)} className="playground-find-btn" disabled={!findText || matchCount === 0}>Replace</button>
          <button onClick={() => doReplace(true)} className="playground-find-btn" disabled={!findText || matchCount === 0}>All</button>
          <button onClick={onClose} className="playground-find-close"><X size={12} /></button>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BEAUTIFIER / FORMATTER
   ═══════════════════════════════════════════════════════════ */
function formatHTML(html) { let indent = 0; const sc = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']); return html.replace(/>\s*</g, '>\n<').split('\n').map(line => { line = line.trim(); if (!line) return ''; if (line.startsWith('</')) indent = Math.max(0, indent - 1); const result = '  '.repeat(indent) + line; const m = line.match(/^<(\w+)/); if (m && !sc.has(m[1].toLowerCase()) && !line.startsWith('</') && !line.endsWith('/>')) indent++; return result; }).filter(Boolean).join('\n'); }
function formatCSS(css) { return css.replace(/\s*{\s*/g, ' {\n  ').replace(/;\s*/g, ';\n  ').replace(/\s*}\s*/g, '\n}\n').replace(/  \n}/g, '\n}').replace(/\n{3,}/g, '\n\n').trim(); }
function formatJS(js) { let indent = 0; return js.split('\n').map(line => { const t = line.trim(); if (!t) return ''; if (t.startsWith('}') || t.startsWith(']') || t.startsWith(')')) indent = Math.max(0, indent - 1); const r = '  '.repeat(indent) + t; indent = Math.max(0, indent + (t.match(/[{(\[]/g) || []).length - (t.match(/[})\]]/g) || []).length); return r; }).filter(l => l !== '').join('\n'); }

const VIEWPORTS = [
  { id: 'full', icon: Maximize2, label: 'Full', width: '100%' },
  { id: 'desktop', icon: Monitor, label: '1280', width: '1280px' },
  { id: 'tablet', icon: Tablet, label: '768', width: '768px' },
  { id: 'mobile', icon: Smartphone, label: '375', width: '375px' },
];

/* ═══════════════════════════════════════════════════════════
   CONSOLE PANEL
   ═══════════════════════════════════════════════════════════ */
function ConsolePanel({ entries, onClear, onClose }) {
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [entries.length]);
  const cfg = { error: { cls: 'playground-console-error', icon: <AlertTriangle size={10} /> }, warn: { cls: 'playground-console-warn', icon: <AlertTriangle size={10} /> }, info: { cls: 'playground-console-info', icon: <Info size={10} /> }, log: { cls: 'playground-console-log', icon: <ChevronDown size={10} /> } };
  return (
    <div className="playground-console">
      <div className="playground-console-header">
        <div className="flex items-center gap-2"><Terminal size={12} className="opacity-40" /><span className="text-[10px] font-bold uppercase tracking-wider opacity-40">Console</span>{entries.length > 0 && <span className="playground-console-count">{entries.length}</span>}</div>
        <div className="flex items-center gap-1"><button onClick={onClear} className="playground-console-btn"><Eraser size={10} /> Clear</button><button onClick={onClose} className="playground-console-btn-close"><X size={12} /></button></div>
      </div>
      <div ref={scrollRef} className="playground-console-body scrollbar-thin">
        {entries.length === 0 ? <div className="playground-console-empty">No output — use console.log() in JS</div> : entries.map((entry, i) => { const c = cfg[entry.level] || cfg.log; return (<div key={i} className={`playground-console-entry ${c.cls}`}><span className="playground-console-icon">{c.icon}</span><span className="playground-console-time">{entry.time}</span><pre className="playground-console-msg">{entry.args.join(' ')}</pre></div>); })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function FrontendPlayground() {
  const [html, setHtml] = useLocalStorage('playground-html', '');
  const [css, setCss] = useLocalStorage('playground-css', '');
  const [js, setJs] = useLocalStorage('playground-js', '');
  const [activeTab, setActiveTab] = useState('html');
  const [viewport, setViewport] = useState('full');
  const [layout, setLayout] = useLocalStorage('playground-layout', 'horizontal');
  const [showPreview, setShowPreview] = useState(true);
  const [autoRun, setAutoRun] = useLocalStorage('playground-autorun', true);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [showConsole, setShowConsole] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [showSamples, setShowSamples] = useState(false);
  const [wordWrap, setWordWrap] = useLocalStorage('playground-wordwrap', false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [isFormatting, setIsFormatting] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [showSnippets, setShowSnippets] = useState(false);
  const [showCdnPanel, setShowCdnPanel] = useState(false);
  const [editorFontSize, setEditorFontSize] = useLocalStorage('playground-fontsize', 13);
  const [previewTheme, setPreviewTheme] = useLocalStorage('playground-preview-theme', 'light');
  const [enabledCdns, setEnabledCdns] = useLocalStorage('playground-cdns', []);
  const [lastSaved, setLastSaved] = useState(null);
  const [undoStack, setUndoStack] = useState({ html: [], css: [], js: [] });
  const [redoStack, setRedoStack] = useState({ html: [], css: [], js: [] });
  const lastPushRef = useRef(0);
  const { copied, copyToClipboard } = useCopyToClipboard();
  const iframeRef = useRef(null), debounceRef = useRef(null), fileInputRef = useRef(null);

  const pushUndo = useCallback((tab, oldVal) => { const now = Date.now(); if (now - lastPushRef.current < 500) return; lastPushRef.current = now; setUndoStack(prev => ({ ...prev, [tab]: [...prev[tab].slice(-50), oldVal] })); setRedoStack(prev => ({ ...prev, [tab]: [] })); }, []);
  const handleUndo = useCallback(() => { const tab = activeTab, stack = undoStack[tab]; if (!stack.length) return; const cur = tab === 'html' ? html : tab === 'css' ? css : js; setUndoStack(s => ({ ...s, [tab]: s[tab].slice(0, -1) })); setRedoStack(s => ({ ...s, [tab]: [...s[tab], cur] })); const prev = stack[stack.length - 1]; if (tab === 'html') setHtml(prev); else if (tab === 'css') setCss(prev); else setJs(prev); }, [activeTab, undoStack, html, css, js, setHtml, setCss, setJs]);
  const handleRedo = useCallback(() => { const tab = activeTab, stack = redoStack[tab]; if (!stack.length) return; const cur = tab === 'html' ? html : tab === 'css' ? css : js; setRedoStack(s => ({ ...s, [tab]: s[tab].slice(0, -1) })); setUndoStack(s => ({ ...s, [tab]: [...s[tab], cur] })); const next = stack[stack.length - 1]; if (tab === 'html') setHtml(next); else if (tab === 'css') setCss(next); else setJs(next); }, [activeTab, redoStack, html, css, js, setHtml, setCss, setJs]);
  const setHtmlTracked = useCallback((val) => { pushUndo('html', html); setHtml(val); }, [html, pushUndo, setHtml]);
  const setCssTracked = useCallback((val) => { pushUndo('css', css); setCss(val); }, [css, pushUndo, setCss]);
  const setJsTracked = useCallback((val) => { pushUndo('js', js); setJs(val); }, [js, pushUndo, setJs]);

  useEffect(() => { const t = setTimeout(() => setLastSaved(new Date()), 1500); return () => clearTimeout(t); }, [html, css, js]);

  const cdnLinks = useMemo(() => {
    const cssL = enabledCdns.filter(n => CDN_LIBRARIES.find(l => l.name === n && l.type === 'css')).map(n => CDN_LIBRARIES.find(l => l.name === n)).map(l => `<link rel="stylesheet" href="${l.url}">`).join('\n    ');
    const jsL = enabledCdns.filter(n => CDN_LIBRARIES.find(l => l.name === n && l.type === 'js')).map(n => CDN_LIBRARIES.find(l => l.name === n)).map(l => `<script src="${l.url}"><\/script>`).join('\n    ');
    return { cssLinks: cssL, jsLinks: jsL };
  }, [enabledCdns]);

  const previewBg = previewTheme === 'dark' ? '#1a1a2e' : '#fff';
  const previewHTML = useMemo(() => `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${cdnLinks.cssLinks ? '\n    ' + cdnLinks.cssLinks : ''}<style>*{box-sizing:border-box;}${css}</style></head><body>${html}${cdnLinks.jsLinks ? '\n    ' + cdnLinks.jsLinks : ''}<script>(function(){var _l=console.log,_w=console.warn,_e=console.error,_i=console.info;function s(t,a){try{parent.postMessage({type:'console',level:t,args:Array.from(a).map(function(x){try{return typeof x==='object'?JSON.stringify(x,null,2):String(x)}catch(e){return String(x)}})},'*')}catch(e){}}console.log=function(){s('log',arguments);_l.apply(console,arguments)};console.warn=function(){s('warn',arguments);_w.apply(console,arguments)};console.error=function(){s('error',arguments);_e.apply(console,arguments)};console.info=function(){s('info',arguments);_i.apply(console,arguments)};window.onerror=function(m,u,l){s('error',[m+(l?' (line '+l+')':'')])};window.onunhandledrejection=function(e){s('error',['Unhandled: '+(e.reason&&e.reason.message||e.reason||'Unknown')])}})();try{${js}}catch(e){console.error(e.message)}<\/script></body></html>`, [html, css, js, cdnLinks]);

  useEffect(() => { const h = (e) => { if (e.data?.type === 'console') { setConsoleOutput(prev => [...prev, { level: e.data.level, args: e.data.args, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }].slice(-200)); if (e.data.level === 'error') setShowConsole(true); } }; window.addEventListener('message', h); return () => window.removeEventListener('message', h); }, []);
  useEffect(() => { if (!autoRun) return; if (debounceRef.current) clearTimeout(debounceRef.current); debounceRef.current = setTimeout(() => setPreviewKey(k => k + 1), 600); return () => clearTimeout(debounceRef.current); }, [html, css, js, autoRun]);

  const runPreview = useCallback(() => { setConsoleOutput([]); setPreviewKey(k => k + 1); }, []);
  const handleReset = useCallback(() => { setHtml(''); setCss(''); setJs(''); setConsoleOutput([]); setPreviewKey(k => k + 1); setUndoStack({ html: [], css: [], js: [] }); setRedoStack({ html: [], css: [], js: [] }); }, [setHtml, setCss, setJs]);
  const handleLoadSample = useCallback((sample) => { setHtml(sample.html); setCss(sample.css); setJs(sample.js); setConsoleOutput([]); setShowSamples(false); }, [setHtml, setCss, setJs]);
  const getFullCode = useCallback(() => { const cc = enabledCdns.filter(n => CDN_LIBRARIES.find(l => l.name === n && l.type === 'css')).map(n => CDN_LIBRARIES.find(l => l.name === n)).map(l => `  <link rel="stylesheet" href="${l.url}">`).join('\n'); const cj = enabledCdns.filter(n => CDN_LIBRARIES.find(l => l.name === n && l.type === 'js')).map(n => CDN_LIBRARIES.find(l => l.name === n)).map(l => `  <script src="${l.url}"><\/script>`).join('\n'); return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Playground</title>\n${cc ? cc + '\n' : ''}  <style>\n${css.split('\n').map(l => '    ' + l).join('\n')}\n  </style>\n</head>\n<body>\n${html.split('\n').map(l => '  ' + l).join('\n')}\n${cj ? cj + '\n' : ''}  <script>\n${js.split('\n').map(l => '    ' + l).join('\n')}\n  </script>\n</body>\n</html>`; }, [html, css, js, enabledCdns]);
  const handleExport = useCallback(() => { const blob = new Blob([getFullCode()], { type: 'text/html' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `playground-${Date.now()}.html`; a.click(); URL.revokeObjectURL(url); }, [getFullCode]);
  const handleFileUpload = useCallback((e) => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = (ev) => { const c = ev.target.result; const sm = c.match(/<style[^>]*>([\s\S]*?)<\/style>/i); const scm = c.match(/<script[^>]*>([\s\S]*?)<\/script>/i); const bm = c.match(/<body[^>]*>([\s\S]*?)<\/body>/i); if (bm) setHtml(bm[1].replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').trim()); else setHtml(c.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<!DOCTYPE[^>]*>/i, '').replace(/<html[^>]*>/i, '').replace(/<\/html>/i, '').replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '').replace(/<body[^>]*>/i, '').replace(/<\/body>/i, '').trim()); if (sm) setCss(sm[1].trim()); if (scm) setJs(scm[1].trim()); setConsoleOutput([]); }; reader.readAsText(file); e.target.value = ''; }, [setHtml, setCss, setJs]);
  const handleFormat = useCallback(() => { setIsFormatting(true); setTimeout(() => { try { if (activeTab === 'html') setHtmlTracked(formatHTML(html)); else if (activeTab === 'css') setCssTracked(formatCSS(css)); else setJsTracked(formatJS(js)); } catch {} setIsFormatting(false); }, 150); }, [activeTab, html, css, js, setHtmlTracked, setCssTracked, setJsTracked]);
  const handleInsertSnippet = useCallback((code) => { if (activeTab === 'html') setHtmlTracked(html ? html + '\n' + code : code); else if (activeTab === 'css') setCssTracked(css ? css + '\n\n' + code : code); else setJsTracked(js ? js + '\n\n' + code : code); setShowSnippets(false); }, [activeTab, html, css, js, setHtmlTracked, setCssTracked, setJsTracked]);
  const toggleCdn = useCallback((name) => { setEnabledCdns(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]); }, [setEnabledCdns]);

  const TABS = [{ id: 'html', label: 'HTML', icon: Code, color: '#e34c26', lines: html.split('\n').filter(Boolean).length }, { id: 'css', label: 'CSS', icon: Palette, color: '#2965f1', lines: css.split('\n').filter(Boolean).length }, { id: 'js', label: 'JS', icon: Braces, color: '#f0db4f', lines: js.split('\n').filter(Boolean).length }];
  const currentCode = activeTab === 'html' ? html : activeTab === 'css' ? css : js;
  const setCurrentCode = activeTab === 'html' ? setHtmlTracked : activeTab === 'css' ? setCssTracked : setJsTracked;
  const viewportWidth = VIEWPORTS.find(v => v.id === viewport)?.width || '100%';
  const isVertical = layout === 'vertical';
  const errorCount = consoleOutput.filter(e => e.level === 'error').length;
  const warnCount = consoleOutput.filter(e => e.level === 'warn').length;
  const codeStats = useMemo(() => { const total = html.length + css.length + js.length; const totalLines = html.split('\n').length + css.split('\n').length + js.split('\n').length; const words = (html + ' ' + css + ' ' + js).split(/\s+/).filter(Boolean).length; return { chars: total, lines: totalLines, words }; }, [html, css, js]);
  const handleFindReplace = useCallback((newCode) => { setCurrentCode(newCode); }, [setCurrentCode]);

  return (
    <div className="playground-root">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="playground-header">
        <div className="flex items-center gap-3">
          <div className="playground-header-icon"><SquareCode size={22} /></div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Frontend Playground</h1>
            <p className="playground-subtitle">Write HTML, CSS & JS with full code intelligence<span className="playground-badge-intellisense"><Zap size={8} /> CodeMirror</span>{enabledCdns.length > 0 && <span className="playground-badge-cdn"><Library size={8} /> {enabledCdns.length} CDN</span>}</p>
          </div>
        </div>
        <div className="playground-actions">
          <label className={`playground-auto-toggle ${autoRun ? 'active' : ''}`}><input type="checkbox" className="toggle toggle-xs toggle-success" checked={autoRun} onChange={e => setAutoRun(e.target.checked)} /><span>Auto</span></label>
          <div className="playground-divider-v" />
          <button onClick={runPreview} className="btn btn-sm btn-primary gap-1.5 shadow-md shadow-primary/15"><Play size={13} fill="currentColor" /> Run</button>
          <input type="file" ref={fileInputRef} accept=".html,.htm" className="hidden" onChange={handleFileUpload} />
          <button onClick={() => fileInputRef.current?.click()} className="btn btn-sm btn-ghost gap-1"><Upload size={13} /><span className="hidden sm:inline">Import</span></button>
          <div className="relative">
            <button onClick={() => setShowSamples(!showSamples)} className="btn btn-sm btn-ghost gap-1"><Sparkles size={13} /><span className="hidden sm:inline">Samples</span><ChevronDown size={11} className={`transition-transform duration-200 ${showSamples ? 'rotate-180' : ''}`} /></button>
            <AnimatePresence>{showSamples && (<><div className="fixed inset-0 z-40" onClick={() => setShowSamples(false)} /><motion.div initial={{ opacity: 0, y: -6, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.95 }} transition={{ duration: 0.15 }} className="playground-dropdown"><div className="playground-dropdown-header">Quick Start Templates</div>{SAMPLES.map(s => (<button key={s.name} onClick={() => handleLoadSample(s)} className="playground-dropdown-item"><span>{s.emoji}</span><span>{s.name}</span></button>))}</motion.div></>)}</AnimatePresence>
          </div>
          <button onClick={() => copyToClipboard(getFullCode())} className="btn btn-sm btn-ghost gap-1">{copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}<span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span></button>
          <button onClick={handleExport} className="btn btn-sm btn-ghost gap-1"><Download size={13} /><span className="hidden sm:inline">Export</span></button>
          {(html || css || js) && <button onClick={handleReset} className="btn btn-sm btn-ghost text-error/60 hover:text-error gap-1"><Trash2 size={13} /></button>}
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="playground-toolbar">
        <div className="flex items-center gap-1 flex-wrap">
          <button onClick={() => setLayout(isVertical ? 'horizontal' : 'vertical')} className="playground-tool-btn">{isVertical ? <Rows size={12} /> : <Columns size={12} />}<span>{isVertical ? 'Stacked' : 'Side by side'}</span></button>
          <button onClick={() => setShowPreview(!showPreview)} className="playground-tool-btn">{showPreview ? <EyeOff size={12} /> : <Eye size={12} />}<span>{showPreview ? 'Hide' : 'Show'} preview</span></button>
          <button onClick={() => setShowConsole(!showConsole)} className="playground-tool-btn relative"><Terminal size={12} /><span>Console</span>{errorCount > 0 && <span className="playground-error-badge">{errorCount > 9 ? '9+' : errorCount}</span>}{warnCount > 0 && errorCount === 0 && <span className="playground-warn-badge">{warnCount > 9 ? '9+' : warnCount}</span>}</button>
          <button onClick={() => setWordWrap(w => !w)} className={`playground-tool-btn ${wordWrap ? 'text-primary' : ''}`} title="Toggle word wrap"><WrapText size={12} /><span className="hidden sm:inline">Wrap</span></button>
          <button onClick={handleFormat} className={`playground-tool-btn ${isFormatting ? 'playground-formatting' : ''}`} title="Format / Beautify code"><AlignLeft size={12} /><span className="hidden sm:inline">Format</span></button>
          <div className="playground-divider-v-sm" />
          <button onClick={() => setShowFindReplace(!showFindReplace)} className={`playground-tool-btn ${showFindReplace ? 'text-primary' : ''}`} title="Find & Replace (Ctrl+F)"><Search size={12} /><span className="hidden sm:inline">Find</span></button>
          <button onClick={handleUndo} className="playground-tool-btn" title="Undo (Ctrl+Z)" disabled={undoStack[activeTab]?.length === 0}><Undo2 size={12} /></button>
          <button onClick={handleRedo} className="playground-tool-btn" title="Redo (Ctrl+Y)" disabled={redoStack[activeTab]?.length === 0}><Redo2 size={12} /></button>
          <div className="playground-divider-v-sm" />
          <button onClick={() => setEditorFontSize(s => Math.min(s + 1, 22))} className="playground-tool-btn" title="Zoom in"><ZoomIn size={12} /></button>
          <span className="playground-font-size-label">{editorFontSize}px</span>
          <button onClick={() => setEditorFontSize(s => Math.max(s - 1, 9))} className="playground-tool-btn" title="Zoom out"><ZoomOut size={12} /></button>
          <div className="playground-divider-v-sm" />
          <button onClick={() => setShowSnippets(!showSnippets)} className={`playground-tool-btn ${showSnippets ? 'text-primary' : ''}`} title="Snippet library"><BookOpen size={12} /><span className="hidden sm:inline">Snippets</span></button>
          <button onClick={() => setShowCdnPanel(!showCdnPanel)} className={`playground-tool-btn ${showCdnPanel ? 'text-primary' : ''}`} title="CDN libraries"><Library size={12} /><span className="hidden sm:inline">CDN</span>{enabledCdns.length > 0 && <span className="playground-cdn-count">{enabledCdns.length}</span>}</button>
          <button onClick={() => setShowShortcuts(true)} className="playground-tool-btn" title="Keyboard shortcuts"><Keyboard size={12} /><span className="hidden sm:inline">Shortcuts</span></button>
        </div>
        {showPreview && (
          <div className="flex items-center gap-2">
            <div className="playground-preview-theme-switcher">
              <button onClick={() => setPreviewTheme('light')} className={`playground-preview-theme-btn ${previewTheme === 'light' ? 'active' : ''}`} title="Light background"><Sun size={10} /></button>
              <button onClick={() => setPreviewTheme('dark')} className={`playground-preview-theme-btn ${previewTheme === 'dark' ? 'active' : ''}`} title="Dark background"><Moon size={10} /></button>
            </div>
            <div className="playground-viewport-switcher">{VIEWPORTS.map(v => (<button key={v.id} onClick={() => setViewport(v.id)} className={`playground-viewport-btn ${viewport === v.id ? 'active' : ''}`}><v.icon size={11} /><span className="hidden sm:inline">{v.label}</span></button>))}</div>
          </div>
        )}
      </motion.div>

      {/* CDN Panel */}
      <AnimatePresence>{showCdnPanel && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }} className="overflow-hidden"><div className="playground-cdn-panel"><div className="playground-cdn-panel-header"><div className="flex items-center gap-2"><Library size={13} className="text-primary" /><span className="text-xs font-bold">CDN Libraries</span><span className="playground-cdn-hint">Toggle to inject into preview</span></div><button onClick={() => setShowCdnPanel(false)} className="playground-find-close"><X size={12} /></button></div><div className="playground-cdn-grid">{CDN_LIBRARIES.map(lib => { const isEnabled = enabledCdns.includes(lib.name); return (<button key={lib.name} onClick={() => toggleCdn(lib.name)} className={`playground-cdn-item ${isEnabled ? 'active' : ''}`}><span className="playground-cdn-item-icon">{lib.icon}</span><span className="playground-cdn-item-name">{lib.name}</span><span className={`playground-cdn-item-type ${lib.type}`}>{lib.type.toUpperCase()}</span></button>); })}</div></div></motion.div>)}</AnimatePresence>

      {/* Snippet Library */}
      <AnimatePresence>{showSnippets && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }} className="overflow-hidden"><div className="playground-snippet-panel"><div className="playground-snippet-panel-header"><div className="flex items-center gap-2"><BookOpen size={13} className="text-primary" /><span className="text-xs font-bold">Snippet Library</span><span className="playground-cdn-hint">for {activeTab.toUpperCase()}</span></div><button onClick={() => setShowSnippets(false)} className="playground-find-close"><X size={12} /></button></div><div className="playground-snippet-grid">{(SNIPPET_LIBRARY[activeTab] || []).map(snippet => (<button key={snippet.name} onClick={() => handleInsertSnippet(snippet.code)} className="playground-snippet-item"><span className="playground-snippet-item-icon">{snippet.emoji}</span><span className="playground-snippet-item-name">{snippet.name}</span></button>))}</div></div></motion.div>)}</AnimatePresence>

      {/* Workspace */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className={`playground-workspace ${isVertical ? 'vertical' : ''}`}>
        <div className={`playground-panel-editor ${showPreview ? '' : 'full'}`}>
          <div className="playground-tabbar">
            <div className="flex items-center flex-1">{TABS.map(tab => { const isActive = activeTab === tab.id; return (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`playground-tab ${isActive ? 'active' : ''}`}><span className="playground-tab-dot" style={{ background: tab.color, boxShadow: isActive ? `0 0 6px ${tab.color}50` : 'none', opacity: isActive ? 1 : 0.3 }} />{tab.label}{tab.lines > 0 && <span className={`playground-tab-count ${isActive ? 'active' : ''}`}>{tab.lines}</span>}{isActive && <motion.div layoutId="playground-tab-indicator" className="playground-tab-line" style={{ background: tab.color }} transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}</button>); })}</div>
            <div className="playground-tabbar-right"><button onClick={() => copyToClipboard(currentCode)} className="playground-tabbar-action" title="Copy code">{copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}</button>{currentCode.length > 0 && <span className="playground-tabbar-meta">{currentCode.split('\n').length} ln</span>}</div>
          </div>
          <AnimatePresence>{showFindReplace && <FindReplacePanel code={currentCode} onReplace={handleFindReplace} onClose={() => setShowFindReplace(false)} />}</AnimatePresence>
          <div className={`playground-editor-body ${isVertical ? 'stacked' : ''}`}>
            <CodeMirrorEditor
              value={currentCode}
              onChange={setCurrentCode}
              language={activeTab}
              placeholder={activeTab === 'html' ? 'Start typing HTML... (try typing < for tag suggestions)' : activeTab === 'css' ? 'Start typing CSS... (try typing a property name)' : 'Start typing JavaScript... (try clg → console.log)'}
              wordWrap={wordWrap}
              onCursorChange={setCursorPos}
              fontSize={editorFontSize}
            />
          </div>
          <div className="playground-statusbar">
            <div className="flex items-center gap-3"><span className="playground-statusbar-item"><span style={{ color: activeTab === 'html' ? '#e34c26' : activeTab === 'css' ? '#2965f1' : '#f0db4f', fontWeight: 700 }}>{activeTab.toUpperCase()}</span></span><span className="playground-statusbar-item">Ln {cursorPos.line}, Col {cursorPos.col}</span><span className="playground-statusbar-item">{currentCode.length} chars</span>{wordWrap && <span className="playground-statusbar-item" style={{ color: 'var(--color-primary)' }}>Wrap ON</span>}</div>
            <div className="flex items-center gap-3"><span className="playground-statusbar-item playground-statusbar-stats"><Gauge size={9} />{codeStats.lines} lines · {codeStats.words} words · {codeStats.chars > 1024 ? (codeStats.chars / 1024).toFixed(1) + ' KB' : codeStats.chars + ' B'}</span>{lastSaved && <span className="playground-statusbar-item playground-statusbar-saved"><Save size={9} />{lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}<span className="playground-statusbar-item">{autoRun ? <span style={{ color: 'var(--color-success)' }}>● Auto-run</span> : <span style={{ color: 'var(--color-base-content)', opacity: 0.4 }}>○ Manual</span>}</span><span className="playground-statusbar-item">UTF-8</span><span className="playground-statusbar-item">Spaces: 2</span></div>
          </div>
          <AnimatePresence>{showConsole && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }} className="overflow-hidden"><ConsolePanel entries={consoleOutput} onClear={() => setConsoleOutput([])} onClose={() => setShowConsole(false)} /></motion.div>}</AnimatePresence>
        </div>
        {showPreview && (
          <div className={`playground-panel-preview ${isVertical ? 'stacked' : ''}`}>
            <div className="playground-preview-header">
              <div className="flex items-center gap-2.5"><div className="playground-traffic-lights"><span style={{ background: '#ff5f57' }} /><span style={{ background: '#febc2e' }} /><span style={{ background: '#28c840' }} /></div><div className="playground-url-bar"><FileCode size={10} className="flex-shrink-0 opacity-50" /><span>playground://preview</span></div></div>
              <div className="flex items-center gap-1">{enabledCdns.length > 0 && <span className="playground-preview-cdn-badge" title={enabledCdns.join(', ')}><Library size={9} /> {enabledCdns.length}</span>}<button onClick={runPreview} className="playground-preview-btn" title="Refresh"><RotateCcw size={12} /></button><button onClick={() => { const w = window.open('', '_blank'); w.document.write(previewHTML); w.document.close(); }} className="playground-preview-btn" title="Pop out"><ExternalLink size={12} /></button></div>
            </div>
            <div className="playground-preview-body" style={{ background: previewBg }}><div style={{ width: viewportWidth, maxWidth: '100%', height: '100%' }} className="transition-all duration-300"><iframe ref={iframeRef} key={previewKey} srcDoc={previewHTML} className="w-full h-full border-0" sandbox="allow-scripts allow-modals allow-forms allow-same-origin" title="Preview" /></div></div>
            {viewport !== 'full' && <div className="playground-preview-footer">{viewportWidth} × 100%</div>}
          </div>
        )}
      </motion.div>

      {/* Empty State */}
      {!html && !css && !js && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="playground-empty">
          <div className="playground-empty-icon"><SquareCode size={26} /></div>
          <p className="playground-empty-title">Start coding or pick a template</p>
          <p className="playground-empty-desc">Powered by CodeMirror 6 — real syntax highlighting, context-aware autocomplete, bracket matching, code folding, multi-cursor, snippets, CDN injection & live preview</p>
          <div className="playground-empty-hints"><span><kbd>Tab</kbd> Accept suggestion</span><span><kbd>Ctrl+Space</kbd> Force autocomplete</span><span><kbd>Ctrl /</kbd> Toggle comment</span><span><kbd>Ctrl F</kbd> Find & Replace</span><span><kbd>!</kbd> HTML5 boilerplate</span><span><kbd>clg</kbd> console.log snippet</span></div>
        </motion.div>
      )}

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showShortcuts && (<>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setShowShortcuts(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 16 }} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }} className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-md mx-4 playground-shortcuts-modal">
              <div className="playground-shortcuts-modal-header"><div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}><Keyboard size={16} style={{ color: 'var(--color-primary)' }} /><span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Keyboard Shortcuts</span></div><button onClick={() => setShowShortcuts(false)} className="playground-preview-btn"><X size={14} /></button></div>
              <div className="playground-shortcuts-modal-body">
                {[{ category: 'Editor (CodeMirror)', shortcuts: [{ key: 'Tab', desc: 'Indent / Accept autocomplete' },{ key: 'Shift+Tab', desc: 'Outdent selection' },{ key: 'Ctrl+/', desc: 'Toggle line comment' },{ key: 'Ctrl+F', desc: 'Find & Replace (built-in)' },{ key: 'Ctrl+H', desc: 'Find & Replace with replace' },{ key: 'Ctrl+Z', desc: 'Undo' },{ key: 'Ctrl+Shift+Z / Ctrl+Y', desc: 'Redo' },{ key: '↑↓', desc: 'Navigate autocomplete' },{ key: 'Ctrl+D', desc: 'Select next occurrence' },{ key: 'Esc', desc: 'Close panels / autocomplete' }] },{ category: 'Code Intelligence', shortcuts: [{ key: 'Type to trigger', desc: 'Context-aware autocomplete' },{ key: '< (in HTML)', desc: 'HTML tag suggestions' },{ key: '. (after object)', desc: 'Property/method suggestions' },{ key: 'Snippets: clg, qs, ael', desc: 'JS shorthand snippets' },{ key: '! (in HTML)', desc: 'HTML5 boilerplate snippet' },{ key: 'Ctrl+Space', desc: 'Force autocomplete menu' }] },{ category: 'Brackets & Folding', shortcuts: [{ key: '( [ { " \'', desc: 'Auto-close brackets & quotes' },{ key: 'Select + bracket', desc: 'Wrap selection in brackets' },{ key: 'Click ▸ in gutter', desc: 'Fold / unfold code block' },{ key: 'Bracket highlight', desc: 'Matching brackets glow' }] },{ category: 'Playground', shortcuts: [{ key: 'Run button', desc: 'Execute & refresh preview' },{ key: 'Auto toggle', desc: 'Live preview on keystroke' },{ key: '+/- buttons', desc: 'Editor font size' }] }].map(group => (
                  <div key={group.category} className="playground-shortcuts-group"><div className="playground-shortcuts-category">{group.category}</div>{group.shortcuts.map(s => (<div key={s.key} className="playground-shortcuts-row"><span className="playground-shortcuts-desc">{s.desc}</span><kbd className="playground-shortcuts-key">{s.key}</kbd></div>))}</div>
                ))}
              </div>
            </div>
          </motion.div>
        </>)}
      </AnimatePresence>
    </div>
  );
}
