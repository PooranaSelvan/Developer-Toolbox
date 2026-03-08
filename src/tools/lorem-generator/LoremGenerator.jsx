import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TextCursorInput, Copy, Check, Trash2, RefreshCw, Download,
  AlignLeft, AlignJustify, List, Hash, Type, Sparkles,
  FileText, Code, Layers, Settings,
} from 'lucide-react';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
  'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
  'explicabo', 'nemo', 'ipsam', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit',
  'fugit', 'consequuntur', 'magni', 'dolores', 'eos', 'ratione', 'sequi', 'nesciunt',
  'neque', 'porro', 'quisquam', 'nihil', 'numquam', 'corporis', 'suscipit',
  'laboriosam', 'sapiente', 'delectus', 'rerum', 'hic', 'tenetur',
];

const HIPSTER_WORDS = [
  'artisan', 'aesthetic', 'avocado', 'beard', 'brunch', 'bushwick', 'cardigan',
  'celiac', 'chambray', 'cold-pressed', 'craft', 'cronut', 'disrupt', 'dreamcatcher',
  'echo', 'farm-to-table', 'fingerstache', 'flannel', 'flexitarian', 'freegan',
  'gastropub', 'gluten-free', 'gochujang', 'hashtag', 'helvetica', 'humblebrag',
  'intelligentsia', 'irony', 'jean', 'kale', 'keytar', 'kickstarter', 'knausgaard',
  'kombucha', 'letterpress', 'listicle', 'lomo', 'lumbersexual', 'marfa', 'meditation',
  'microdosing', 'migas', 'mumblecore', 'neutra', 'normcore', 'occupy', 'organic',
  'paleo', 'pabst', 'pinterest', 'pitchfork', 'plaid', 'polaroid', 'portland',
  'post-ironic', 'pour-over', 'quinoa', 'raw', 'raclette', 'retro', 'salvia',
  'selvage', 'semiotics', 'shoreditch', 'skateboard', 'slow-carb', 'small-batch',
  'snackwave', 'sriracha', 'stumptown', 'succulents', 'sustainable', 'synth',
  'tattooed', 'taxidermy', 'thundercats', 'tofu', 'tote', 'truffaut', 'tumblr',
  'typewriter', 'umami', 'unicorn', 'vaporware', 'vegan', 'venmo', 'vinyl',
  'waistcoat', 'woke', 'wolf', 'yolo',
];

const TECH_WORDS = [
  'algorithm', 'api', 'async', 'authentication', 'backend', 'bandwidth', 'blockchain',
  'boolean', 'buffer', 'cache', 'callback', 'cloud', 'cluster', 'compile', 'component',
  'container', 'database', 'debug', 'deploy', 'devops', 'docker', 'domain', 'endpoint',
  'encryption', 'event', 'fetch', 'firewall', 'framework', 'frontend', 'function',
  'gateway', 'git', 'graphql', 'hash', 'hook', 'http', 'ide', 'immutable', 'index',
  'instance', 'interface', 'javascript', 'json', 'kubernetes', 'lambda', 'latency',
  'library', 'linux', 'load-balancer', 'localhost', 'microservice', 'middleware',
  'module', 'mutation', 'namespace', 'nginx', 'node', 'npm', 'observable', 'orm',
  'package', 'parameter', 'parser', 'pipeline', 'plugin', 'postgres', 'promise',
  'protocol', 'proxy', 'query', 'queue', 'react', 'redis', 'refactor', 'regex',
  'repository', 'request', 'resolver', 'response', 'rest', 'runtime', 'schema',
  'sdk', 'server', 'serverless', 'service', 'socket', 'sprint', 'sql', 'ssl',
  'stack', 'state', 'stream', 'string', 'syntax', 'template', 'terminal', 'thread',
  'token', 'typescript', 'variable', 'version', 'virtual', 'webhook', 'webpack',
  'websocket', 'yaml',
];

const STYLES = [
  { id: 'lorem', name: 'Classic Lorem', icon: AlignLeft, words: LOREM_WORDS },
  { id: 'hipster', name: 'Hipster Ipsum', icon: Sparkles, words: HIPSTER_WORDS },
  { id: 'tech', name: 'Tech Ipsum', icon: Code, words: TECH_WORDS },
];

function getRandomWords(wordList, count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(wordList[Math.floor(Math.random() * wordList.length)]);
  }
  return result;
}

