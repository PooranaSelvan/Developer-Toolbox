import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Save, FolderOpen, Code, Zap } from 'lucide-react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { executeRequest } from '../../services/apiService';
import { generateId } from '../../utils/helpers';
import RequestConfig from './RequestConfig';
import ResponsePanel from './ResponsePanel';
import RequestHistory from './RequestHistory';
import CodeGenerator from './CodeGenerator';
import SavedCollections from './SavedCollections';



const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

const INITIAL_REQUEST = {
  method: 'GET',
  url: '',
  headers: [{ key: '', value: '', enabled: true, id: generateId() }],
  params: [{ key: '', value: '', enabled: true, id: generateId() }],
  body: '',
  bodyType: 'json',
  auth: { type: 'none', token: '', username: '', password: '' },
};

export default function ApiTester() {
  const [request, setRequest] = useState(INITIAL_REQUEST);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useLocalStorage('api-tester-history', []);
  const [collections, setCollections] = useLocalStorage('api-tester-collections', []);
  const [showCodeGen, setShowCodeGen] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);

  const updateRequest = useCallback((field, value) => {
    setRequest((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSend = async () => {
    if (!request.url.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const headers = {};
      (request.headers || []).forEach(({ key, value, enabled }) => {
        try {
          if (key && key.trim() && enabled !== false) headers[key.trim()] = value;
        } catch { /* skip invalid header */ }
      });

      if (request.auth?.type === 'bearer' && request.auth.token) {
        headers['Authorization'] = `Bearer ${request.auth.token}`;
      } else if (request.auth?.type === 'basic' && request.auth.username) {
        try {
          headers['Authorization'] = `Basic ${btoa(`${request.auth.username}:${request.auth.password || ''}`)}`;
        } catch (e) {
          console.warn('[ApiTester] Failed to encode Basic auth credentials:', e);
        }
      } else if (request.auth?.type === 'apikey' && request.auth.token) {
        headers['X-API-Key'] = request.auth.token;
      }

      const params = {};
      (request.params || []).forEach(({ key, value, enabled }) => {
        try {
          if (key && key.trim() && enabled !== false) params[key.trim()] = value;
        } catch { /* skip invalid param */ }
      });

      const result = await executeRequest({
        method: request.method,
        url: request.url,
        headers,
        params,
        body: request.body,
      });

      setResponse(result);

      try {
        const historyEntry = {
          id: generateId(),
          method: request.method,
          url: request.url,
          headers,
          params,
          body: request.body,
          bodyType: request.bodyType,
          auth: request.auth,
          status: result.status,
          duration: result.duration,
          timestamp: new Date().toISOString(),
        };

        setHistory((prev) => [historyEntry, ...prev].slice(0, 100));
      } catch (historyErr) {
        console.warn('[ApiTester] Failed to save to history:', historyErr);
      }
    } catch (error) {
      console.error('[ApiTester] Request execution failed:', error);
      setResponse({
        success: false,
        status: 0,
        statusText: 'Client Error',
        headers: {},
        data: error?.message || 'An unexpected error occurred while sending the request.',
        duration: 0,
        size: 0,
        error: error?.message || 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadHistory = (entry) => {
    setRequest({
      method: entry.method,
      url: entry.url,
      headers: Object.entries(entry.headers || {}).map(([key, value]) => ({
        key, value, enabled: true, id: generateId(),
      })).concat([{ key: '', value: '', enabled: true, id: generateId() }]),
      params: Object.entries(entry.params || {}).map(([key, value]) => ({
        key, value, enabled: true, id: generateId(),
      })).concat([{ key: '', value: '', enabled: true, id: generateId() }]),
      body: entry.body || '',
      bodyType: entry.bodyType || 'json',
      auth: entry.auth || { type: 'none', token: '', username: '', password: '' },
    });
    setResponse(null);
  };

  const handleClearHistory = () => setHistory([]);

  const handleSaveToCollection = () => {
    if (!saveName.trim() || !request.url.trim()) return;
    const item = {
      id: generateId(),
      name: saveName.trim(),
      method: request.method,
      url: request.url,
      headers: request.headers.filter(h => h.key.trim()),
      params: request.params.filter(p => p.key.trim()),
      body: request.body,
      bodyType: request.bodyType,
      auth: request.auth,
      savedAt: new Date().toISOString(),
    };
    setCollections((prev) => [item, ...prev]);
    setSaveName('');
    setShowSaveInput(false);
  };

  const handleLoadCollection = (item) => {
    setRequest({
      method: item.method,
      url: item.url,
      headers: [...(item.headers || []).map(h => ({ ...h, id: generateId(), enabled: true })),
        { key: '', value: '', enabled: true, id: generateId() }],
      params: [...(item.params || []).map(p => ({ ...p, id: generateId(), enabled: true })),
        { key: '', value: '', enabled: true, id: generateId() }],
      body: item.body || '',
      bodyType: item.bodyType || 'json',
      auth: item.auth || { type: 'none', token: '', username: '', password: '' },
    });
    setShowCollections(false);
    setResponse(null);
  };

  const handleDeleteCollection = (id) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  };

return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* URL Bar */}
      <div className="rounded-xl border border-base-300 bg-base-100">
        <div className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Method selector */}
            <select
              value={request.method}
              onChange={(e) => updateRequest('method', e.target.value)}
              className="select select-sm w-full sm:w-[120px] font-bold text-sm shrink-0 rounded-xl"
            >
              {HTTP_METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            {/* URL input */}
            <input
              type="text"
              value={request.url}
              onChange={(e) => updateRequest('url', e.target.value)}
              placeholder="https://api.example.com/endpoint"
              className="input input-sm font-mono text-sm w-full rounded-xl flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) handleSend();
              }}
            />

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={loading || !request.url.trim()}
              className="btn btn-primary btn-sm gap-1.5 rounded-xl shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Zap size={14} />
                  Send
                </>
              )}
            </button>
          </div>

          {/* Actions bar */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-base-200 flex-wrap">
            <AnimatePresence mode="wait">
              {showSaveInput ? (
                <motion.div
                  key="save-input"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex items-center gap-2 bg-base-200/50 rounded-xl px-2 py-1 backdrop-blur-sm border border-base-300/40"
                >
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    placeholder="Request name..."
                    className="input input-xs w-52 rounded-lg"
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveToCollection()}
                    autoFocus
                  />
                  <motion.button whileTap={{ scale: 0.9 }} onClick={handleSaveToCollection} className="btn btn-primary btn-xs rounded-lg shadow-sm shadow-primary/20">Save</motion.button>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowSaveInput(false)} className="btn btn-ghost btn-xs rounded-lg">Cancel</motion.button>
                </motion.div>
              ) : (
                <motion.button
                  key="save-btn"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowSaveInput(true)}
                  className="btn btn-ghost btn-xs gap-1.5 rounded-xl hover:bg-base-200/80"
                  disabled={!request.url.trim()}
                >
                  <Save size={13} />
                  Save
                </motion.button>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowCollections(!showCollections)}
              className={`btn btn-xs gap-1.5 rounded-xl transition-all duration-200 ${showCollections ? 'btn-secondary shadow-md shadow-secondary/20' : 'btn-ghost hover:bg-base-200/80'}`}
            >
              <FolderOpen size={13} />
              Collections ({collections.length})
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowCodeGen(!showCodeGen)}
              className={`btn btn-xs gap-1.5 rounded-xl transition-all duration-200 ${showCodeGen ? 'btn-secondary shadow-md shadow-secondary/20' : 'btn-ghost hover:bg-base-200/80'}`}
              disabled={!request.url.trim()}
            >
              <Code size={13} />
              Generate Code
            </motion.button>
          </div>
        </div>
      </div>

      {/* Collections Panel */}
      {showCollections && (
        <SavedCollections
          collections={collections}
          onLoad={handleLoadCollection}
          onDelete={handleDeleteCollection}
          onClose={() => setShowCollections(false)}
        />
      )}

      {/* Code Generator */}
      {showCodeGen && request.url.trim() && (
        <CodeGenerator request={request} />
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
          <RequestConfig request={request} onUpdate={updateRequest} />
          <ResponsePanel response={response} loading={loading} />
        </div>
        <div className="xl:col-span-1">
          <RequestHistory
            history={history}
            onLoad={handleLoadHistory}
            onClear={handleClearHistory}
          />
        </div>
      </div>
    </div>
  );
}
