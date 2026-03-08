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
import './FrontendPlayground.css';

/* ═══════════════════════════════════════════════════════════
   AUTOCOMPLETE DEFINITIONS
   ═══════════════════════════════════════════════════════════ */
const HTML_TAGS=['div','span','p','a','img','ul','ol','li','h1','h2','h3','h4','h5','h6','header','footer','nav','main','section','article','aside','figure','figcaption','form','input','button','select','option','textarea','label','fieldset','legend','table','thead','tbody','tfoot','tr','th','td','caption','colgroup','col','video','audio','source','canvas','svg','path','circle','rect','line','polygon','details','summary','dialog','template','slot','blockquote','pre','code','em','strong','small','sub','sup','mark','del','ins','abbr','time','br','hr','wbr','iframe','embed','object','picture','map','area','datalist','output','progress','meter','ruby','rt','rp','bdi','bdo'];
const HTML_ATTRIBUTES={global:['id','class','style','title','lang','dir','tabindex','hidden','draggable','contenteditable','spellcheck','data-','aria-','role','accesskey','autofocus'],a:['href','target','rel','download','hreflang','type'],img:['src','alt','width','height','loading','decoding','srcset','sizes'],input:['type','name','value','placeholder','required','disabled','readonly','min','max','step','pattern','autocomplete','checked','multiple','accept'],button:['type','disabled','form','name','value'],form:['action','method','enctype','target','novalidate','autocomplete'],select:['name','multiple','size','required','disabled'],textarea:['name','rows','cols','placeholder','required','disabled','readonly','maxlength','wrap'],video:['src','controls','autoplay','loop','muted','poster','width','height','preload'],audio:['src','controls','autoplay','loop','muted','preload'],iframe:['src','width','height','sandbox','allow','loading','name'],table:['border','cellpadding','cellspacing'],td:['colspan','rowspan','headers'],th:['colspan','rowspan','headers','scope'],label:['for'],option:['value','selected','disabled'],source:['src','type','srcset','sizes','media'],link:['rel','href','type','media'],meta:['name','content','charset','http-equiv'],script:['src','type','async','defer','crossorigin'],canvas:['width','height'],svg:['viewBox','xmlns','fill','stroke','width','height'],progress:['value','max'],meter:['value','min','max','low','high','optimum'],details:['open'],dialog:['open']};
const CSS_PROPERTIES=['align-content','align-items','align-self','animation','animation-delay','animation-direction','animation-duration','animation-fill-mode','animation-iteration-count','animation-name','animation-play-state','animation-timing-function','aspect-ratio','backdrop-filter','backface-visibility','background','background-attachment','background-blend-mode','background-clip','background-color','background-image','background-origin','background-position','background-repeat','background-size','border','border-bottom','border-collapse','border-color','border-image','border-left','border-radius','border-right','border-spacing','border-style','border-top','border-width','bottom','box-decoration-break','box-shadow','box-sizing','caption-side','caret-color','clear','clip-path','color','column-count','column-gap','column-rule','columns','content','counter-increment','counter-reset','cursor','direction','display','empty-cells','filter','flex','flex-basis','flex-direction','flex-flow','flex-grow','flex-shrink','flex-wrap','float','font','font-family','font-feature-settings','font-kerning','font-size','font-stretch','font-style','font-variant','font-weight','gap','grid','grid-area','grid-auto-columns','grid-auto-flow','grid-auto-rows','grid-column','grid-column-end','grid-column-start','grid-gap','grid-row','grid-row-end','grid-row-start','grid-template','grid-template-areas','grid-template-columns','grid-template-rows','height','hyphens','image-rendering','inset','isolation','justify-content','justify-items','justify-self','left','letter-spacing','line-height','list-style','list-style-image','list-style-position','list-style-type','margin','margin-bottom','margin-left','margin-right','margin-top','mask','max-height','max-width','min-height','min-width','mix-blend-mode','object-fit','object-position','opacity','order','outline','outline-color','outline-offset','outline-style','outline-width','overflow','overflow-wrap','overflow-x','overflow-y','padding','padding-bottom','padding-left','padding-right','padding-top','page-break-after','page-break-before','page-break-inside','perspective','perspective-origin','place-content','place-items','place-self','pointer-events','position','quotes','resize','right','rotate','row-gap','scale','scroll-behavior','scroll-margin','scroll-padding','scroll-snap-align','scroll-snap-stop','scroll-snap-type','tab-size','table-layout','text-align','text-align-last','text-decoration','text-decoration-color','text-decoration-line','text-decoration-style','text-indent','text-overflow','text-shadow','text-transform','top','transform','transform-origin','transform-style','transition','transition-delay','transition-duration','transition-property','transition-timing-function','translate','unicode-bidi','user-select','vertical-align','visibility','white-space','widows','width','will-change','word-break','word-spacing','word-wrap','writing-mode','z-index','zoom'];
const CSS_VALUE_HINTS={display:['none','block','inline','inline-block','flex','inline-flex','grid','inline-grid','table','contents'],position:['static','relative','absolute','fixed','sticky'],'flex-direction':['row','row-reverse','column','column-reverse'],'flex-wrap':['nowrap','wrap','wrap-reverse'],'justify-content':['flex-start','flex-end','center','space-between','space-around','space-evenly'],'align-items':['flex-start','flex-end','center','baseline','stretch'],'align-content':['flex-start','flex-end','center','space-between','space-around','stretch'],'text-align':['left','right','center','justify','start','end'],'text-transform':['none','capitalize','uppercase','lowercase'],'text-decoration':['none','underline','overline','line-through'],overflow:['visible','hidden','scroll','auto','clip'],'overflow-x':['visible','hidden','scroll','auto','clip'],'overflow-y':['visible','hidden','scroll','auto','clip'],cursor:['auto','default','pointer','move','text','wait','help','not-allowed','grab','grabbing','crosshair','zoom-in','zoom-out'],visibility:['visible','hidden','collapse'],'box-sizing':['content-box','border-box'],float:['none','left','right'],clear:['none','left','right','both'],'font-weight':['normal','bold','bolder','lighter','100','200','300','400','500','600','700','800','900'],'font-style':['normal','italic','oblique'],'white-space':['normal','nowrap','pre','pre-wrap','pre-line','break-spaces'],'word-break':['normal','break-all','keep-all','break-word'],'list-style-type':['none','disc','circle','square','decimal'],'background-size':['auto','cover','contain'],'background-repeat':['repeat','repeat-x','repeat-y','no-repeat','space','round'],'background-attachment':['scroll','fixed','local'],'border-style':['none','solid','dashed','dotted','double','groove','ridge','inset','outset'],'object-fit':['fill','contain','cover','none','scale-down'],'user-select':['none','auto','text','all'],'pointer-events':['auto','none'],resize:['none','both','horizontal','vertical'],'animation-fill-mode':['none','forwards','backwards','both'],'animation-direction':['normal','reverse','alternate','alternate-reverse'],'animation-timing-function':['ease','linear','ease-in','ease-out','ease-in-out','step-start','step-end'],'transition-timing-function':['ease','linear','ease-in','ease-out','ease-in-out'],'grid-auto-flow':['row','column','dense','row dense','column dense']};
const JS_GLOBALS=['document','window','console','setTimeout','setInterval','clearTimeout','clearInterval','requestAnimationFrame','cancelAnimationFrame','fetch','Promise','JSON','Math','Date','Array','Object','String','Number','Boolean','RegExp','Map','Set','WeakMap','WeakSet','Symbol','Error','TypeError','RangeError','SyntaxError','parseInt','parseFloat','isNaN','isFinite','encodeURI','decodeURI','encodeURIComponent','decodeURIComponent','alert','confirm','prompt','localStorage','sessionStorage','location','history','navigator','performance','crypto','atob','btoa','URL','URLSearchParams','FormData','Headers','Request','Response','AbortController','IntersectionObserver','MutationObserver','ResizeObserver','EventTarget','Event','CustomEvent','HTMLElement','NodeList','Element','Node','DocumentFragment'];
const JS_METHODS={document:['getElementById','getElementsByClassName','getElementsByTagName','querySelector','querySelectorAll','createElement','createTextNode','createDocumentFragment','addEventListener','removeEventListener','write','writeln','open','close','hasFocus','exitFullscreen','getSelection','execCommand'],console:['log','warn','error','info','debug','table','dir','time','timeEnd','group','groupEnd','clear','count','assert','trace'],Math:['abs','ceil','floor','round','max','min','pow','sqrt','random','sign','trunc','log','log2','log10','sin','cos','tan','PI','E'],JSON:['parse','stringify'],Array:['from','isArray','of'],Object:['keys','values','entries','assign','freeze','seal','create','defineProperty','getPrototypeOf','hasOwn'],Promise:['all','allSettled','any','race','resolve','reject'],_array:['push','pop','shift','unshift','splice','slice','concat','join','reverse','sort','find','findIndex','filter','map','reduce','reduceRight','forEach','some','every','includes','indexOf','lastIndexOf','flat','flatMap','fill','copyWithin','at','entries','keys','values'],_string:['charAt','charCodeAt','codePointAt','concat','includes','endsWith','startsWith','indexOf','lastIndexOf','match','matchAll','padEnd','padStart','repeat','replace','replaceAll','search','slice','split','substring','toLowerCase','toUpperCase','trim','trimStart','trimEnd','at'],_element:['addEventListener','removeEventListener','appendChild','removeChild','insertBefore','replaceChild','cloneNode','contains','getAttribute','setAttribute','removeAttribute','hasAttribute','classList','closest','matches','querySelector','querySelectorAll','getBoundingClientRect','scrollIntoView','focus','blur','innerHTML','textContent','innerText','style','className','dataset','parentElement','children','firstChild','lastChild','nextSibling','previousSibling']};
const JS_KEYWORDS=['const','let','var','function','return','if','else','for','while','do','switch','case','break','continue','default','try','catch','finally','throw','new','delete','typeof','instanceof','in','of','class','extends','super','this','import','export','from','async','await','yield','static','get','set','true','false','null','undefined','void','with','debugger','=>'];
const JS_SNIPPETS=[{label:'forEach',insert:'forEach((item) => {\n  \n})',detail:'Array forEach loop'},{label:'map',insert:'map((item) => {\n  return item;\n})',detail:'Array map'},{label:'filter',insert:'filter((item) => {\n  return true;\n})',detail:'Array filter'},{label:'addEventListener',insert:"addEventListener('click', (e) => {\n  \n})",detail:'Add event listener'},{label:'querySelector',insert:"querySelector('')",detail:'Select element'},{label:'fetch',insert:"fetch('')\n  .then(res => res.json())\n  .then(data => {\n    console.log(data);\n  })\n  .catch(err => console.error(err));",detail:'Fetch API call'},{label:'async function',insert:'async function name() {\n  try {\n    \n  } catch (err) {\n    console.error(err);\n  }\n}',detail:'Async function'},{label:'class',insert:'class ClassName {\n  constructor() {\n    \n  }\n}',detail:'ES6 Class'}];

