/* ============================================
   WellNest i18n Manager
   Language switching and translation system
   ============================================ */

const I18n = (function() {
  'use strict';

  // Private state
  let currentLang = 'th';
  let translations = {};
  let listeners = [];

  // Storage key
  const LANG_KEY = 'wellnest_language';

  /**
   * Initialize i18n system
   */
  function init() {
    // Load saved language preference
    const savedLang = localStorage.getItem(LANG_KEY);
    if (savedLang && (savedLang === 'th' || savedLang === 'en')) {
      currentLang = savedLang;
    } else {
      // Try to detect from browser
      const browserLang = navigator.language?.slice(0, 2);
      currentLang = browserLang === 'en' ? 'en' : 'th';
    }

    // Load translations
    loadTranslations();

    // Set HTML lang attribute
    document.documentElement.lang = currentLang;

    // Apply translations on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyTranslations);
    } else {
      applyTranslations();
    }

    console.log(`[i18n] Initialized with language: ${currentLang}`);
  }

  /**
   * Load translation files
   */
  function loadTranslations() {
    // Get translations from global variables set by th.js and en.js
    if (window.i18n_th) {
      translations['th'] = window.i18n_th;
    }
    if (window.i18n_en) {
      translations['en'] = window.i18n_en;
    }
  }

  /**
   * Get current language
   * @returns {string} Current language code
   */
  function getLang() {
    return currentLang;
  }

  /**
   * Set language
   * @param {string} lang - Language code ('th' or 'en')
   */
  function setLang(lang) {
    if (lang !== 'th' && lang !== 'en') {
      console.warn(`[i18n] Invalid language: ${lang}`);
      return;
    }

    if (lang === currentLang) return;

    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;

    // Re-apply translations
    applyTranslations();

    // Notify listeners
    notifyListeners();

    console.log(`[i18n] Language changed to: ${lang}`);
  }

  /**
   * Toggle between Thai and English
   */
  function toggle() {
    setLang(currentLang === 'th' ? 'en' : 'th');
  }

  /**
   * Get translation by key
   * @param {string} key - Dot-notation key (e.g., 'auth.login')
   * @param {Object} params - Parameters for interpolation
   * @returns {string} Translated string or key if not found
   */
  function t(key, params = {}) {
    const langData = translations[currentLang];
    if (!langData) {
      console.warn(`[i18n] No translations for: ${currentLang}`);
      return key;
    }

    // Navigate nested keys
    const keys = key.split('.');
    let value = langData;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Try fallback to English
        if (currentLang !== 'en' && translations['en']) {
          return t_fallback(key, params);
        }
        console.warn(`[i18n] Missing translation: ${key}`);
        return key;
      }
    }

    if (typeof value !== 'string') {
      console.warn(`[i18n] Translation is not string: ${key}`);
      return key;
    }

    // Interpolate parameters
    return interpolate(value, params);
  }

  /**
   * Fallback to English translation
   */
  function t_fallback(key, params) {
    const langData = translations['en'];
    if (!langData) return key;

    const keys = key.split('.');
    let value = langData;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    if (typeof value !== 'string') return key;
    return interpolate(value, params);
  }

  /**
   * Interpolate parameters into string
   * @param {string} str - String with {param} placeholders
   * @param {Object} params - Parameters to replace
   * @returns {string} Interpolated string
   */
  function interpolate(str, params) {
    return str.replace(/\{(\w+)\}/g, (match, key) => {
      return key in params ? params[key] : match;
    });
  }

  /**
   * Apply translations to DOM elements with data-i18n attribute
   */
  function applyTranslations() {
    // Elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const params = el.dataset.i18nParams ? JSON.parse(el.dataset.i18nParams) : {};
      el.textContent = t(key, params);
    });

    // Elements with data-i18n-placeholder
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = t(key);
    });

    // Elements with data-i18n-title
    const titles = document.querySelectorAll('[data-i18n-title]');
    titles.forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = t(key);
    });

    // Elements with data-i18n-aria-label
    const ariaLabels = document.querySelectorAll('[data-i18n-aria-label]');
    ariaLabels.forEach(el => {
      const key = el.getAttribute('data-i18n-aria-label');
      el.setAttribute('aria-label', t(key));
    });

    // Elements with data-i18n-html (for HTML content)
    const htmlElements = document.querySelectorAll('[data-i18n-html]');
    htmlElements.forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const params = el.dataset.i18nParams ? JSON.parse(el.dataset.i18nParams) : {};
      el.innerHTML = t(key, params);
    });
  }

  /**
   * Add language change listener
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  function onChange(callback) {
    listeners.push(callback);
    return () => {
      listeners = listeners.filter(l => l !== callback);
    };
  }

  /**
   * Notify all listeners of language change
   */
  function notifyListeners() {
    listeners.forEach(callback => {
      try {
        callback(currentLang);
      } catch (err) {
        console.error('[i18n] Listener error:', err);
      }
    });
  }

  /**
   * Get available languages
   * @returns {Array} Available language codes
   */
  function getAvailableLanguages() {
    return [
      { code: 'th', name: 'ภาษาไทย', flag: '🇹🇭' },
      { code: 'en', name: 'English', flag: '🇺🇸' }
    ];
  }

  /**
   * Get language name
   * @param {string} code - Language code
   * @returns {string} Language name
   */
  function getLanguageName(code) {
    const langs = {
      th: 'ภาษาไทย',
      en: 'English'
    };
    return langs[code] || code;
  }

  /**
   * Check if current language is RTL
   * @returns {boolean}
   */
  function isRTL() {
    return false; // Thai and English are LTR
  }

  /**
   * Format date according to locale
   * @param {Date|string} date - Date to format
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string} Formatted date
   */
  function formatDate(date, options = {}) {
    const d = date instanceof Date ? date : new Date(date);
    const locale = currentLang === 'th' ? 'th-TH' : 'en-US';
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(d);
  }

  /**
   * Format time according to locale
   * @param {Date|string} date - Date to format
   * @returns {string} Formatted time
   */
  function formatTime(date) {
    const d = date instanceof Date ? date : new Date(date);
    const locale = currentLang === 'th' ? 'th-TH' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  }

  /**
   * Format number according to locale
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  function formatNumber(num) {
    const locale = currentLang === 'th' ? 'th-TH' : 'en-US';
    return new Intl.NumberFormat(locale).format(num);
  }

  // Public API
  return {
    init,
    getLang,
    setLang,
    toggle,
    t,
    applyTranslations,
    onChange,
    getAvailableLanguages,
    getLanguageName,
    isRTL,
    formatDate,
    formatTime,
    formatNumber
  };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => I18n.init());
} else {
  I18n.init();
}

// Export for use in other modules
window.I18n = I18n;
window.t = I18n.t.bind(I18n);
