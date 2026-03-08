export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function getStatusColor(status) {
  if (status >= 200 && status < 300) return 'text-success';
  if (status >= 300 && status < 400) return 'text-warning';
  if (status >= 400 && status < 500) return 'text-warning';
  if (status >= 500) return 'text-error';
  return 'opacity-40';
}

export function getStatusBadge(status) {
  if (status >= 200 && status < 300) return 'badge-success';
  if (status >= 300 && status < 400) return 'badge-warning';
  if (status >= 400 && status < 500) return 'badge-warning';
  if (status >= 500) return 'badge-error';
  return 'badge-ghost';
}

export function prettyJSON(data) {
  try {
    if (typeof data === 'string') {
      return JSON.stringify(JSON.parse(data), null, 2);
    }
    return JSON.stringify(data, null, 2);
  } catch {
    return typeof data === 'string' ? data : String(data);
  }
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function truncate(str, maxLen = 50) {
  if (!str) return '';
  return str.length > maxLen ? str.substring(0, maxLen) + '...' : str;
}

// DaisyUI badge classes for HTTP methods
export const METHOD_COLORS = {
  GET: 'badge-success',
  POST: 'badge-info',
  PUT: 'badge-warning',
  PATCH: 'badge-secondary',
  DELETE: 'badge-error',
  HEAD: 'badge-ghost',
  OPTIONS: 'badge-accent',
};

export const METHOD_DOT_COLORS = {
  GET: '#16a34a',
  POST: '#2563eb',
  PUT: '#d97706',
  PATCH: '#9333ea',
  DELETE: '#dc2626',
  HEAD: '#6b7280',
  OPTIONS: '#0891b2',
};
