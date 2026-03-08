import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  KeyRound, Copy, Check, AlertTriangle, ShieldCheck, ShieldX,
  Clock, ChevronDown, ChevronUp, Trash2, Info, Eye, EyeOff,
  FileText, RefreshCw, Sparkles, Download, Upload, Search,
  History, Edit3, Unlock,
  Diff, Timer, Shield, Layers, X, Maximize2, Minimize2,
  Link2, GitCompare, BookOpen, CheckCircle,
} from 'lucide-react';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';
import useLocalStorage from '../../hooks/useLocalStorage';

/* ══════════════════════════════════════════ */
/*           SAMPLE TOKENS                    */
/* ══════════════════════════════════════════ */
const SAMPLE_TOKENS = [
  {
    name: 'Basic User Token',
    desc: 'HS256, valid, user role',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjIsInJvbGUiOiJ1c2VyIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIn0.VbSBMgEccRXPCcRN3DGlXnBGMz-_E-s0GxGxTBKklY8',
  },
  {
    name: 'Admin Token (expired)',
    desc: 'HS256, expired, admin role + permissions',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODc2NTQzMjEwIiwibmFtZSI6IkFkbWluIFVzZXIiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjI0MjYyMiwicm9sZSI6ImFkbWluIiwicGVybWlzc2lvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ',
  },
  {
    name: 'RS256 Token',
    desc: 'Asymmetric, kid header, OpenID scopes',
    token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InJzYS1rZXktMSJ9.eyJpc3MiOiJodHRwczovL2F1dGguZXhhbXBsZS5jb20iLCJzdWIiOiJ1c2VyXzEyMyIsImF1ZCI6ImFwaS5leGFtcGxlLmNvbSIsImV4cCI6MTk5OTk5OTk5OSwiaWF0IjoxNjAwMDAwMDAwLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.signature_placeholder',
  },
  {
    name: 'OAuth2 Access Token',
    desc: 'ES256, multi-audience, scopes',
    token: 'eyJhbGciOiJFUzI1NiIsInR5cCI6ImF0K2p3dCIsImtpZCI6ImVjLWtleS0xIn0.eyJpc3MiOiJodHRwczovL29hdXRoLmV4YW1wbGUuY29tIiwic3ViIjoiY2xpZW50XzQ1NiIsImF1ZCI6WyJhcGkuZXhhbXBsZS5jb20iLCJhcGkyLmV4YW1wbGUuY29tIl0sImV4cCI6MTk5OTk5OTk5OSwiaWF0IjoxNzAwMDAwMDAwLCJzY29wZSI6InJlYWQgd3JpdGUgYWRtaW4iLCJjbGllbnRfaWQiOiJteS1hcHAiLCJqdGkiOiJ1bmlxdWUtdG9rZW4taWQtMTIzIn0.fake_es256_signature_here',
  },
  {
    name: 'Unsigned Token (none alg)',
    desc: '⚠️ No signature, insecure',
    token: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikluc2VjdXJlIFVzZXIiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTk5OTk5OTk5OSwicm9sZSI6ImFkbWluIn0.',
  },
];

/* ══════════════════════════════════════════ */
/*           HELPERS                          */
/* ══════════════════════════════════════════ */
function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  try { return JSON.parse(atob(base64)); } catch { return null; }
}

