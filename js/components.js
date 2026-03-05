/* ============================================
   WellNest Component Manager
   Dynamic component loading and injection
   ============================================ */

const Components = (function() {
  'use strict';

  // Component cache
  const cache = new Map();

  // Component URLs
  const componentPaths = {
    header: '/wellnest-frontend/components/header.html',
    bottomNav: '/wellnest-frontend/components/bottom-nav.html',
    sidebar: '/wellnest-frontend/components/sidebar.html',
    modal: '/wellnest-frontend/components/modal.html',
    toast: '/wellnest-frontend/components/toast.html',
    loading: '/wellnest-frontend/components/loading.html'
  };

  /**
   * Initialize components based on config
   * @param {Object} config - Configuration for which components to load
   */
  async function init(config = {}) {
    const promises = [];

    if (config.header) promises.push(loadHeader(config.header));
    if (config.bottomNav) promises.push(loadBottomNav(config.bottomNav));
    if (config.sidebar) promises.push(loadSidebar(config.sidebar));
    if (config.loading !== false) promises.push(loadComponentByPlaceholder('loading', 'loading-placeholder'));
    if (config.toast !== false) promises.push(loadComponentByPlaceholder('toast', 'toast-placeholder'));
    if (config.modal !== false) promises.push(loadComponentByPlaceholder('modal', 'modal-placeholder'));

    await Promise.all(promises);

    // Apply i18n translations
    if (typeof I18n !== 'undefined') {
      I18n.applyTranslations();
    }
  }

  /**
   * Load header component with options
   */
  async function loadHeader(options = {}) {
    const placeholder = document.getElementById('header-placeholder');
    if (!placeholder) return;

    try {
      const html = await fetchComponent('header');
      placeholder.outerHTML = html;

      // Apply options
      if (options.title) {
        const titleEl = document.getElementById('headerTitle');
        if (titleEl) titleEl.textContent = options.title;
      }
      if (options.titleKey) {
        const titleEl = document.getElementById('headerTitle');
        if (titleEl) titleEl.setAttribute('data-i18n', options.titleKey);
      }
      if (options.showBack) {
        const backBtn = document.getElementById('headerBackBtn');
        const logo = document.getElementById('headerLogo');
        if (backBtn) backBtn.style.display = 'flex';
        if (logo) logo.style.display = 'none';
      }
      if (options.showNotifications === false) {
        const notifBtn = document.getElementById('headerNotificationBtn');
        if (notifBtn) notifBtn.style.display = 'none';
      }
    } catch (error) {
      console.error('[Components] Failed to load header:', error);
    }
  }

  /**
   * Load bottom navigation with options
   */
  async function loadBottomNav(options = {}) {
    const placeholder = document.getElementById('bottom-nav-placeholder');
    console.log('[Components] Loading bottomNav, placeholder:', placeholder);
    if (!placeholder) {
      console.warn('[Components] bottom-nav-placeholder not found!');
      return;
    }

    try {
      const html = await fetchComponent('bottomNav');
      console.log('[Components] bottomNav HTML loaded, length:', html.length);
      placeholder.outerHTML = html;

      // Verify items loaded
      const navItems = document.querySelectorAll('.bottom-nav .nav-item');
      console.log('[Components] Nav items found:', navItems.length);

      if (options.active) {
        const activeItem = document.querySelector(`[data-page="${options.active}"]`);
        if (activeItem) activeItem.classList.add('active');
      }
    } catch (error) {
      console.error('[Components] Failed to load bottomNav:', error);
    }
  }

  /**
   * Load sidebar with options
   */
  async function loadSidebar(options = {}) {
    const placeholder = document.getElementById('sidebar-placeholder');
    if (!placeholder) return;

    try {
      const html = await fetchComponent('sidebar');
      placeholder.outerHTML = html;

      if (options.active) {
        const activeItem = document.querySelector(`.sidebar-item[data-page="${options.active}"]`);
        if (activeItem) activeItem.classList.add('active');
      }
    } catch (error) {
      console.error('[Components] Failed to load sidebar:', error);
    }
  }

  /**
   * Load component by placeholder ID
   */
  async function loadComponentByPlaceholder(name, placeholderId) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    try {
      const html = await fetchComponent(name);
      placeholder.outerHTML = html;
    } catch (error) {
      console.error(`[Components] Failed to load ${name}:`, error);
    }
  }

  /**
   * Fetch component HTML from path
   */
  async function fetchComponent(name) {
    // Check cache first
    if (cache.has(name)) {
      return cache.get(name);
    }

    const path = componentPaths[name];
    if (!path) throw new Error(`Unknown component: ${name}`);

    // Add cache-busting query parameter
    const cacheBuster = '?v=' + Date.now();
    const response = await fetch(path + cacheBuster);
    if (!response.ok) throw new Error(`Failed to load ${name}`);
    
    const html = await response.text();
    cache.set(name, html);
    return html;
  }

  /**
   * Load component HTML
   * @param {string} name - Component name
   * @returns {Promise<string>} Component HTML
   */
  async function load(name) {
    // Check cache first
    if (cache.has(name)) {
      return cache.get(name);
    }

    const path = componentPaths[name];
    if (!path) {
      throw new Error(`Unknown component: ${name}`);
    }

    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load component: ${name}`);
      }
      const html = await response.text();
      cache.set(name, html);
      return html;
    } catch (error) {
      console.error(`[Components] Load error for ${name}:`, error);
      throw error;
    }
  }

  /**
   * Inject component into container
   * @param {string} name - Component name
   * @param {string|Element} container - Container selector or element
   * @param {Object} options - Options
   */
  async function inject(name, container, options = {}) {
    const el = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;

    if (!el) {
      console.warn(`[Components] Container not found: ${container}`);
      return;
    }

    try {
      const html = await load(name);
      el.innerHTML = html;

      // Apply translations if i18n is available
      if (window.I18n) {
        window.I18n.applyTranslations();
      }

      // Call init callback if provided
      if (options.onInit && typeof options.onInit === 'function') {
        options.onInit(el);
      }
    } catch (error) {
      console.error(`[Components] Inject error:`, error);
    }
  }

  /**
   * Render inline component (no fetch)
   * @param {string} template - HTML template string
   * @param {Object} data - Data for interpolation
   * @returns {string} Rendered HTML
   */
  function render(template, data = {}) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return key in data ? escapeHtml(data[key]) : '';
    });
  }

  /**
   * Escape HTML entities
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Create element from HTML string
   * @param {string} html - HTML string
   * @returns {Element} Created element
   */
  function createElement(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
  }

  /**
   * Clear component cache
   */
  function clearCache() {
    cache.clear();
  }

  // ============================================
  // Header Component
  // ============================================

  function createHeader(options = {}) {
    const { 
      title = '', 
      showBack = false, 
      showMenu = false,
      showLogo = false,
      rightAction = null 
    } = options;

    return `
      <header class="header">
        <div class="header-left">
          ${showBack ? `
            <button class="header-btn" id="btn-back" onclick="history.back()" aria-label="กลับ">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
          ` : ''}
          ${showMenu ? `
            <button class="header-btn" id="btn-menu" aria-label="เมนู">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            </button>
          ` : ''}
          ${showLogo ? `
            <img src="/wellnest-frontend/assets/images/logo.svg" alt="WellNest" class="header-logo" height="32">
          ` : ''}
        </div>
        <div class="header-center">
          <h1 class="header-title" ${title.startsWith('data-i18n:') ? `data-i18n="${title.slice(10)}"` : ''}>${title.startsWith('data-i18n:') ? '' : title}</h1>
        </div>
        <div class="header-right">
          ${rightAction ? rightAction : ''}
        </div>
      </header>
    `;
  }

  // ============================================
  // Bottom Navigation Component
  // ============================================

  function createBottomNav(activeTab = 'home') {
    const tabs = [
      { id: 'home', icon: 'home', label: 'nav.home', href: '/wellnest-frontend/pages/dashboard.html' },
      { id: 'medications', icon: 'pill', label: 'nav.medications', href: '/wellnest-frontend/pages/medications/list.html' },
      { id: 'reminders', icon: 'bell', label: 'nav.reminders', href: '/wellnest-frontend/pages/reminders/list.html' },
      { id: 'devices', icon: 'cpu', label: 'nav.devices', href: '/wellnest-frontend/pages/devices/list.html' },
      { id: 'settings', icon: 'settings', label: 'nav.settings', href: '/wellnest-frontend/pages/settings/index.html' }
    ];

    const icons = {
      home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
      pill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.5 20.5L3.5 13.5a4.95 4.95 0 1 1 7-7l7 7a4.95 4.95 0 0 1-7 7z"/><path d="M8.5 8.5l7 7"/></svg>',
      bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
      cpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>',
      settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
    };

    return `
      <nav class="bottom-nav" id="bottom-nav">
        ${tabs.map(tab => `
          <a href="${tab.href}" 
             class="nav-item ${tab.id === activeTab ? 'active' : ''}"
             data-tab="${tab.id}">
            <span class="nav-icon">${icons[tab.icon]}</span>
            <span class="nav-label" data-i18n="${tab.label}"></span>
          </a>
        `).join('')}
      </nav>
    `;
  }

  // ============================================
  // Modal Component
  // ============================================

  function createModal(options = {}) {
    const {
      id = 'modal',
      title = '',
      content = '',
      actions = [],
      size = 'md', // sm, md, lg, full
      closable = true
    } = options;

    const sizeClass = {
      sm: 'modal-sm',
      md: 'modal-md',
      lg: 'modal-lg',
      full: 'modal-full'
    }[size] || 'modal-md';

    return `
      <div class="modal-overlay" id="${id}" role="dialog" aria-modal="true">
        <div class="modal-container ${sizeClass}">
          <div class="modal-header">
            <h2 class="modal-title">${title}</h2>
            ${closable ? `
              <button class="modal-close" onclick="Modal.close('${id}')" aria-label="ปิด">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            ` : ''}
          </div>
          <div class="modal-body">
            ${content}
          </div>
          ${actions.length > 0 ? `
            <div class="modal-footer">
              ${actions.map(action => `
                <button class="btn ${action.class || 'btn-outline'}" 
                        onclick="${action.onclick || ''}"
                        ${action.disabled ? 'disabled' : ''}>
                  ${action.label}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // ============================================
  // Loading Component
  // ============================================

  function createLoadingOverlay(options = {}) {
    const { message = '' } = options;
    return `
      <div class="loading-overlay" id="loading-overlay">
        <div class="loading-spinner">
          <svg class="spinner" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="20" fill="none" stroke-width="4"></circle>
          </svg>
          ${message ? `<p class="loading-text">${message}</p>` : ''}
        </div>
      </div>
    `;
  }

  // ============================================
  // Empty State Component
  // ============================================

  function createEmptyState(options = {}) {
    const {
      icon = 'inbox',
      title = '',
      message = '',
      action = null
    } = options;

    const icons = {
      inbox: '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
      pill: '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10.5 20.5L3.5 13.5a4.95 4.95 0 1 1 7-7l7 7a4.95 4.95 0 0 1-7 7z"/><path d="M8.5 8.5l7 7"/></svg>',
      bell: '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
      device: '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/></svg>',
      search: '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
    };

    return `
      <div class="empty-state">
        <div class="empty-icon text-gray-400">
          ${icons[icon] || icons.inbox}
        </div>
        ${title ? `<h3 class="empty-title">${title}</h3>` : ''}
        ${message ? `<p class="empty-message">${message}</p>` : ''}
        ${action ? `
          <button class="btn btn-primary mt-4" onclick="${action.onclick || ''}">
            ${action.label}
          </button>
        ` : ''}
      </div>
    `;
  }

  // ============================================
  // Card Component
  // ============================================

  function createCard(options = {}) {
    const {
      title = '',
      subtitle = '',
      content = '',
      actions = [],
      image = null,
      badge = null,
      className = ''
    } = options;

    return `
      <div class="card ${className}">
        ${image ? `<img src="${image}" alt="" class="card-image">` : ''}
        ${badge ? `<span class="badge ${badge.class || 'badge-primary'}">${badge.text}</span>` : ''}
        ${title || subtitle ? `
          <div class="card-header">
            ${title ? `<h3 class="card-title">${title}</h3>` : ''}
            ${subtitle ? `<p class="card-subtitle">${subtitle}</p>` : ''}
          </div>
        ` : ''}
        ${content ? `<div class="card-body">${content}</div>` : ''}
        ${actions.length > 0 ? `
          <div class="card-actions">
            ${actions.map(action => `
              <button class="btn ${action.class || 'btn-ghost btn-sm'}" 
                      onclick="${action.onclick || ''}">
                ${action.icon || ''}
                ${action.label}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  // ============================================
  // List Item Component
  // ============================================

  function createListItem(options = {}) {
    const {
      title = '',
      subtitle = '',
      leading = null, // icon or avatar
      trailing = null, // icon, badge, or action
      onClick = null,
      className = ''
    } = options;

    return `
      <div class="list-item ${className}" ${onClick ? `onclick="${onClick}"` : ''}>
        ${leading ? `<div class="list-item-leading">${leading}</div>` : ''}
        <div class="list-item-content">
          <span class="list-item-title">${title}</span>
          ${subtitle ? `<span class="list-item-subtitle">${subtitle}</span>` : ''}
        </div>
        ${trailing ? `<div class="list-item-trailing">${trailing}</div>` : ''}
      </div>
    `;
  }

  // ============================================
  // Skeleton Loading Components
  // ============================================

  function createSkeleton(type = 'text', options = {}) {
    const { lines = 3, avatar = false } = options;

    switch (type) {
      case 'card':
        return `
          <div class="skeleton-card">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton-body">
              <div class="skeleton skeleton-title"></div>
              <div class="skeleton skeleton-text"></div>
              <div class="skeleton skeleton-text" style="width: 60%"></div>
            </div>
          </div>
        `;
      case 'list':
        return `
          <div class="skeleton-list-item">
            ${avatar ? '<div class="skeleton skeleton-avatar"></div>' : ''}
            <div class="skeleton-content">
              <div class="skeleton skeleton-title" style="width: 40%"></div>
              <div class="skeleton skeleton-text"></div>
            </div>
          </div>
        `.repeat(lines);
      case 'text':
      default:
        return Array(lines).fill(0).map((_, i) => `
          <div class="skeleton skeleton-text" style="width: ${100 - i * 20}%"></div>
        `).join('');
    }
  }

  // Public API
  return {
    init,
    load,
    inject,
    render,
    createElement,
    clearCache,
    loadHeader,
    loadBottomNav,
    loadSidebar,
    loadComponentByPlaceholder,
    fetchComponent,
    createHeader,
    createBottomNav,
    createModal,
    createLoadingOverlay,
    createEmptyState,
    createCard,
    createListItem,
    createSkeleton
  };
})();

// Export
window.Components = Components;
