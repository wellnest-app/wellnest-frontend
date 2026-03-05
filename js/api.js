/* ============================================
   WellNest API Service
   HTTP Client สำหรับเรียก Backend API
   ============================================ */

const api = {
  // ===== HTTP Methods =====
  
  /**
   * GET request
   * @param {string} endpoint - API endpoint (e.g., '/medications')
   * @param {object} options - Additional fetch options
   * @returns {Promise<any>} - Response data
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options
    });
  },
  
  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body
   * @param {object} options - Additional fetch options
   * @returns {Promise<any>} - Response data
   */
  async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  },
  
  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body
   * @param {object} options - Additional fetch options
   * @returns {Promise<any>} - Response data
   */
  async put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  },
  
  /**
   * PATCH request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body
   * @param {object} options - Additional fetch options
   * @returns {Promise<any>} - Response data
   */
  async patch(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options
    });
  },
  
  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Additional fetch options
   * @returns {Promise<any>} - Response data
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options
    });
  },
  
  // ===== Core Request Method =====
  
  /**
   * Base request method
   * @param {string} endpoint - API endpoint
   * @param {object} options - Fetch options
   * @returns {Promise<any>} - Response data
   */
  async request(endpoint, options = {}) {
    const config = window.WellNestConfig;
    const url = config.getApiUrl(endpoint);
    
    // Default headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    };
    
    // Add auth token if available
    const token = auth.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add language header
    const lang = localStorage.getItem(config.app.langKey) || config.app.defaultLang;
    headers['Accept-Language'] = lang;
    
    // Merge options
    const fetchOptions = {
      ...options,
      headers
    };
    
    // Debug logging
    if (config.debug.logApi) {
      console.log(`[API] ${options.method || 'GET'} ${url}`, fetchOptions);
    }
    
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.api.timeout);
      
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Handle response
      return this.handleResponse(response);
      
    } catch (error) {
      return this.handleError(error);
    }
  },
  
  // ===== Response Handling =====
  
  /**
   * Handle API response
   * @param {Response} response - Fetch response
   * @returns {Promise<any>} - Parsed response data
   */
  async handleResponse(response) {
    const config = window.WellNestConfig;
    
    // Try to parse JSON response
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // Debug logging
    if (config.debug.logApi) {
      console.log(`[API] Response ${response.status}:`, data);
    }
    
    // Handle success
    if (response.ok) {
      return data;
    }
    
    // Handle errors
    const error = new ApiError(
      data.detail || data.message || 'An error occurred',
      response.status,
      data
    );
    
    // Handle specific status codes
    switch (response.status) {
      case 400:
        // Bad request - usually validation error
        error.message = data.detail || 'ข้อมูลไม่ถูกต้อง';
        break;
      case 401:
        // Unauthorized - only logout if NOT on auth endpoint
        // Use response.url to check if this is a login/register request
        const requestUrl = response.url || '';
        const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');
        if (!isAuthEndpoint) {
          error.message = 'กรุณาเข้าสู่ระบบใหม่';
          auth.logout();
        } else {
          // Login failure - show original error
          error.message = data.detail || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
        }
        break;
      case 403:
        error.message = 'คุณไม่มีสิทธิ์เข้าถึง';
        break;
      case 404:
        error.message = 'ไม่พบข้อมูลที่ต้องการ';
        break;
      case 422:
        error.message = this.parseValidationError(data);
        break;
      case 429:
        error.message = 'กรุณารอสักครู่แล้วลองใหม่';
        break;
      case 500:
        error.message = 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์';
        break;
    }
    
    throw error;
  },
  
  /**
   * Handle fetch errors
   * @param {Error} error - Fetch error
   * @throws {ApiError}
   */
  handleError(error) {
    const config = window.WellNestConfig;
    
    if (config.debug.logApi) {
      console.error('[API] Error:', error);
    }
    
    // Handle abort (timeout)
    if (error.name === 'AbortError') {
      throw new ApiError('การเชื่อมต่อหมดเวลา กรุณาลองใหม่', 0);
    }
    
    // Handle network error
    if (!navigator.onLine) {
      throw new ApiError('ไม่มีการเชื่อมต่ออินเทอร์เน็ต', 0);
    }
    
    // Handle other errors
    throw new ApiError(
      error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ',
      0
    );
  },
  
  /**
   * Parse validation error from 422 response
   * @param {object} data - Error response data
   * @returns {string} - Human readable error message
   */
  parseValidationError(data) {
    if (data.detail && Array.isArray(data.detail)) {
      const errors = data.detail.map(err => {
        const field = err.loc ? err.loc[err.loc.length - 1] : 'field';
        return `${field}: ${err.msg}`;
      });
      return errors.join(', ');
    }
    return data.detail || 'ข้อมูลไม่ถูกต้อง';
  },
  
  // ===== Query String Helper =====
  
  /**
   * Build query string from object
   * @param {object} params - Query parameters
   * @returns {string} - Query string
   */
  buildQueryString(params) {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else {
          searchParams.append(key, value);
        }
      }
    });
    
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  },
  
  // ===== Convenience Methods with Query Params =====
  
  /**
   * GET with query parameters
   * @param {string} endpoint - API endpoint
   * @param {object} params - Query parameters
   * @param {object} options - Additional fetch options
   * @returns {Promise<any>} - Response data
   */
  async getWithParams(endpoint, params = {}, options = {}) {
    const queryString = this.buildQueryString(params);
    return this.get(`${endpoint}${queryString}`, options);
  }
};

// ===== Custom API Error Class =====

class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
  
  // Check if error is network related
  isNetworkError() {
    return this.status === 0;
  }
  
  // Check if error is unauthorized
  isUnauthorized() {
    return this.status === 401;
  }
  
  // Check if error is validation error
  isValidationError() {
    return this.status === 422;
  }
  
  // Check if error is server error
  isServerError() {
    return this.status >= 500;
  }
}

// Export for global use
window.api = api;
window.Api = api; // Alias for uppercase usage
window.ApiError = ApiError;