/* ═══════════════════════════════════════════════════════════
   EMMET-LIKE EXPANSION ENGINE
   ═══════════════════════════════════════════════════════════ */
function expandEmmet(abbreviation) {
  try {
    const trimmed = abbreviation.trim();
    if (!trimmed || trimmed.includes(' ')) return null;
    function parseNode(str) {
      const tagMatch = str.match(/^([a-z][a-z0-9]*)/i);
      const tag = tagMatch ? tagMatch[1] : 'div';
      let rest = tagMatch ? str.slice(tagMatch[0].length) : str;
      let id = '', classes = [], text = '', attrs = {};
      const idMatch = rest.match(/^#([\w-]+)/);
      if (idMatch) { id = idMatch[1]; rest = rest.slice(idMatch[0].length); }
      while (rest.startsWith('.')) {
        const clsMatch = rest.match(/^\.([\w-]+)/);
        if (clsMatch) { classes.push(clsMatch[1]); rest = rest.slice(clsMatch[0].length); } else break;
      }
      const attrMatch = rest.match(/^\[([^\]]+)\]/);
      if (attrMatch) { attrMatch[1].split(',').forEach(pair => { const [k, v] = pair.split('='); if (k) attrs[k.trim()] = v ? v.replace(/['"]/g, '').trim() : ''; }); rest = rest.slice(attrMatch[0].length); }
      const textMatch = rest.match(/^\{([^}]*)\}/);
      if (textMatch) { text = textMatch[1]; rest = rest.slice(textMatch[0].length); }
      let count = 1;
      const countMatch = rest.match(/^\*(\d+)/);
      if (countMatch) { count = parseInt(countMatch[1], 10); rest = rest.slice(countMatch[0].length); }
      let attrStr = '';
      if (id) attrStr += ` id="${id}"`;
      if (classes.length) attrStr += ` class="${classes.join(' ')}"`;
      Object.entries(attrs).forEach(([k, v]) => { attrStr += v ? ` ${k}="${v}"` : ` ${k}`; });
      const selfClosing = ['br','hr','img','input','meta','link','source','area','embed','wbr'].includes(tag);
      const html = selfClosing ? `<${tag}${attrStr} />` : `<${tag}${attrStr}>${text}</${tag}>`;
      return { html, count, rest, tag, attrStr, text };
    }
    function expand(str, indent = 0) {
      if (!str) return '';
      const pad = '  '.repeat(indent);
      let result = '';
      const siblings = []; let depth = 0, current = '';
      for (let i = 0; i < str.length; i++) { const ch = str[i]; if (ch === '(') depth++; else if (ch === ')') depth--; else if (ch === '+' && depth === 0) { siblings.push(current); current = ''; continue; } current += ch; }
      siblings.push(current);
      for (const sib of siblings) {
        const childIdx = sib.indexOf('>');
        if (childIdx > -1) {
          const parentStr = sib.substring(0, childIdx), childStr = sib.substring(childIdx + 1);
          const node = parseNode(parentStr); if (!node) continue;
          for (let i = 0; i < node.count; i++) { const childHtml = expand(childStr, indent + 1); result += `${pad}<${node.tag}${node.attrStr}>\n${childHtml}\n${pad}</${node.tag}>\n`; }
        } else { const node = parseNode(sib); if (!node) continue; for (let i = 0; i < node.count; i++) result += `${pad}${node.html}\n`; }
      }
      return result.replace(/\n$/, '');
    }
    return expand(trimmed) || null;
  } catch { return null; }
}

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
   AUTOCOMPLETE ENGINE
   ═══════════════════════════════════════════════════════════ */
function getAutocompleteSuggestions(code, cursorPos, language) {
  const textBeforeCursor = code.substring(0, cursorPos);
  const currentLine = textBeforeCursor.split('\n').pop() || '';
  const suggestions = [];
  if (language === 'html') {
    const tagMatch = currentLine.match(/<(\w*)$/);
    if (tagMatch) { const partial = tagMatch[1].toLowerCase(); HTML_TAGS.filter(t => t.startsWith(partial)).slice(0, 12).forEach(tag => suggestions.push({ label: tag, insert: tag, detail: 'HTML tag', kind: 'tag' })); return { suggestions, prefix: partial, type: 'tag' }; }
    const closeMatch = currentLine.match(/<\/(\w*)$/);
    if (closeMatch) { const partial = closeMatch[1].toLowerCase(); const openTags = [...textBeforeCursor.matchAll(/<(\w+)[^>]*>/g)].map(m => m[1]); const closeTags = [...textBeforeCursor.matchAll(/<\/(\w+)>/g)].map(m => m[1]); const unclosed = []; openTags.forEach(t => { const i = closeTags.indexOf(t); if (i >= 0) closeTags.splice(i, 1); else unclosed.push(t); }); [...new Set(unclosed.reverse())].filter(t => t.toLowerCase().startsWith(partial)).slice(0, 8).forEach(tag => suggestions.push({ label: `/${tag}`, insert: `${tag}>`, detail: 'Close tag', kind: 'tag' })); return { suggestions, prefix: partial, type: 'close-tag' }; }
    const attrMatch = currentLine.match(/<(\w+)\s+(?:[^>]*\s+)?(\w*)$/);
    if (attrMatch) { const tagName = attrMatch[1].toLowerCase(); const partial = attrMatch[2].toLowerCase(); const attrs = [...(HTML_ATTRIBUTES.global || []), ...(HTML_ATTRIBUTES[tagName] || [])]; [...new Set(attrs)].filter(a => a.startsWith(partial)).slice(0, 12).forEach(attr => suggestions.push({ label: attr, insert: `${attr}=""`, detail: `<${tagName}>`, kind: 'attribute' })); return { suggestions, prefix: partial, type: 'attribute' }; }
  }
  if (language === 'css') {
    const valueMatch = currentLine.match(/([\w-]+)\s*:\s*([\w-]*)$/);
    if (valueMatch) { const prop = valueMatch[1]; const partial = valueMatch[2].toLowerCase(); const values = CSS_VALUE_HINTS[prop] || []; values.filter(v => v.startsWith(partial)).slice(0, 12).forEach(val => suggestions.push({ label: val, insert: val, detail: `${prop}`, kind: 'value' })); if (suggestions.length > 0) return { suggestions, prefix: partial, type: 'value' }; }
    const propMatch = currentLine.match(/(?:^|[{;]\s*)([\w-]*)$/);
    if (propMatch) { const partial = propMatch[1].toLowerCase(); if (partial.length > 0) { CSS_PROPERTIES.filter(p => p.startsWith(partial)).slice(0, 12).forEach(prop => suggestions.push({ label: prop, insert: `${prop}: `, detail: 'property', kind: 'property' })); return { suggestions, prefix: partial, type: 'property' }; } }
  }
  if (language === 'js') {
    const dotMatch = currentLine.match(/(\w+)\.\s*(\w*)$/);
    if (dotMatch) { const obj = dotMatch[1]; const partial = dotMatch[2].toLowerCase(); const methods = JS_METHODS[obj] || JS_METHODS._element || []; methods.filter(m => m.toLowerCase().startsWith(partial)).slice(0, 12).forEach(method => suggestions.push({ label: method, insert: method, detail: `${obj}`, kind: 'method' })); if (suggestions.length === 0) [...(JS_METHODS._array || []), ...(JS_METHODS._string || [])].filter(m => m.toLowerCase().startsWith(partial)).slice(0, 12).forEach(method => suggestions.push({ label: method, insert: method, detail: 'method', kind: 'method' })); return { suggestions, prefix: partial, type: 'method' }; }
    const wordMatch = currentLine.match(/(\w+)$/);
    if (wordMatch) { const partial = wordMatch[1].toLowerCase(); if (partial.length >= 2) { JS_KEYWORDS.filter(k => k.startsWith(partial) && k !== partial).slice(0, 5).forEach(kw => suggestions.push({ label: kw, insert: kw, detail: 'keyword', kind: 'keyword' })); JS_GLOBALS.filter(g => g.toLowerCase().startsWith(partial) && g.toLowerCase() !== partial).slice(0, 6).forEach(g => suggestions.push({ label: g, insert: g, detail: 'global', kind: 'global' })); JS_SNIPPETS.filter(s => s.label.toLowerCase().startsWith(partial)).slice(0, 4).forEach(s => suggestions.push({ label: s.label, insert: s.insert, detail: s.detail, kind: 'snippet' })); return { suggestions, prefix: partial, type: 'word' }; } }
  }
  return { suggestions: [], prefix: '', type: null };
}

/* ═══════════════════════════════════════════════════════════
   SMART CODE EDITOR
   ═══════════════════════════════════════════════════════════ */
function SmartEditor({ value, onChange, language, placeholder, minRows = 18, wordWrap = false, onCursorChange, fontSize = 13 }) {
  const textareaRef = useRef(null), autocompleteRef = useRef(null), gutterRef = useRef(null);
  const [autocomplete, setAutocomplete] = useState({ visible: false, suggestions: [], index: 0, prefix: '', type: null, position: { top: 0, left: 0 } });
  const lineHeight = fontSize * 1.846;
  const getCaretCoordinates = useCallback(() => {
    const ta = textareaRef.current; if (!ta) return { top: 0, left: 0 };
    const div = document.createElement('div'); const style = window.getComputedStyle(ta);
    ['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','wordSpacing','textIndent','paddingTop','paddingLeft','paddingRight','borderTopWidth','borderLeftWidth','boxSizing','whiteSpace','wordWrap','overflowWrap','tabSize'].forEach(p => div.style[p] = style[p]);
    div.style.position = 'absolute'; div.style.visibility = 'hidden'; div.style.whiteSpace = 'pre-wrap'; div.style.wordWrap = 'break-word'; div.style.width = ta.offsetWidth + 'px'; div.style.height = 'auto'; div.style.overflow = 'hidden';
    div.appendChild(document.createTextNode(ta.value.substring(0, ta.selectionEnd))); const marker = document.createElement('span'); marker.textContent = '|'; div.appendChild(marker); document.body.appendChild(div);
    const top = marker.offsetTop, left = marker.offsetLeft; document.body.removeChild(div);
    return { top: top - ta.scrollTop + parseInt(style.paddingTop) + parseInt(style.borderTopWidth), left: Math.min(left, ta.offsetWidth - 250) };
  }, []);
  const triggerAutocomplete = useCallback((newValue, cursorPos) => {
    const result = getAutocompleteSuggestions(newValue, cursorPos, language);
    if (result.suggestions.length > 0) { const pos = getCaretCoordinates(); setAutocomplete({ visible: true, suggestions: result.suggestions, index: 0, prefix: result.prefix, type: result.type, position: { top: pos.top + 22, left: Math.max(0, pos.left - (result.prefix.length * 7.2)) } }); }
    else setAutocomplete(prev => ({ ...prev, visible: false }));
  }, [language, getCaretCoordinates]);
  const applySuggestion = useCallback((suggestion) => {
    const ta = textareaRef.current; if (!ta) return;
    const cursorPos = ta.selectionEnd, prefix = autocomplete.prefix;
    onChange(value.substring(0, cursorPos - prefix.length) + suggestion.insert + value.substring(cursorPos));
    setAutocomplete(prev => ({ ...prev, visible: false }));
    requestAnimationFrame(() => { const newPos = (cursorPos - prefix.length) + suggestion.insert.length; ta.focus(); ta.setSelectionRange(newPos, newPos); });
  }, [value, onChange, autocomplete.prefix]);
  const handleScroll = useCallback(() => { if (textareaRef.current && gutterRef.current) gutterRef.current.scrollTop = textareaRef.current.scrollTop; }, []);
  const handleKeyDown = useCallback((e) => {
    if (autocomplete.visible) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setAutocomplete(prev => ({ ...prev, index: (prev.index + 1) % prev.suggestions.length })); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setAutocomplete(prev => ({ ...prev, index: (prev.index - 1 + prev.suggestions.length) % prev.suggestions.length })); return; }
      if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); applySuggestion(autocomplete.suggestions[autocomplete.index]); return; }
      if (e.key === 'Escape') { e.preventDefault(); setAutocomplete(prev => ({ ...prev, visible: false })); return; }
    }
    if (e.key === 'Tab' && !autocomplete.visible) {
      e.preventDefault(); const ta = e.target, s = ta.selectionStart, end = ta.selectionEnd;
      if (language === 'html' && !e.shiftKey) { const tb = value.substring(0, s); const ls = tb.lastIndexOf('\n') + 1; const cl = tb.substring(ls).trim(); if (cl && /^[a-z][\w.#\[\]{}*>+\-]*$/i.test(cl)) { const expanded = expandEmmet(cl); if (expanded) { const indent = tb.substring(ls).match(/^(\s*)/)[1]; const ie = expanded.split('\n').map(l => indent + l).join('\n'); onChange(value.substring(0, ls) + ie + value.substring(s)); requestAnimationFrame(() => { const np = ls + ie.length; ta.setSelectionRange(np, np); }); return; } } }
      if (e.shiftKey) { const ls = value.lastIndexOf('\n', s - 1) + 1; const line = value.substring(ls, end); if (line.startsWith('  ')) { onChange(value.substring(0, ls) + line.substring(2) + value.substring(end)); requestAnimationFrame(() => ta.setSelectionRange(Math.max(ls, s - 2), end - 2)); } }
      else { onChange(value.substring(0, s) + '  ' + value.substring(end)); requestAnimationFrame(() => ta.setSelectionRange(s + 2, s + 2)); }
      return;
    }
    const pairs = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' };
    if (pairs[e.key]) { const ta = e.target, s = ta.selectionStart, end = ta.selectionEnd; if (s !== end) { e.preventDefault(); onChange(value.substring(0, s) + e.key + value.substring(s, end) + pairs[e.key] + value.substring(end)); requestAnimationFrame(() => ta.setSelectionRange(s + 1, end + 1)); return; } e.preventDefault(); onChange(value.substring(0, s) + e.key + pairs[e.key] + value.substring(end)); requestAnimationFrame(() => ta.setSelectionRange(s + 1, s + 1)); return; }
    if ([')', ']', '}', '"', "'", '`'].includes(e.key)) { const ta = e.target, pos = ta.selectionStart; if (value[pos] === e.key) { e.preventDefault(); requestAnimationFrame(() => ta.setSelectionRange(pos + 1, pos + 1)); return; } }
    if (e.key === 'Enter' && !autocomplete.visible) {
      const ta = e.target, pos = ta.selectionStart, tB = value.substring(0, pos), cl = tB.split('\n').pop() || '', indent = cl.match(/^(\s*)/)[1], cB = value[pos - 1], cA = value[pos];
      if ((cB === '{' && cA === '}') || (cB === '(' && cA === ')') || (cB === '[' && cA === ']')) { e.preventDefault(); const ni = indent + '  '; onChange(value.substring(0, pos) + '\n' + ni + '\n' + indent + value.substring(pos)); requestAnimationFrame(() => { ta.setSelectionRange(pos + 1 + ni.length, pos + 1 + ni.length); }); return; }
      let extra = ''; if (cB === '{' || (cB === ':' && language === 'css')) extra = '  ';
      if (indent || extra) { e.preventDefault(); onChange(value.substring(0, pos) + '\n' + indent + extra + value.substring(pos)); requestAnimationFrame(() => { const np = pos + 1 + indent.length + extra.length; ta.setSelectionRange(np, np); }); }
    }
    if (e.key === '/' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault(); const ta = e.target, s = ta.selectionStart, ls = value.lastIndexOf('\n', s - 1) + 1, le = value.indexOf('\n', s), line = value.substring(ls, le === -1 ? value.length : le);
      let cp, cs; if (language === 'html') { cp = '<!-- '; cs = ' -->'; } else if (language === 'css') { cp = '/* '; cs = ' */'; } else { cp = '// '; cs = ''; }
      let nv, np;
      if (language === 'js' && line.trimStart().startsWith('//')) { const st = line.replace(/^(\s*)\/\/\s?/, '$1'); nv = value.substring(0, ls) + st + value.substring(le === -1 ? value.length : le); np = s - (line.length - st.length); }
      else if (language === 'css' && line.trimStart().startsWith('/*')) { const st = line.replace(/^(\s*)\/\*\s?/, '$1').replace(/\s?\*\/\s*$/, ''); nv = value.substring(0, ls) + st + value.substring(le === -1 ? value.length : le); np = s - (line.length - st.length); }
      else if (language === 'html' && line.trimStart().startsWith('<!--')) { const st = line.replace(/^(\s*)<!--\s?/, '$1').replace(/\s?-->\s*$/, ''); nv = value.substring(0, ls) + st + value.substring(le === -1 ? value.length : le); np = s - (line.length - st.length); }
      else { const cm = line.replace(/^(\s*)/, `$1${cp}`) + cs; nv = value.substring(0, ls) + cm + value.substring(le === -1 ? value.length : le); np = s + cp.length; }
      onChange(nv); requestAnimationFrame(() => ta.setSelectionRange(Math.max(0, np), Math.max(0, np)));
    }
  }, [autocomplete, applySuggestion, value, onChange, language]);
  const handleInput = useCallback((e) => { const nv = e.target.value; onChange(nv); const cp = e.target.selectionEnd; requestAnimationFrame(() => triggerAutocomplete(nv, cp)); }, [onChange, triggerAutocomplete]);
  const handleBlur = useCallback(() => { setTimeout(() => setAutocomplete(prev => ({ ...prev, visible: false })), 200); }, []);
  const handleCursorChange = useCallback((e) => { if (!onCursorChange) return; const ta = e.target, pos = ta.selectionStart, lines = ta.value.substring(0, pos).split('\n'); onCursorChange({ line: lines.length, col: lines[lines.length - 1].length + 1 }); }, [onCursorChange]);
  useEffect(() => { if (autocomplete.visible && autocompleteRef.current) { const ai = autocompleteRef.current.querySelector('[data-active="true"]'); if (ai) ai.scrollIntoView({ block: 'nearest' }); } }, [autocomplete.index, autocomplete.visible]);
  const lineCount = Math.max(value.split('\n').length, minRows);
  const kindIcons = { tag: '🏷️', attribute: '📎', property: '🎨', value: '💎', method: '⚡', keyword: '🔑', global: '🌐', snippet: '✨', selector: '🎯', 'close-tag': '🏷️' };
  return (
    <div className="playground-editor-wrap relative flex h-full">
      <div ref={gutterRef} className="playground-gutter" style={{ fontSize: `${fontSize * 0.846}px`, lineHeight: `${lineHeight}px` }}>
        <div className="py-[0.625rem]">{Array.from({ length: lineCount }, (_, i) => (<div key={i} className="playground-line-num" style={{ height: `${lineHeight}px`, lineHeight: `${lineHeight}px` }}>{i < value.split('\n').length ? i + 1 : ''}</div>))}</div>
      </div>
      <textarea ref={textareaRef} value={value} onChange={handleInput} onKeyDown={handleKeyDown} onBlur={handleBlur} onScroll={handleScroll} onClick={handleCursorChange} onKeyUp={handleCursorChange} placeholder={placeholder} className="playground-textarea" spellCheck={false} autoComplete="off" autoCorrect="off" autoCapitalize="off" style={{ whiteSpace: wordWrap ? 'pre-wrap' : 'pre', overflowX: wordWrap ? 'hidden' : 'auto', fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px` }} />
      <AnimatePresence>
        {autocomplete.visible && autocomplete.suggestions.length > 0 && (
          <motion.div ref={autocompleteRef} initial={{ opacity: 0, y: -6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.96 }} transition={{ duration: 0.12, ease: [0.23, 1, 0.32, 1] }} className="playground-autocomplete" style={{ top: autocomplete.position.top, left: autocomplete.position.left + 48 }}>
            <div className="playground-ac-header"><span>{autocomplete.type === 'method' ? 'Methods' : autocomplete.type === 'tag' ? 'HTML Tags' : autocomplete.type === 'property' ? 'CSS Properties' : autocomplete.type === 'value' ? 'Values' : autocomplete.type === 'attribute' ? 'Attributes' : 'Suggestions'}</span><span>{autocomplete.suggestions.length}</span></div>
            <div className="playground-ac-body scrollbar-thin">{autocomplete.suggestions.map((s, i) => (<div key={`${s.label}-${i}`} data-active={i === autocomplete.index} className={`playground-ac-item ${i === autocomplete.index ? 'active' : ''}`} onMouseDown={(e) => { e.preventDefault(); applySuggestion(s); }} onMouseEnter={() => setAutocomplete(prev => ({ ...prev, index: i }))}><span className="playground-ac-icon">{kindIcons[s.kind] || '📝'}</span><span className="playground-ac-label">{s.label}</span><span className="playground-ac-detail">{s.detail}</span></div>))}</div>
            <div className="playground-ac-footer"><span><kbd>↑↓</kbd> nav</span><span><kbd>Tab</kbd> accept</span><span><kbd>Esc</kbd> close</span></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
  useEffect(() => { const h = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'f') { const pg = document.querySelector('.playground-root'); if (pg?.contains(document.activeElement)) { e.preventDefault(); setShowFindReplace(prev => !prev); } } if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { const pg = document.querySelector('.playground-root'); if (pg?.contains(document.activeElement)) { e.preventDefault(); handleUndo(); } } if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { const pg = document.querySelector('.playground-root'); if (pg?.contains(document.activeElement)) { e.preventDefault(); handleRedo(); } } }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, [handleUndo, handleRedo]);

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
            <p className="playground-subtitle">Write HTML, CSS & JS with intelligent autocomplete<span className="playground-badge-intellisense"><Zap size={8} /> IntelliSense</span>{enabledCdns.length > 0 && <span className="playground-badge-cdn"><Library size={8} /> {enabledCdns.length} CDN</span>}</p>
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
            <AnimatePresence mode="wait"><motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.08 }} className="h-full"><SmartEditor value={currentCode} onChange={setCurrentCode} language={activeTab} placeholder={activeTab === 'html' ? '<div class="container">\n  <h1>Hello World</h1>\n</div>' : activeTab === 'css' ? 'body {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 100vh;\n}' : 'document.querySelector("h1")\n  .addEventListener("click", () => {\n    console.log("Hello!");\n  });'} minRows={isVertical ? 12 : 22} wordWrap={wordWrap} onCursorChange={setCursorPos} fontSize={editorFontSize} /></motion.div></AnimatePresence>
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
          <p className="playground-empty-desc">Write HTML, CSS & JavaScript with smart autocomplete, Emmet expansion, snippets, CDN injection, and live preview</p>
          <div className="playground-empty-hints"><span><kbd>Tab</kbd> Accept / Emmet expand</span><span><kbd>Ctrl /</kbd> Toggle comment</span><span><kbd>Ctrl F</kbd> Find & Replace</span><span><kbd>Ctrl Z</kbd> Undo</span><span>Auto-close <code>( ) [ ] { } " "</code></span></div>
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
                {[{ category: 'Editor', shortcuts: [{ key: 'Tab', desc: 'Indent / Accept / Emmet expand' },{ key: 'Shift+Tab', desc: 'Outdent selection' },{ key: 'Ctrl+/', desc: 'Toggle line comment' },{ key: 'Ctrl+F', desc: 'Find & Replace' },{ key: 'Ctrl+Z', desc: 'Undo' },{ key: 'Ctrl+Y', desc: 'Redo' },{ key: '↑↓', desc: 'Navigate autocomplete' },{ key: 'Esc', desc: 'Close panels' }] },{ category: 'Brackets & Pairs', shortcuts: [{ key: '( [ { " \'', desc: 'Auto-close brackets & quotes' },{ key: 'Select + bracket', desc: 'Wrap selection' }] },{ category: 'Emmet (HTML)', shortcuts: [{ key: 'div.class>p', desc: 'Expand to nested HTML' },{ key: 'ul>li*3', desc: 'Multiply elements' },{ key: '#id.cls', desc: 'ID + class shorthand' }] },{ category: 'Playground', shortcuts: [{ key: 'Run button', desc: 'Execute & refresh preview' },{ key: 'Auto toggle', desc: 'Live preview on keystroke' },{ key: '+/- buttons', desc: 'Editor font size' }] }].map(group => (
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