function generateSentence(wordList, minWords = 6, maxWords = 16) {
  const count = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  const words = getRandomWords(wordList, count);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);

  // Add comma occasionally
  if (count > 8) {
    const commaPos = Math.floor(count * 0.4) + Math.floor(Math.random() * 3);
    if (commaPos < count - 1) words[commaPos] += ',';
  }

  return words.join(' ') + '.';
}

function generateParagraph(wordList, minSentences = 3, maxSentences = 7) {
  const count = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
  const sentences = [];
  for (let i = 0; i < count; i++) {
    sentences.push(generateSentence(wordList));
  }
  return sentences.join(' ');
}

function generateList(wordList, count = 5) {
  return Array.from({ length: count }, (_, i) => `${i + 1}. ${generateSentence(wordList, 4, 10)}`).join('\n');
}

function generateHTML(wordList, paragraphs = 3) {
  const lines = [];
  lines.push('<article>');
  const titleWords = getRandomWords(wordList, 4);
  titleWords[0] = titleWords[0].charAt(0).toUpperCase() + titleWords[0].slice(1);
  lines.push(`  <h1>${titleWords.join(' ')}</h1>`);
  lines.push('');
  for (let i = 0; i < paragraphs; i++) {
    lines.push(`  <p>${generateParagraph(wordList, 2, 4)}</p>`);
    lines.push('');
  }
  lines.push('  <ul>');
  for (let i = 0; i < 4; i++) {
    lines.push(`    <li>${generateSentence(wordList, 3, 8)}</li>`);
  }
  lines.push('  </ul>');
  lines.push('</article>');
  return lines.join('\n');
}

