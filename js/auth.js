/* ============================================
   WellNest Authentication
   Token Management & Auth Functions
   ============================================ */

const auth = {
  // ===== Token Management =====
  
  /**
   * Get stored token
   * @returns {string|null} - JWT token or null
   */
  getToken() {
    const config = window.WellNestConfig;
    return localStorage.getItem(config.auth.tokenKey);
  },
  
  /**
   * Set token to storage
   * @param {string} token - JWT token
   */
  setToken(token) {
    const config = window.WellNestConfig;
    localStorage.setItem(config.auth.tokenKey, token);
  },
  
  /**
   * Remove token from storage
   */
  removeToken() {
    const config = window.WellNestConfig;
    localStorage.removeItem(config.auth.tokenKey);
  },
  
  // ===== User Management =====
  
  /**
   * Get stored user data
   * @returns {object|null} - User object or null
   */
  getUser() {
    const config = window.WellNestConfig;
    const userData = localStorage.getItem(config.auth.userKey);
    return userData ? JSON.parse(userData) : null;
  },
  
  /**
   * Set user data to storage
   * @param {object} user - User object
   */
  setUser(user) {
    const config = window.WellNestConfig;
    localStorage.setItem(config.auth.userKey, JSON.stringify(user));
  },
  
  /**
   * Remove user data from storage
   */
  removeUser() {
    const config = window.WellNestConfig;
    localStorage.removeItem(config.auth.userKey);
  },
  
  // ===== Auth State =====
  
  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired
    if (this.isTokenExpired(token)) {
      this.clearAuth();
      return false;
    }
    
    return true;
  },
  
  /**
   * Check if token is expired
   * @param {string} token - JWT token
   * @returns {boolean}
   */
  isTokenExpired(token) {
    try {
      const payload = this.parseToken(token);
      if (!payload.exp) return false;
      
      // Add 30 second buffer
      const expiresAt = payload.exp * 1000;
      return Date.now() >= expiresAt - 30000;
    } catch {
      return true;
    }
  },
  
  /**
   * Parse JWT token payload
   * @param {string} token - JWT token
   * @returns {object} - Token payload
   */
  parseToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return {};
    }
  },
  
  /**
   * Get user ID from token
   * @returns {number|null}
   */
  getUserId() {
    const token = this.getToken();
    if (!token) return null;
    
    const payload = this.parseToken(token);
    return payload.user_id || payload.sub || null;
  },
  
  // ===== Auth Actions =====
  
  /**
   * Login user
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise<object>} - User data
   */
  async login(username, password) {
    const response = await api.post('/auth/login', {
      username,
      password
    });
    
    // Store token
    this.setToken(response.access_token);
    
    // Fetch and store user data
    const user = await this.fetchCurrentUser();
    
    return user;
  },
  
  /**
   * Register new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} - Created user data
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response;
  },
  
  /**
   * Logout user
   * @param {boolean} redirect - Whether to redirect to login
   */
  logout(redirect = true) {
    this.clearAuth();
    
    if (redirect) {
      const config = window.WellNestConfig;
      window.location.href = config.auth.loginPath;
    }
  },
  
  /**
   * Clear all auth data
   */
  clearAuth() {
    this.removeToken();
    this.removeUser();
    
    // Clear other cached data
    if (window.storage) {
      window.storage.clear();
    }
  },
  
  /**
   * Fetch current user from API
   * @returns {Promise<object>} - User data
   */
  async fetchCurrentUser() {
    try {
      const user = await api.get('/auth/me');
      this.setUser(user);
      return user;
    } catch (error) {
      if (error.isUnauthorized && error.isUnauthorized()) {
        this.clearAuth();
      }
      throw error;
    }
  },
  
  // ===== Auth Guard =====
  
  /**
   * Check authentication and redirect if needed
   * @returns {boolean} - Whether user is authenticated
   */
  requireAuth() {
    const config = window.WellNestConfig;
    
    if (!this.isAuthenticated()) {
      // Store intended destination
      sessionStorage.setItem('wellnest_redirect', window.location.href);
      
      // Redirect to login
      window.location.href = config.auth.loginPath;
      return false;
    }
    
    return true;
  },
  
  /**
   * Redirect authenticated users away from public pages
   */
  redirectIfAuthenticated() {
    const config = window.WellNestConfig;
    
    if (this.isAuthenticated()) {
      // Check for stored redirect
      const redirect = sessionStorage.getItem('wellnest_redirect');
      sessionStorage.removeItem('wellnest_redirect');
      
      window.location.href = redirect || config.auth.dashboardPath;
      return true;
    }
    
    return false;
  },
  
  /**
   * Check if current path is public
   * @returns {boolean}
   */
  isPublicPath() {
    const config = window.WellNestConfig;
    const currentPath = window.location.pathname;
    
    return config.auth.publicPaths.some(path => {
      // Exact match or starts with
      return currentPath === path || currentPath.startsWith(path.replace('.html', ''));
    });
  },
  
  // ===== Initialize =====
  
  /**
   * Initialize auth system
   * Call this on app start
   */
  init() {
    const config = window.WellNestConfig;
    
    // Skip auth check for public paths
    if (this.isPublicPath()) {
      return;
    }
    
    // Check authentication
    if (!this.isAuthenticated()) {
      this.logout();
      return;
    }
    
    // Start token expiration checker
    this.startTokenChecker();
  },
  
  /**
   * Start token expiration checker
   */
  startTokenChecker() {
    const config = window.WellNestConfig;
    
    setInterval(() => {
      const token = this.getToken();
      if (token && this.isTokenExpired(token)) {
        utils.toast.warning('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่');
        this.logout();
      }
    }, config.auth.tokenCheckInterval);
  },
  
  // ===== Validation =====
  
  /**
   * Validate username
   * @param {string} username - Username to validate
   * @returns {object} - { valid: boolean, message: string }
   */
  validateUsername(username) {
    const config = window.WellNestConfig;
    const rules = config.validation.username;
    
    if (!username || username.trim() === '') {
      return { valid: false, message: 'กรุณากรอกชื่อผู้ใช้' };
    }
    
    if (username.length < rules.minLength) {
      return { valid: false, message: `ชื่อผู้ใช้ต้องมีอย่างน้อย ${rules.minLength} ตัวอักษร` };
    }
    
    if (username.length > rules.maxLength) {
      return { valid: false, message: `ชื่อผู้ใช้ต้องไม่เกิน ${rules.maxLength} ตัวอักษร` };
    }
    
    if (!rules.pattern.test(username)) {
      return { valid: false, message: 'ชื่อผู้ใช้ใช้ได้เฉพาะ a-z, A-Z, 0-9 และ _' };
    }
    
    return { valid: true, message: '' };
  },
  
  /**
   * Validate password
   * @param {string} password - Password to validate
   * @returns {object} - { valid: boolean, message: string }
   */
  validatePassword(password) {
    const config = window.WellNestConfig;
    const rules = config.validation.password;
    
    if (!password || password === '') {
      return { valid: false, message: 'กรุณากรอกรหัสผ่าน' };
    }
    
    if (password.length < rules.minLength) {
      return { valid: false, message: `รหัสผ่านต้องมีอย่างน้อย ${rules.minLength} ตัวอักษร` };
    }
    
    return { valid: true, message: '' };
  },
  
  /**
   * Validate email
   * @param {string} email - Email to validate
   * @returns {object} - { valid: boolean, message: string }
   */
  validateEmail(email) {
    const config = window.WellNestConfig;
    const rules = config.validation.email;
    
    if (!email || email.trim() === '') {
      return { valid: true, message: '' }; // Email is optional
    }
    
    if (!rules.pattern.test(email)) {
      return { valid: false, message: 'รูปแบบอีเมลไม่ถูกต้อง' };
    }
    
    return { valid: true, message: '' };
  }
};

// Export for global use
window.auth = auth;
window.Auth = auth; // Alias for uppercase usage
