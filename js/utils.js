/* ============================================
   WellNest Utilities
   Helper Functions & Toast Notifications
   ============================================ */

const utils = {
  // ===== Date & Time Formatting =====
  
  /**
   * Format date to Thai locale
   * @param {string|Date} date - Date to format
   * @param {string} format - Format type: 'short', 'long', 'full'
   * @returns {string}
   */
  formatDate(date, format = 'short') {
    const d = new Date(date);
    const options = {
      short: { day: '2-digit', month: '2-digit', year: 'numeric' },
      long: { day: 'numeric', month: 'long', year: 'numeric' },
      full: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    };
    
    return d.toLocaleDateString('th-TH', options[format] || options.short);
  },
  
  /**
   * Format time เป็น 24h HH:mm — มาตรฐานทั้ง app (L3 fix)
   * รองรับทั้ง string ("08:00", "08:00:00") และ Date object
   * @param {string|Date} time - Time string หรือ Date object
   * @returns {string} เช่น "08:00", "13:30", "19:00"
   */
  formatTime(time) {
    if (!time) return '';
    
    // กรณี Date object
    if (time instanceof Date) {
      const h = time.getHours().toString().padStart(2, '0');
      const m = time.getMinutes().toString().padStart(2, '0');
      return `${h}:${m}`;
    }
    
    // กรณี string — HH:mm:ss หรือ HH:mm
    const str = String(time);
    const parts = str.split(':');
    if (parts.length >= 2) {
      const h = parts[0].padStart(2, '0');
      const m = parts[1].padStart(2, '0');
      return `${h}:${m}`;
    }
    
    return str;
  },
  
  /**
   * Get Thai time period label จากเวลา (L3 helper)
   * @param {string} timeStr - Time string "HH:mm"
   * @returns {string} เช่น "เช้า", "บ่าย", "เย็น", "ค่ำ"
   */
  getTimePeriodLabel(timeStr) {
    if (!timeStr) return '';
    const hour = parseInt(String(timeStr).split(':')[0], 10);
    if (isNaN(hour)) return '';
    if (hour >= 6 && hour < 12) return 'เช้า';
    if (hour >= 12 && hour < 17) return 'บ่าย';
    if (hour >= 17 && hour < 21) return 'เย็น';
    return 'ค่ำ';
  },
  
  /**
   * Format datetime
   * @param {string|Date} datetime - Datetime to format
   * @returns {string}
   */
  formatDateTime(datetime) {
    const d = new Date(datetime);
    return `${this.formatDate(d)} ${this.formatTime(d)}`;
  },
  
  /**
   * Get relative time (e.g., "2 ชั่วโมงที่แล้ว")
   * @param {string|Date} date - Date to compare
   * @returns {string}
   */
  getRelativeTime(date) {
    const now = new Date();
    const d = new Date(date);
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'เมื่อสักครู่';
    if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
    if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
    if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
    
    return this.formatDate(d);
  },
  
  /**
   * Get greeting based on time of day
   * @returns {string}
   */
  getGreeting() {
    const hour = new Date().getHours();
    
    if (hour < 12) return 'สวัสดีตอนเช้า';
    if (hour < 17) return 'สวัสดีตอนบ่าย';
    if (hour < 20) return 'สวัสดีตอนเย็น';
    return 'สวัสดีตอนค่ำ';
  },
  
  /**
   * Check if date is today
   * @param {string|Date} date - Date to check
   * @returns {boolean}
   */
  isToday(date) {
    const d = new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  },
  
  /**
   * Check if date is tomorrow
   * @param {string|Date} date - Date to check
   * @returns {boolean}
   */
  isTomorrow(date) {
    const d = new Date(date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return d.toDateString() === tomorrow.toDateString();
  },
  
  // ===== Medication Status Helpers (EXP fix) =====
  
  /**
   * ตรวจสอบว่ายาหมดอายุหรือยัง (end_date < today)
   * @param {object} med - medication object ที่มี end_date field
   * @returns {boolean} true ถ้ายาหมดอายุแล้ว
   */
  isExpiredMedication(med) {
    if (!med || !med.end_date) return false; // ไม่มี end_date = continuous ไม่หมด
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(med.end_date + 'T23:59:59'); // end_date เป็นวันสุดท้ายที่ใช้ได้
    return endDate < today;
  },
  
  /**
   * Filter เฉพาะยาที่ยัง active + ไม่หมดอายุ
   * @param {Array} meds - array ของ medication objects
   * @returns {Array} เฉพาะยาที่ยังใช้ได้
   */
  filterActiveMedications(meds) {
    if (!Array.isArray(meds)) return [];
    return meds.filter(m => m.is_active && !this.isExpiredMedication(m));
  },
  
  /**
   * คืนสถานะยา — ใช้สำหรับแสดง badge
   * @param {object} med - medication object
   * @returns {string} 'expired' | 'inactive' | 'active'
   */
  getMedicationStatus(med) {
    if (!med) return 'inactive';
    if (this.isExpiredMedication(med)) return 'expired';
    if (!med.is_active) return 'inactive';
    return 'active';
  },
  
  /**
   * สร้าง medMap จาก medications array — ใช้ร่วมกันหลายหน้า
   * @param {Array} meds - array ของ medication objects
   * @returns {object} map: user_med_id → medication info + expired status
   */
  buildMedMap(meds) {
    const map = {};
    if (!Array.isArray(meds)) return map;
    meds.forEach(m => {
      map[m.user_med_id] = {
        medication_name: m.medication_name || m.med_name || 'ยา',
        prescribed_dosage: m.prescribed_dosage || '',
        end_date: m.end_date || null,
        is_active: m.is_active !== false,
        is_expired: this.isExpiredMedication(m)
      };
    });
    return map;
  },
  
  // ===== String Utilities =====
  
  /**
   * Capitalize first letter
   * @param {string} str - String to capitalize
   * @returns {string}
   */
  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  
  /**
   * Truncate string with ellipsis
   * @param {string} str - String to truncate
   * @param {number} length - Max length
   * @returns {string}
   */
  truncate(str, length = 50) {
    if (!str || str.length <= length) return str;
    return str.slice(0, length) + '...';
  },
  
  /**
   * Generate initials from name
   * @param {string} firstName - First name
   * @param {string} lastName - Last name
   * @returns {string}
   */
  getInitials(firstName, lastName) {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last || '?';
  },
  
  // ===== Number Utilities =====
  
  /**
   * Format number with commas
   * @param {number} num - Number to format
   * @returns {string}
   */
  formatNumber(num) {
    return num.toLocaleString('th-TH');
  },
  
  /**
   * Format percentage
   * @param {number} value - Value (0-100)
   * @param {number} decimals - Decimal places
   * @returns {string}
   */
  formatPercent(value, decimals = 0) {
    return `${value.toFixed(decimals)}%`;
  },
  
  // ===== DOM Utilities =====
  
  /**
   * Get element by selector
   * @param {string} selector - CSS selector
   * @param {Element} parent - Parent element
   * @returns {Element|null}
   */
  $(selector, parent = document) {
    return parent.querySelector(selector);
  },
  
  /**
   * Get all elements by selector
   * @param {string} selector - CSS selector
   * @param {Element} parent - Parent element
   * @returns {NodeList}
   */
  $$(selector, parent = document) {
    return parent.querySelectorAll(selector);
  },
  
  /**
   * Create element with attributes
   * @param {string} tag - Tag name
   * @param {object} attrs - Attributes
   * @param {string|Element} content - Inner content
   * @returns {Element}
   */
  createElement(tag, attrs = {}, content = '') {
    const el = document.createElement(tag);
    
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'className') {
        el.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(el.style, value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        el.setAttribute(key, value);
      }
    });
    
    if (typeof content === 'string') {
      el.innerHTML = content;
    } else if (content instanceof Element) {
      el.appendChild(content);
    }
    
    return el;
  },
  
  /**
   * Show/hide element
   * @param {Element|string} el - Element or selector
   * @param {boolean} show - Show or hide
   */
  toggleVisibility(el, show) {
    const element = typeof el === 'string' ? this.$(el) : el;
    if (!element) return;
    
    if (show) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  },
  
  /**
   * Add event listener with delegation
   * @param {Element} parent - Parent element
   * @param {string} event - Event type
   * @param {string} selector - Child selector
   * @param {Function} handler - Event handler
   */
  delegate(parent, event, selector, handler) {
    parent.addEventListener(event, (e) => {
      const target = e.target.closest(selector);
      if (target) {
        handler.call(target, e, target);
      }
    });
  },
  
  // ===== Debounce & Throttle =====
  
  /**
   * Debounce function
   * @param {Function} fn - Function to debounce
   * @param {number} delay - Delay in ms
   * @returns {Function}
   */
  debounce(fn, delay = 300) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  },
  
  /**
   * Throttle function
   * @param {Function} fn - Function to throttle
   * @param {number} limit - Time limit in ms
   * @returns {Function}
   */
  throttle(fn, limit = 300) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },
  
  // ===== URL Utilities =====
  
  /**
   * Get URL query parameter
   * @param {string} name - Parameter name
   * @returns {string|null}
   */
  getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  },
  
  /**
   * Update URL without reload
   * @param {object} params - Parameters to update
   */
  updateQueryParams(params) {
    const url = new URL(window.location);
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, value);
      }
    });
    window.history.replaceState({}, '', url);
  },
  
  // ===== Loading State =====
  
  /**
   * Show full page loading
   * @param {string} message - Loading message
   */
  showLoading(message = 'กำลังโหลด...') {
    let overlay = this.$('.loading-overlay');
    
    if (!overlay) {
      overlay = this.createElement('div', { className: 'loading-overlay' }, `
        <div class="spinner spinner-lg"></div>
        <div class="loading-text">${message}</div>
      `);
      document.body.appendChild(overlay);
    } else {
      const text = overlay.querySelector('.loading-text');
      if (text) text.textContent = message;
      overlay.classList.remove('hidden');
    }
  },
  
  /**
   * Hide full page loading
   */
  hideLoading() {
    const overlay = this.$('.loading-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
    }
  },
  
  // ===== Toast Notifications =====
  
  toast: {
    container: null,
    
    /**
     * Initialize toast container
     */
    init() {
      if (!this.container) {
        this.container = utils.createElement('div', { className: 'toast-container' });
        document.body.appendChild(this.container);
      }
    },
    
    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duration in ms
     */
    show(message, type = 'info', duration = null) {
      this.init();
      
      const config = window.WellNestConfig;
      const toastDuration = duration || config.ui.toastDuration;
      
      const icons = {
        success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
        error: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
        warning: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
        info: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
      };
      
      const toast = utils.createElement('div', { className: `toast toast-${type}` }, `
        ${icons[type] || icons.info}
        <div class="toast-content">
          <div class="toast-message">${message}</div>
        </div>
        <div class="toast-close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
      `);
      
      // Close button
      toast.querySelector('.toast-close').addEventListener('click', () => {
        this.dismiss(toast);
      });
      
      this.container.appendChild(toast);
      
      // Auto dismiss
      setTimeout(() => {
        this.dismiss(toast);
      }, toastDuration);
      
      return toast;
    },
    
    /**
     * Dismiss toast
     * @param {Element} toast - Toast element
     */
    dismiss(toast) {
      if (!toast || !toast.parentNode) return;
      
      toast.classList.add('toast-exiting');
      setTimeout(() => {
        toast.remove();
      }, 200);
    },
    
    /**
     * Clear all toasts
     */
    clear() {
      if (this.container) {
        this.container.innerHTML = '';
      }
    },
    
    // Convenience methods
    success(message, duration) { return this.show(message, 'success', duration); },
    error(message, duration) { return this.show(message, 'error', duration); },
    warning(message, duration) { return this.show(message, 'warning', duration); },
    info(message, duration) { return this.show(message, 'info', duration); }
  },
  
  // ===== Haptic Feedback =====
  
  /**
   * Trigger haptic feedback (if available)
   * @param {string} type - Feedback type: 'light', 'medium', 'heavy'
   */
  haptic(type = 'light') {
    // Check for Capacitor Haptics
    if (window.Capacitor && window.Capacitor.Plugins.Haptics) {
      const impactStyle = {
        light: 'LIGHT',
        medium: 'MEDIUM',
        heavy: 'HEAVY'
      };
      window.Capacitor.Plugins.Haptics.impact({ style: impactStyle[type] || 'LIGHT' });
    }
    // Fallback to vibration API
    else if (navigator.vibrate) {
      const duration = { light: 10, medium: 20, heavy: 30 };
      navigator.vibrate(duration[type] || 10);
    }
  },
  
  // ===== Copy to Clipboard =====
  
  /**
   * Copy text to clipboard
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>}
   */
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  },
  
  // ===== Scroll Utilities =====
  
  /**
   * Scroll to element
   * @param {Element|string} el - Element or selector
   * @param {object} options - Scroll options
   */
  scrollTo(el, options = {}) {
    const element = typeof el === 'string' ? this.$(el) : el;
    if (!element) return;
    
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      ...options
    });
  },
  
  /**
   * Scroll to top
   */
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// Export for global use
window.utils = utils;
window.Utils = utils; // Alias for uppercase usage
window.Toast = utils.toast; // Alias for Toast
