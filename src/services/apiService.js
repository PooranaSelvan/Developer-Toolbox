import axios from 'axios';

/**
 * Execute an HTTP request via Axios.
 *
 * @param {Object} config
 * @param {string} config.method - HTTP method
 * @param {string} config.url - Request URL
 * @param {Object} config.headers - Request headers
 * @param {Object} config.params - Query parameters
 * @param {*} config.body - Request body (for POST/PUT/PATCH)
 * @returns {Promise<Object>} - Normalized response
 */
export async function executeRequest({ method, url, headers = {}, params = {}, body = null }) {
  const startTime = performance.now();

  try {
    // Build clean headers (filter empty keys/values)
    const cleanHeaders = Object.fromEntries(
      Object.entries(headers).filter(([k, v]) => k.trim() && v.trim())
    );

    // Build clean params
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([k, v]) => k.trim() && v.trim())
    );

    // Parse body if string
    let parsedBody = body;
    if (typeof body === 'string' && body.trim()) {
      try {
        parsedBody = JSON.parse(body);
      } catch {
        parsedBody = body;
      }
    }

    const config = {
      method: method.toLowerCase(),
      url,
      headers: cleanHeaders,
      params: cleanParams,
      validateStatus: () => true, // Don't throw on non-2xx
    };

    // Only attach body for methods that support it
    if (['post', 'put', 'patch'].includes(config.method) && parsedBody) {
      config.data = parsedBody;
      if (!cleanHeaders['Content-Type'] && !cleanHeaders['content-type']) {
        config.headers['Content-Type'] = 'application/json';
      }
    }

    const response = await axios(config);
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    return {
      success: true,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      duration,
      size: JSON.stringify(response.data).length,
    };
  } catch (error) {
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    return {
      success: false,
      status: error.response?.status || 0,
      statusText: error.response?.statusText || 'Network Error',
      headers: error.response?.headers || {},
      data: error.response?.data || error.message,
      duration,
      size: 0,
      error: error.message,
    };
  }
}