export default function LoremGenerator() {
  const [style, setStyle] = useState('lorem');
  const [genType, setGenType] = useState('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState('');
  const [key, setKey] = useState(0);
  const { copied, copyToClipboard } = useCopyToClipboard();

  const wordList = useMemo(() => STYLES.find(s => s.id === style)?.words || LOREM_WORDS, [style]);

  const generate = useCallback(() => {
    let result = '';
    switch (genType) {
      case 'paragraphs':
        result = Array.from({ length: count }, () => generateParagraph(wordList)).join('\n\n');
        break;
      case 'sentences':
        result = Array.from({ length: count }, () => generateSentence(wordList)).join(' ');
        break;
      case 'words':
        result = getRandomWords(wordList, count).join(' ');
        break;
      case 'list':
        result = generateList(wordList, count);
        break;
      case 'html':
        result = generateHTML(wordList, count);
        break;
    }

    if (startWithLorem && style === 'lorem' && result.length > 5) {
      result = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + result.slice(result.indexOf(' ', 20) + 1);
    }

    setOutput(result);
    setKey(k => k + 1);
  }, [wordList, genType, count, startWithLorem, style]);

  const stats = useMemo(() => {
    if (!output) return null;
    const words = output.split(/\s+/).filter(Boolean).length;
    const chars = output.length;
    const sentences = (output.match(/[.!?]+/g) || []).length;
    const paragraphs = output.split(/\n\n+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, sentences, paragraphs, readTime };
  }, [output]);

  const handleExport = useCallback(() => {
    if (!output) return;
    const ext = genType === 'html' ? 'html' : 'txt';
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `lorem-${Date.now()}.${ext}`; a.click();
    URL.revokeObjectURL(url);
  }, [output, genType]);

  const GEN_TYPES = [
    { id: 'paragraphs', label: 'Paragraphs', icon: AlignJustify, max: 20 },
    { id: 'sentences', label: 'Sentences', icon: AlignLeft, max: 50 },
    { id: 'words', label: 'Words', icon: Type, max: 500 },
    { id: 'list', label: 'List Items', icon: List, max: 30 },
    { id: 'html', label: 'HTML', icon: Code, max: 10 },
  ];

  const currentType = GEN_TYPES.find(t => t.id === genType);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><TextCursorInput size={22} /></div>
          <div>
            <h1 className="text-xl font-bold">Lorem Ipsum Generator</h1>
            <p className="text-xs opacity-50 mt-0.5">Generate placeholder text in multiple styles</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {output && (
            <>
              <button onClick={handleExport} className="btn btn-sm btn-ghost gap-1.5"><Download size={14} /> Export</button>
              <button onClick={() => setOutput('')} className="btn btn-sm btn-ghost btn-error gap-1.5"><Trash2 size={14} /> Clear</button>
            </>
          )}
        </div>
      </motion.div>

      {/* Style Selector */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <p className="text-[11px] font-bold uppercase tracking-wider opacity-40 mb-2.5 px-1">Text Style</p>
        <div className="grid grid-cols-3 gap-3">
          {STYLES.map(s => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              className={`section-card p-4 text-left transition-all hover:-translate-y-0.5 ${style === s.id ? 'border-primary/40 bg-primary/5 ring-1 ring-primary/20' : 'hover:border-primary/20'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <s.icon size={16} className={style === s.id ? 'text-primary' : 'opacity-40'} />
                <span className={`text-sm font-bold ${style === s.id ? 'text-primary' : ''}`}>{s.name}</span>
              </div>
              <p className="text-[10px] opacity-40 leading-tight">
                {s.id === 'lorem' && 'Traditional Latin placeholder text'}
                {s.id === 'hipster' && 'Trendy hipster-themed filler text'}
                {s.id === 'tech' && 'Developer & technology themed text'}
              </p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="section-card p-5 space-y-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider opacity-40 mb-2.5">Generate Type</p>
          <div className="flex flex-wrap gap-2">
            {GEN_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => { setGenType(t.id); setCount(Math.min(count, t.max)); }}
                className={`btn btn-sm gap-1.5 ${genType === t.id ? 'btn-primary' : 'btn-ghost border border-base-300'}`}
              >
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="field-label mb-0">Count: {count} {genType}</label>
            <span className="text-[10px] opacity-30">max {currentType?.max}</span>
          </div>
          <input type="range" min="1" max={currentType?.max || 20} value={count} onChange={(e) => setCount(parseInt(e.target.value))} className="range range-xs range-primary w-full" />
          <div className="flex justify-between mt-1">
            {[1, Math.floor((currentType?.max || 20) / 4), Math.floor((currentType?.max || 20) / 2), Math.floor((currentType?.max || 20) * 0.75), currentType?.max || 20].map(n => (
              <button key={n} onClick={() => setCount(n)} className="text-[9px] opacity-30 hover:opacity-60">{n}</button>
            ))}
          </div>
        </div>

        {style === 'lorem' && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="checkbox checkbox-xs checkbox-primary" checked={startWithLorem} onChange={(e) => setStartWithLorem(e.target.checked)} />
            <span className="text-xs opacity-60">Start with "Lorem ipsum dolor sit amet..."</span>
          </label>
        )}

        <button onClick={generate} className="btn btn-primary w-full gap-2">
          <RefreshCw size={16} /> Generate {genType.charAt(0).toUpperCase() + genType.slice(1)}
        </button>
      </motion.div>

      {/* Output */}
      <AnimatePresence mode="wait">
        {output && (
          <motion.div key={key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {[
                  { label: 'Words', value: stats.words, icon: Type, color: 'text-primary' },
                  { label: 'Characters', value: stats.chars, icon: Hash, color: 'text-secondary' },
                  { label: 'Sentences', value: stats.sentences, icon: AlignLeft, color: 'text-warning' },
                  { label: 'Paragraphs', value: stats.paragraphs, icon: Layers, color: 'text-info' },
                  { label: 'Read Time', value: `~${stats.readTime}m`, icon: FileText, color: 'text-success' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="section-card p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon size={12} className={color} />
                      <span className="text-[9px] font-bold uppercase tracking-wider opacity-50">{label}</span>
                    </div>
                    <span className="text-lg font-bold">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Result */}
            <div className="section-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Generated Text</h3>
                <div className="flex items-center gap-2">
                  <button onClick={generate} className="btn btn-xs btn-ghost gap-1"><RefreshCw size={12} /> Regenerate</button>
                  <button onClick={() => copyToClipboard(output)} className="btn btn-sm btn-primary gap-1.5">
                    {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="rounded-lg bg-base-200/50 p-5 max-h-[400px] overflow-y-auto scrollbar-thin">
                {genType === 'html' ? (
                  <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap">{output}</pre>
                ) : (
                  <div className="text-sm leading-relaxed opacity-70 whitespace-pre-wrap">{output}</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!output && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center mx-auto mb-4">
            <TextCursorInput size={28} className="opacity-30" />
          </div>
          <p className="text-sm font-medium opacity-50 mb-1">Configure and generate placeholder text</p>
          <p className="text-xs opacity-30">Choose a style, type, and count then hit Generate</p>
        </motion.div>
      )}
    </div>
  );
}