function base64UrlEncode(obj) {
  try {
    const json = JSON.stringify(obj);
    const b64 = btoa(json);
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch { return null; }
}

function decodeJwt(token) {
  const trimmed = token.trim();
  const parts = trimmed.split('.');
  if (parts.length !== 3) return { error: 'Invalid JWT: must have exactly 3 parts (header.payload.signature)' };
  const header = base64UrlDecode(parts[0]);
  if (!header) return { error: 'Invalid JWT header: could not decode base64url' };
  const payload = base64UrlDecode(parts[1]);
  if (!payload) return { error: 'Invalid JWT payload: could not decode base64url' };
  return { header, payload, signature: parts[2], raw: { header: parts[0], payload: parts[1], signature: parts[2] } };
}

function formatTimestamp(ts) {
  if (!ts && ts !== 0) return null;
  const d = new Date(ts * 1000);
  return { utc: d.toUTCString(), local: d.toLocaleString(), iso: d.toISOString(), relative: getRelativeTime(d) };
}

function getRelativeTime(date) {
  const now = new Date();
  const diffMs = date - now;
  const absDiff = Math.abs(diffMs);
  const isPast = diffMs < 0;
  if (absDiff < 60000) return isPast ? 'just now' : 'in a moment';
  if (absDiff < 3600000) { const m = Math.floor(absDiff / 60000); return isPast ? `${m}m ago` : `in ${m}m`; }
  if (absDiff < 86400000) { const h = Math.floor(absDiff / 3600000); return isPast ? `${h}h ago` : `in ${h}h`; }
  const d = Math.floor(absDiff / 86400000);
  return isPast ? `${d}d ago` : `in ${d}d`;
}

function isExpired(payload) {
  if (!payload?.exp) return null;
  return payload.exp * 1000 < Date.now();
}

function getTokenAge(payload) {
  if (!payload?.iat) return null;
  const diffMs = Date.now() - payload.iat * 1000;
  const days = Math.floor(diffMs / 86400000);
  const hours = Math.floor((diffMs % 86400000) / 3600000);
  return `${days}d ${hours}h`;
}

function getTokenLifetime(payload) {
  if (!payload?.iat || !payload?.exp) return null;
  const diff = payload.exp - payload.iat;
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`;
  return `${Math.floor(diff / 86400)}d ${Math.floor((diff % 86400) / 3600)}h`;
}

function getTokenSizeBytes(token) { return new TextEncoder().encode(token).length; }
function formatBytes(bytes) { return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(2)} KB`; }

function getTimeToExpiry(payload) {
  if (!payload?.exp) return null;
  const diff = payload.exp - Math.floor(Date.now() / 1000);
  if (diff <= 0) return null;
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  if (h > 24) return `${Math.floor(h / 24)}d ${h % 24}h`;
  return `${h}h ${m}m ${s}s`;
}

/* ── Claim descriptions ── */
const CLAIM_INFO = {
  iss: 'Issuer – Identifies who issued the JWT',
  sub: 'Subject – Identifies the principal subject',
  aud: 'Audience – Recipients the JWT is intended for',
  exp: 'Expiration Time – After this time, the JWT is invalid',
  nbf: 'Not Before – JWT is not valid before this time',
  iat: 'Issued At – Time at which the JWT was issued',
  jti: 'JWT ID – Unique identifier for this JWT',
  scope: 'Scope – Permissions/access levels granted',
  azp: 'Authorized Party – The party the token was issued to',
  nonce: 'Nonce – String value to associate a session with a token',
  auth_time: 'Authentication Time – When end-user authentication occurred',
  at_hash: 'Access Token Hash – Hash of the access token',
  c_hash: 'Code Hash – Hash of the authorization code',
  acr: 'Authentication Context Class Reference',
  amr: 'Authentication Methods References',
  sid: 'Session ID – Identifier for the session',
  client_id: 'Client ID – OAuth client identifier',
  name: 'Full Name – User\'s full name',
  email: 'Email – User\'s email address',
  email_verified: 'Email Verified – Whether the email is verified',
  picture: 'Picture – URL of the user\'s profile picture',
  role: 'Role – User\'s role in the system',
  roles: 'Roles – User\'s assigned roles',
  permissions: 'Permissions – Specific permissions granted',
  groups: 'Groups – Group memberships',
  org_id: 'Organization ID – Organization identifier',
  tenant: 'Tenant – Multi-tenant identifier',
};

const ALGO_INFO = {
  HS256: { name: 'HMAC SHA-256', type: 'Symmetric', strength: 'Good', keySize: '256-bit', family: 'HMAC' },
  HS384: { name: 'HMAC SHA-384', type: 'Symmetric', strength: 'Strong', keySize: '384-bit', family: 'HMAC' },
  HS512: { name: 'HMAC SHA-512', type: 'Symmetric', strength: 'Very Strong', keySize: '512-bit', family: 'HMAC' },
  RS256: { name: 'RSA SHA-256', type: 'Asymmetric', strength: 'Good', keySize: '2048+ bit', family: 'RSA' },
  RS384: { name: 'RSA SHA-384', type: 'Asymmetric', strength: 'Strong', keySize: '2048+ bit', family: 'RSA' },
  RS512: { name: 'RSA SHA-512', type: 'Asymmetric', strength: 'Very Strong', keySize: '2048+ bit', family: 'RSA' },
  ES256: { name: 'ECDSA P-256', type: 'Asymmetric', strength: 'Good', keySize: '256-bit', family: 'ECDSA' },
  ES384: { name: 'ECDSA P-384', type: 'Asymmetric', strength: 'Strong', keySize: '384-bit', family: 'ECDSA' },
  ES512: { name: 'ECDSA P-521', type: 'Asymmetric', strength: 'Very Strong', keySize: '521-bit', family: 'ECDSA' },
  PS256: { name: 'RSA-PSS SHA-256', type: 'Asymmetric', strength: 'Good', keySize: '2048+ bit', family: 'RSA-PSS' },
  PS384: { name: 'RSA-PSS SHA-384', type: 'Asymmetric', strength: 'Strong', keySize: '2048+ bit', family: 'RSA-PSS' },
  PS512: { name: 'RSA-PSS SHA-512', type: 'Asymmetric', strength: 'Very Strong', keySize: '2048+ bit', family: 'RSA-PSS' },
  EdDSA: { name: 'EdDSA (Ed25519)', type: 'Asymmetric', strength: 'Very Strong', keySize: '256-bit', family: 'EdDSA' },
  none: { name: 'None (Unsigned)', type: 'None', strength: '⚠ Insecure', keySize: 'N/A', family: 'None' },
};

/* ── Security audit checks ── */
function runSecurityAudit(header, payload) {
  const issues = [];
  const warnings = [];
  const info = [];

  if (header?.alg === 'none')
    issues.push({ severity: 'critical', message: 'Token uses "none" algorithm — no signature verification', fix: 'Use a secure algorithm like RS256 or ES256' });
  if (header?.alg?.startsWith('HS') && payload?.iss?.startsWith('http'))
    warnings.push({ severity: 'warning', message: 'Symmetric algorithm used with public issuer — consider asymmetric signing', fix: 'Switch to RS256 or ES256 for public/multi-service architectures' });
  if (!payload?.exp)
    warnings.push({ severity: 'warning', message: 'No expiration claim (exp) — token never expires', fix: 'Always include an exp claim to limit token lifetime' });
  if (payload?.exp && payload?.iat) {
    const lifetime = payload.exp - payload.iat;
    if (lifetime > 86400 * 30)
      warnings.push({ severity: 'warning', message: `Token lifetime is very long (${Math.floor(lifetime / 86400)} days)`, fix: 'Consider shorter token lifetimes with refresh tokens' });
  }
  if (isExpired(payload))
    issues.push({ severity: 'critical', message: 'Token is expired and should not be accepted', fix: 'Obtain a new token from the issuer' });
  if (payload?.nbf && payload.nbf * 1000 > Date.now())
    warnings.push({ severity: 'warning', message: 'Token is not yet valid (nbf claim is in the future)', fix: 'Wait until the nbf timestamp to use this token' });
  if (!payload?.iss) info.push({ severity: 'info', message: 'No issuer claim (iss) — origin cannot be verified', fix: 'Include an iss claim for token provenance' });
  if (!payload?.sub) info.push({ severity: 'info', message: 'No subject claim (sub) — identity not specified', fix: 'Include a sub claim to identify the principal' });
  if (!payload?.aud) info.push({ severity: 'info', message: 'No audience claim (aud) — recipient not restricted', fix: 'Include an aud claim to prevent token misuse across services' });
  if (!payload?.jti) info.push({ severity: 'info', message: 'No JWT ID (jti) — replay attacks cannot be detected', fix: 'Include jti for token uniqueness and replay protection' });
  if (header?.kid) info.push({ severity: 'info', message: `Key ID (kid) present: "${header.kid}" — supports key rotation` });

  const sensitiveFields = ['password', 'secret', 'ssn', 'credit_card', 'cc_number', 'pin'];
  Object.keys(payload || {}).forEach(k => {
    if (sensitiveFields.includes(k.toLowerCase()))
      issues.push({ severity: 'critical', message: `Sensitive field "${k}" found in payload — JWTs are not encrypted`, fix: 'Never include secrets in JWT payloads. Use JWE for encrypted tokens.' });
  });

  return { issues, warnings, info, score: Math.max(0, 100 - issues.length * 30 - warnings.length * 15 - info.length * 5) };
}

/* ══════════════════════════════════════════ */
/*         JSON SECTION COMPONENT            */
/* ══════════════════════════════════════════ */
function JsonSection({ title, icon: Icon, color, data, copyToClipboard, copied, showClaimInfo = false, searchTerm = '' }) {
  const [collapsed, setCollapsed] = useState(false);

  const matchesSearch = useCallback((key, value) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return key.toLowerCase().includes(term) || String(value).toLowerCase().includes(term) || (CLAIM_INFO[key]?.toLowerCase().includes(term));
  }, [searchTerm]);

  const filteredEntries = useMemo(() => Object.entries(data).filter(([key, value]) => matchesSearch(key, value)), [data, matchesSearch]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="section-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-base-200/40 transition-colors" onClick={() => setCollapsed(c => !c)}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}><Icon size={15} className="text-white" /></div>
          <span className="text-sm font-semibold">{title}</span>
          <span className="badge badge-ghost badge-xs">{filteredEntries.length}/{Object.keys(data).length} fields</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); copyToClipboard(JSON.stringify(data, null, 2)); }} className="btn btn-ghost btn-xs gap-1">
            {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
            <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          {collapsed ? <ChevronDown size={16} className="opacity-40" /> : <ChevronUp size={16} className="opacity-40" />}
        </div>
      </div>
      <AnimatePresence>
        {!collapsed && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-5 pb-4 space-y-1.5">
              {filteredEntries.length === 0 && searchTerm && <p className="text-xs opacity-40 text-center py-4">No matching claims found</p>}
              {filteredEntries.map(([key, value]) => {
                const isTimestamp = ['exp', 'iat', 'nbf', 'auth_time'].includes(key) && typeof value === 'number';
                const formatted = isTimestamp ? formatTimestamp(value) : null;
                const claimDesc = showClaimInfo ? CLAIM_INFO[key] : null;
                return (
                  <div key={key} className="group rounded-lg px-3 py-2.5 hover:bg-base-200/60 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-primary">{key}</span>
                          {claimDesc && (<div className="tooltip tooltip-right" data-tip={claimDesc}><Info size={12} className="opacity-30 hover:opacity-70 transition-opacity cursor-help" /></div>)}
                          <span className="text-[9px] opacity-30 font-mono">{Array.isArray(value) ? 'array' : typeof value}</span>
                        </div>
                        <div className="mt-1">
                          {Array.isArray(value) ? (
                            <div className="flex flex-wrap gap-1.5 mt-0.5">{value.map((v, i) => <span key={i} className="badge badge-sm badge-ghost font-mono">{String(v)}</span>)}</div>
                          ) : typeof value === 'object' && value !== null ? (
                            <pre className="text-xs font-mono opacity-70 whitespace-pre-wrap mt-0.5">{JSON.stringify(value, null, 2)}</pre>
                          ) : typeof value === 'boolean' ? (
                            <span className={`badge badge-sm ${value ? 'badge-success' : 'badge-error'}`}>{String(value)}</span>
                          ) : (
                            <span className="text-sm font-mono opacity-70 break-all">{String(value)}</span>
                          )}
                        </div>
                        {formatted && (
                          <div className="flex flex-wrap gap-2 mt-1.5">
                            <span className="badge badge-xs badge-ghost font-mono gap-1"><Clock size={10} /> {formatted.local}</span>
                            <span className="badge badge-xs badge-ghost">{formatted.relative}</span>
                            {key === 'exp' && !isExpired({ exp: value }) && <span className="badge badge-xs badge-success gap-1"><Timer size={10} /> Expires {formatted.relative}</span>}
                          </div>
                        )}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); copyToClipboard(typeof value === 'object' ? JSON.stringify(value) : String(value)); }} className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-60 transition-opacity"><Copy size={11} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ══════════════════════════════════════════ */
/*         PAYLOAD EDITOR COMPONENT          */
/* ══════════════════════════════════════════ */
function PayloadEditor({ decoded, onTokenRebuilt }) {
  const [editJson, setEditJson] = useState('');
  const [editError, setEditError] = useState('');
  const [editTarget, setEditTarget] = useState('payload');
  const { copied, copyToClipboard } = useCopyToClipboard();

  useEffect(() => {
    if (decoded && !decoded.error) {
      setEditJson(JSON.stringify(editTarget === 'header' ? decoded.header : decoded.payload, null, 2));
      setEditError('');
    }
  }, [decoded, editTarget]);

  const handleRebuild = useCallback(() => {
    try {
      const parsed = JSON.parse(editJson);
      const newHeader = editTarget === 'header' ? parsed : decoded.header;
      const newPayload = editTarget === 'payload' ? parsed : decoded.payload;
      const encodedHeader = base64UrlEncode(newHeader);
      const encodedPayload = base64UrlEncode(newPayload);
      if (!encodedHeader || !encodedPayload) { setEditError('Failed to encode JSON'); return; }
      onTokenRebuilt(`${encodedHeader}.${encodedPayload}.${decoded.signature}`);
      setEditError('');
    } catch (e) { setEditError(`Invalid JSON: ${e.message}`); }
  }, [editJson, editTarget, decoded, onTokenRebuilt]);

  if (!decoded || decoded.error) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="section-card overflow-hidden">
      <div className="px-5 py-3.5 flex items-center justify-between border-b border-base-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-warning flex items-center justify-center"><Edit3 size={15} className="text-white" /></div>
          <span className="text-sm font-semibold">Payload Editor</span>
          <span className="badge badge-warning badge-xs">Experimental</span>
        </div>
        <div className="tabs tabs-box tabs-xs">
          <button className={`tab ${editTarget === 'header' ? 'tab-active' : ''}`} onClick={() => setEditTarget('header')}>Header</button>
          <button className={`tab ${editTarget === 'payload' ? 'tab-active' : ''}`} onClick={() => setEditTarget('payload')}>Payload</button>
        </div>
      </div>
      <div className="p-5 space-y-3">
        <textarea value={editJson} onChange={(e) => { setEditJson(e.target.value); setEditError(''); }} className="textarea w-full font-mono text-xs leading-relaxed" rows={8} spellCheck={false} />
        {editError && <p className="text-xs text-error flex items-center gap-1.5"><AlertTriangle size={12} /> {editError}</p>}
        <div className="flex items-center gap-2">
          <button onClick={handleRebuild} className="btn btn-sm btn-warning gap-1.5"><RefreshCw size={14} /> Rebuild Token</button>
          <button onClick={() => copyToClipboard(editJson)} className="btn btn-sm btn-ghost gap-1.5">{copied ? <Check size={14} className="text-success" /> : <Copy size={14} />} Copy JSON</button>
        </div>
        <p className="text-[10px] opacity-40 flex items-center gap-1"><AlertTriangle size={10} /> Rebuilding modifies the unsigned payload. The original signature will no longer be valid.</p>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════ */
/*         TOKEN COMPARE COMPONENT           */
/* ══════════════════════════════════════════ */
function TokenCompare({ primaryDecoded }) {
  const [compareToken, setCompareToken] = useState('');
  const compareDecoded = useMemo(() => compareToken.trim() ? decodeJwt(compareToken) : null, [compareToken]);

  const differences = useMemo(() => {
    if (!primaryDecoded || primaryDecoded.error || !compareDecoded || compareDecoded.error) return null;
    const diffs = { header: [], payload: [] };
    const allHeaderKeys = new Set([...Object.keys(primaryDecoded.header), ...Object.keys(compareDecoded.header)]);
    allHeaderKeys.forEach(key => {
      if (JSON.stringify(primaryDecoded.header[key]) !== JSON.stringify(compareDecoded.header[key]))
        diffs.header.push({ key, left: primaryDecoded.header[key], right: compareDecoded.header[key] });
    });
    const allPayloadKeys = new Set([...Object.keys(primaryDecoded.payload), ...Object.keys(compareDecoded.payload)]);
    allPayloadKeys.forEach(key => {
      if (JSON.stringify(primaryDecoded.payload[key]) !== JSON.stringify(compareDecoded.payload[key]))
        diffs.payload.push({ key, left: primaryDecoded.payload[key], right: compareDecoded.payload[key] });
    });
    return diffs;
  }, [primaryDecoded, compareDecoded]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="section-card overflow-hidden">
      <div className="px-5 py-3.5 flex items-center gap-2.5 border-b border-base-200">
        <div className="w-8 h-8 rounded-lg bg-info flex items-center justify-center"><GitCompare size={15} className="text-white" /></div>
        <span className="text-sm font-semibold">Token Comparison</span>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className="field-label">Paste second token to compare</label>
          <textarea value={compareToken} onChange={(e) => setCompareToken(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIs..." rows={3} className="textarea w-full font-mono text-xs" spellCheck={false} />
        </div>
        {compareDecoded?.error && <div className="alert alert-error py-2"><AlertTriangle size={14} /> <span className="text-xs">{compareDecoded.error}</span></div>}
        {differences && (
          <div className="space-y-3">
            <div className="flex items-center gap-2"><Diff size={14} className="text-info" /><span className="text-xs font-semibold">{differences.header.length + differences.payload.length} difference(s) found</span></div>
            {['header', 'payload'].map(section => differences[section].length > 0 && (
              <div key={section} className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider opacity-50">{section}</span>
                {differences[section].map(({ key, left, right }) => (
                  <div key={key} className="rounded-lg bg-base-200/50 p-3 space-y-1.5">
                    <span className="font-mono text-xs font-semibold text-primary">{key}</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded bg-error/10 p-2"><span className="text-[10px] opacity-50 block mb-1">Token 1</span><span className="font-mono text-xs break-all">{left === undefined ? '—' : JSON.stringify(left)}</span></div>
                      <div className="rounded bg-success/10 p-2"><span className="text-[10px] opacity-50 block mb-1">Token 2</span><span className="font-mono text-xs break-all">{right === undefined ? '—' : JSON.stringify(right)}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {differences.header.length + differences.payload.length === 0 && (
              <div className="text-center py-4"><CheckCircle size={20} className="text-success mx-auto mb-2" /><p className="text-xs opacity-50">Tokens are identical (header + payload)</p></div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════ */
/*       SECURITY AUDIT COMPONENT            */
/* ══════════════════════════════════════════ */
function SecurityAudit({ header, payload }) {
  const audit = useMemo(() => runSecurityAudit(header, payload), [header, payload]);
  const [expanded, setExpanded] = useState(false);
  const scoreColor = audit.score >= 80 ? 'text-success' : audit.score >= 50 ? 'text-warning' : 'text-error';
  const scoreBg = audit.score >= 80 ? 'bg-success/10' : audit.score >= 50 ? 'bg-warning/10' : 'bg-error/10';

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="section-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-base-200/40 transition-colors" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center"><Shield size={15} className="text-white" /></div>
          <span className="text-sm font-semibold">Security Audit</span>
          <div className="flex items-center gap-1.5 ml-1">
            {audit.issues.length > 0 && <span className="badge badge-xs badge-error">{audit.issues.length} critical</span>}
            {audit.warnings.length > 0 && <span className="badge badge-xs badge-warning">{audit.warnings.length} warnings</span>}
            {audit.info.length > 0 && <span className="badge badge-xs badge-info">{audit.info.length} info</span>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`${scoreBg} px-3 py-1 rounded-lg`}><span className={`text-sm font-bold ${scoreColor}`}>{audit.score}/100</span></div>
          {expanded ? <ChevronUp size={16} className="opacity-40" /> : <ChevronDown size={16} className="opacity-40" />}
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-5 pb-4 space-y-2">
              <div className="h-2 rounded-full bg-base-200 overflow-hidden mb-3">
                <motion.div initial={{ width: 0 }} animate={{ width: `${audit.score}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${audit.score >= 80 ? 'bg-success' : audit.score >= 50 ? 'bg-warning' : 'bg-error'}`} />
              </div>
              {[...audit.issues, ...audit.warnings, ...audit.info].map((item, i) => (
                <div key={i} className={`rounded-lg p-3 flex items-start gap-3 ${item.severity === 'critical' ? 'bg-error/8 border border-error/20' : item.severity === 'warning' ? 'bg-warning/8 border border-warning/20' : 'bg-info/8 border border-info/20'}`}>
                  {item.severity === 'critical' ? <ShieldX size={16} className="text-error shrink-0 mt-0.5" /> : item.severity === 'warning' ? <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" /> : <Info size={16} className="text-info shrink-0 mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{item.message}</p>
                    {item.fix && <p className="text-[10px] opacity-50 mt-1">💡 {item.fix}</p>}
                  </div>
                </div>
              ))}
              {audit.issues.length === 0 && audit.warnings.length === 0 && (
                <div className="text-center py-4"><ShieldCheck size={24} className="text-success mx-auto mb-2" /><p className="text-xs opacity-60 font-medium">No critical issues or warnings detected</p></div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ══════════════════════════════════════════ */
/*        TOKEN HISTORY COMPONENT            */
/* ══════════════════════════════════════════ */
function TokenHistory({ history, onLoad, onClear }) {
  const [expanded, setExpanded] = useState(false);
  if (history.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="section-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-base-200/40 transition-colors" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center"><History size={15} className="text-white" /></div>
          <span className="text-sm font-semibold">Recent Tokens</span>
          <span className="badge badge-ghost badge-xs">{history.length}</span>
        </div>
        <div className="flex items-center gap-2">
          {expanded && <button onClick={(e) => { e.stopPropagation(); onClear(); }} className="btn btn-ghost btn-xs btn-error gap-1"><Trash2 size={12} /> Clear</button>}
          {expanded ? <ChevronUp size={16} className="opacity-40" /> : <ChevronDown size={16} className="opacity-40" />}
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-5 pb-4 space-y-1.5 max-h-64 overflow-y-auto scrollbar-thin">
              {history.map((item, i) => (
                <button key={i} onClick={() => onLoad(item.token)} className="w-full text-left rounded-lg px-3 py-2.5 hover:bg-base-200/60 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`badge badge-xs ${item.expired ? 'badge-error' : 'badge-success'}`}>{item.alg || '?'}</span>
                      <span className="text-xs font-mono truncate opacity-70">{item.sub || item.name || 'Unknown'}</span>
                    </div>
                    <span className="text-[10px] opacity-30 shrink-0">{item.timestamp}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ══════════════════════════════════════════ */
/*      EXPIRY COUNTDOWN COMPONENT           */
/* ══════════════════════════════════════════ */
function ExpiryCountdown({ payload }) {
  const [timeLeft, setTimeLeft] = useState(getTimeToExpiry(payload));
  useEffect(() => {
    if (!payload?.exp || isExpired(payload)) return;
    const interval = setInterval(() => setTimeLeft(getTimeToExpiry(payload)), 1000);
    return () => clearInterval(interval);
  }, [payload]);
  if (!payload?.exp || isExpired(payload)) return null;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="alert border-success/20 bg-success/5">
      <Timer size={18} className="text-success" />
      <div>
        <p className="font-semibold text-sm text-success">Token Active — Expires in {timeLeft}</p>
        <p className="text-xs opacity-50 mt-0.5">Live countdown • Expiration: {formatTimestamp(payload.exp)?.local}</p>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════ */
/*              JWT DECODER                */
/* ════════════════════════════════════════ */
export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [showSignature, setShowSignature] = useState(false);
  const [activeTab, setActiveTab] = useState('decode');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedView, setExpandedView] = useState(false);
  const [tokenHistory, setTokenHistory] = useLocalStorage('jwt-decoder-history', []);
  const { copied, copyToClipboard } = useCopyToClipboard();
  const textareaRef = useRef(null);

  const decoded = useMemo(() => token.trim() ? decodeJwt(token) : null, [token]);
  const expired = useMemo(() => decoded && !decoded.error ? isExpired(decoded.payload) : null, [decoded]);
  const tokenAge = useMemo(() => decoded && !decoded.error ? getTokenAge(decoded.payload) : null, [decoded]);
  const tokenLifetime = useMemo(() => decoded && !decoded.error ? getTokenLifetime(decoded.payload) : null, [decoded]);
  const algoInfo = useMemo(() => decoded && !decoded.error ? (ALGO_INFO[decoded.header?.alg] || null) : null, [decoded]);
  const tokenSize = useMemo(() => token.trim() ? getTokenSizeBytes(token) : null, [token]);

  useEffect(() => {
    if (decoded && !decoded.error) {
      const entry = { token: token.trim(), alg: decoded.header?.alg, sub: decoded.payload?.sub, name: decoded.payload?.name, expired: isExpired(decoded.payload), timestamp: new Date().toLocaleTimeString() };
      setTokenHistory(prev => { if (prev.find(h => h.token === entry.token)) return prev; return [entry, ...prev].slice(0, 20); });
    }
  }, [decoded]);

  const handleClear = useCallback(() => { setToken(''); setSearchTerm(''); }, []);
  const handleLoadSample = useCallback((sampleToken) => setToken(sampleToken), []);
  const handleTokenRebuilt = useCallback((newToken) => setToken(newToken), []);
  const handlePasteFromClipboard = useCallback(async () => { try { setToken(await navigator.clipboard.readText()); } catch {} }, []);

  const handleExportDecoded = useCallback(() => {
    if (!decoded || decoded.error) return;
    const blob = new Blob([JSON.stringify({ header: decoded.header, payload: decoded.payload, signature: decoded.signature, metadata: { algorithm: decoded.header?.alg, expired: isExpired(decoded.payload), tokenAge: getTokenAge(decoded.payload), tokenLifetime: getTokenLifetime(decoded.payload), sizeBytes: getTokenSizeBytes(token), decodedAt: new Date().toISOString() } }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `jwt-decoded-${Date.now()}.json`; a.click(); URL.revokeObjectURL(url);
  }, [decoded, token]);

  const coloredParts = useMemo(() => {
    if (!token.trim()) return null;
    const parts = token.trim().split('.');
    return parts.length === 3 ? { header: parts[0], payload: parts[1], signature: parts[2] } : null;
  }, [token]);

  const TABS = [
    { id: 'decode', label: 'Decode', icon: Unlock },
    { id: 'editor', label: 'Editor', icon: Edit3 },
    { id: 'compare', label: 'Compare', icon: GitCompare },
  ];

  return (
    <div className={`mx-auto space-y-6 ${expandedView ? 'max-w-6xl' : 'max-w-4xl'}`}>
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><KeyRound size={22} /></div>
          <div>
            <h1 className="text-xl font-bold">JWT Decoder</h1>
            <p className="text-xs opacity-50 mt-0.5">Decode, inspect, audit & compare JSON Web Tokens</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handlePasteFromClipboard} className="btn btn-sm btn-ghost gap-1.5"><Upload size={14} /> Paste</button>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-sm btn-outline gap-2"><Sparkles size={14} /> Samples</div>
            <ul tabIndex={0} className="dropdown-content z-[10] menu p-2 shadow-lg bg-base-100 rounded-xl w-64 border border-base-300">
              {SAMPLE_TOKENS.map((s) => (
                <li key={s.name}><button onClick={() => handleLoadSample(s.token)} className="flex flex-col items-start gap-0.5 py-2"><span className="text-xs font-medium">{s.name}</span><span className="text-[10px] opacity-40">{s.desc}</span></button></li>
              ))}
            </ul>
          </div>
          {decoded && !decoded.error && (
            <>
              <button onClick={handleExportDecoded} className="btn btn-sm btn-ghost gap-1.5"><Download size={14} /> Export</button>
              <button onClick={() => setExpandedView(v => !v)} className="btn btn-sm btn-ghost gap-1.5">{expandedView ? <Minimize2 size={14} /> : <Maximize2 size={14} />}</button>
            </>
          )}
          {token && <button onClick={handleClear} className="btn btn-sm btn-ghost btn-error gap-1.5"><Trash2 size={14} /> Clear</button>}
        </div>
      </motion.div>

      {/* ── Token Input ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="section-card p-5">
        <div className="flex items-center justify-between mb-2">
          <label className="field-label mb-0">Paste JWT Token</label>
          {tokenSize && <span className="text-[10px] opacity-40 font-mono">{formatBytes(tokenSize)} • {token.trim().split('.').length} parts</span>}
        </div>
        <textarea ref={textareaRef} value={token} onChange={(e) => setToken(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkw..." rows={4} className="textarea w-full font-mono text-xs leading-relaxed" spellCheck={false} />
        {coloredParts && !decoded?.error && (
          <div className="mt-3 p-3 rounded-lg bg-base-200/50 font-mono text-xs break-all leading-relaxed">
            <span className="text-error font-medium">{coloredParts.header}</span><span className="opacity-40">.</span>
            <span className="text-primary font-medium">{coloredParts.payload}</span><span className="opacity-40">.</span>
            <span className="text-success font-medium">{coloredParts.signature}</span>
            <div className="flex gap-4 mt-2 pt-2 border-t border-base-300">
              <span className="flex items-center gap-1.5 text-[10px]"><span className="w-2 h-2 rounded-full bg-error" /> Header ({coloredParts.header.length} chars)</span>
              <span className="flex items-center gap-1.5 text-[10px]"><span className="w-2 h-2 rounded-full bg-primary" /> Payload ({coloredParts.payload.length} chars)</span>
              <span className="flex items-center gap-1.5 text-[10px]"><span className="w-2 h-2 rounded-full bg-success" /> Signature ({coloredParts.signature.length} chars)</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Error ── */}
      <AnimatePresence>
        {decoded?.error && <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="alert alert-error"><AlertTriangle size={18} /><span className="text-sm font-medium">{decoded.error}</span></motion.div>}
      </AnimatePresence>

      {/* ── Tab Navigation ── */}
      {decoded && !decoded.error && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="tabs tabs-box tabs-sm">
            {TABS.map(tab => <button key={tab.id} className={`tab gap-1.5 ${activeTab === tab.id ? 'tab-active' : ''}`} onClick={() => setActiveTab(tab.id)}><tab.icon size={13} /> {tab.label}</button>)}
          </div>
        </motion.div>
      )}

      {/* ── Decoded Content ── */}
      <AnimatePresence mode="wait">
        {decoded && !decoded.error && activeTab === 'decode' && (
          <motion.div key="decode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Status Bar */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className={`section-card p-4 ${expired === true ? 'border-error/30' : expired === false ? 'border-success/30' : ''}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  {expired === true ? <ShieldX size={16} className="text-error" /> : expired === false ? <ShieldCheck size={16} className="text-success" /> : <Clock size={16} className="opacity-40" />}
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">Status</span>
                </div>
                <span className={`text-sm font-bold ${expired === true ? 'text-error' : expired === false ? 'text-success' : 'opacity-50'}`}>{expired === true ? 'Expired' : expired === false ? 'Valid' : 'No expiry'}</span>
              </div>
              <div className="section-card p-4"><div className="flex items-center gap-2 mb-1.5"><KeyRound size={16} className="text-primary" /><span className="text-[10px] font-bold uppercase tracking-wider opacity-50">Algorithm</span></div><span className="text-sm font-bold">{decoded.header?.alg || 'Unknown'}</span></div>
              <div className="section-card p-4"><div className="flex items-center gap-2 mb-1.5"><FileText size={16} className="text-secondary" /><span className="text-[10px] font-bold uppercase tracking-wider opacity-50">Type</span></div><span className="text-sm font-bold">{decoded.header?.typ || 'N/A'}</span></div>
              <div className="section-card p-4"><div className="flex items-center gap-2 mb-1.5"><Clock size={16} className="text-warning" /><span className="text-[10px] font-bold uppercase tracking-wider opacity-50">Age</span></div><span className="text-sm font-bold">{tokenAge || 'N/A'}</span></div>
              <div className="section-card p-4"><div className="flex items-center gap-2 mb-1.5"><Timer size={16} className="text-info" /><span className="text-[10px] font-bold uppercase tracking-wider opacity-50">Lifetime</span></div><span className="text-sm font-bold">{tokenLifetime || 'N/A'}</span></div>
              <div className="section-card p-4"><div className="flex items-center gap-2 mb-1.5"><Layers size={16} className="text-accent" /><span className="text-[10px] font-bold uppercase tracking-wider opacity-50">Size</span></div><span className="text-sm font-bold">{tokenSize ? formatBytes(tokenSize) : 'N/A'}</span></div>
            </motion.div>

            <ExpiryCountdown payload={decoded.payload} />

            {algoInfo && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="section-card px-5 py-3.5 flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold opacity-60">Algorithm:</span>
                <span className="badge badge-sm badge-primary">{algoInfo.name}</span>
                <span className="badge badge-sm badge-ghost">{algoInfo.type}</span>
                <span className={`badge badge-sm ${algoInfo.strength === '⚠ Insecure' ? 'badge-error' : 'badge-success'}`}>{algoInfo.strength}</span>
                <span className="badge badge-sm badge-ghost">{algoInfo.keySize}</span>
                <span className="badge badge-sm badge-ghost">Family: {algoInfo.family}</span>
                {decoded.header?.kid && <span className="badge badge-sm badge-info gap-1"><Link2 size={10} /> kid: {decoded.header.kid}</span>}
              </motion.div>
            )}

            {/* Search Claims */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search claims (e.g. email, exp, role...)" className="input input-sm w-full pl-9 font-mono" />
              {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs"><X size={12} /></button>}
            </motion.div>

            <SecurityAudit header={decoded.header} payload={decoded.payload} />
            <JsonSection title="Header" icon={KeyRound} color="bg-error" data={decoded.header} copyToClipboard={copyToClipboard} copied={copied} searchTerm={searchTerm} />
            <JsonSection title="Payload" icon={FileText} color="bg-primary" data={decoded.payload} copyToClipboard={copyToClipboard} copied={copied} showClaimInfo searchTerm={searchTerm} />

            {/* Signature Section */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="section-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-base-200/40 transition-colors" onClick={() => setShowSignature(s => !s)}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-success flex items-center justify-center">{showSignature ? <Eye size={15} className="text-white" /> : <EyeOff size={15} className="text-white" />}</div>
                  <span className="text-sm font-semibold">Signature</span>
                  <span className="badge badge-ghost badge-xs">{decoded.signature.length} chars</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); copyToClipboard(decoded.signature); }} className="btn btn-ghost btn-xs gap-1">{copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}<span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span></button>
                  {showSignature ? <ChevronUp size={16} className="opacity-40" /> : <ChevronDown size={16} className="opacity-40" />}
                </div>
              </div>
              <AnimatePresence>
                {showSignature && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <div className="px-5 pb-4">
                      <div className="p-3 rounded-lg bg-base-200/50 font-mono text-xs break-all leading-relaxed opacity-70">{decoded.signature || '(empty — unsigned token)'}</div>
                      <p className="text-[10px] opacity-40 mt-2 flex items-center gap-1"><Info size={10} /> Signature verification requires the secret key or public key and is not performed client-side.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Copy Actions */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 flex-wrap">
              <button onClick={() => copyToClipboard(JSON.stringify({ header: decoded.header, payload: decoded.payload }, null, 2))} className="btn btn-sm btn-outline gap-1.5">{copied ? <Check size={14} className="text-success" /> : <Copy size={14} />} Copy Full Decoded JSON</button>
              <button onClick={() => copyToClipboard(token.trim())} className="btn btn-sm btn-ghost gap-1.5"><Copy size={14} /> Copy Raw Token</button>
            </motion.div>

            {decoded.header?.alg === 'none' && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="alert alert-error"><AlertTriangle size={18} /><div><p className="font-semibold text-sm">Security Warning: Unsigned Token</p><p className="text-xs opacity-70 mt-0.5">This token uses the "none" algorithm and has no signature verification. It should never be trusted in production.</p></div></motion.div>
            )}
            {expired === true && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="alert alert-warning"><Clock size={18} /><div><p className="font-semibold text-sm">Token Expired</p><p className="text-xs opacity-70 mt-0.5">This token expired on {formatTimestamp(decoded.payload.exp)?.local}. It should no longer be accepted by servers.</p></div></motion.div>
            )}
          </motion.div>
        )}

        {decoded && !decoded.error && activeTab === 'editor' && (
          <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PayloadEditor decoded={decoded} onTokenRebuilt={handleTokenRebuilt} /></motion.div>
        )}

        {decoded && !decoded.error && activeTab === 'compare' && (
          <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><TokenCompare primaryDecoded={decoded} /></motion.div>
        )}
      </AnimatePresence>

      <TokenHistory history={tokenHistory} onLoad={handleLoadSample} onClear={() => setTokenHistory([])} />

      {/* ── Empty State ── */}
      {!token.trim() && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center mx-auto mb-4"><KeyRound size={28} className="opacity-30" /></div>
          <p className="text-sm font-medium opacity-50 mb-1">Paste a JWT token above to decode it</p>
          <p className="text-xs opacity-30 mb-6">Or try a sample token to explore the interface</p>
          <div className="max-w-md mx-auto text-left section-card p-5">
            <h3 className="text-xs font-semibold flex items-center gap-2 mb-3"><BookOpen size={13} className="text-primary" /> JWT Quick Reference</h3>
            <div className="space-y-2">
              {[
                { label: 'Structure', value: 'header.payload.signature (base64url encoded)' },
                { label: 'Header', value: 'Algorithm (alg) + Token type (typ)' },
                { label: 'Payload', value: 'Claims: iss, sub, aud, exp, iat, custom...' },
                { label: 'Signature', value: 'HMAC or RSA/ECDSA of header + payload' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-2 text-xs">
                  <span className="font-mono font-bold text-primary shrink-0 w-16">{item.label}</span>
                  <span className="opacity-50">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
