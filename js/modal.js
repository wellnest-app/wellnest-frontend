/* ============================================
   WellNest Modal Manager
   Dialog and popup handling
   ============================================ */

const Modal = (function() {
  'use strict';

  // Active modals stack
  const activeModals = [];

  // Modal templates container
  let container = null;

  /**
   * Initialize modal system
   */
  function init() {
    // Create modal container if not exists
    if (!container) {
      container = document.createElement('div');
      container.id = 'modal-container';
      document.body.appendChild(container);
    }

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && activeModals.length > 0) {
        const topModal = activeModals[activeModals.length - 1];
        if (topModal.closable !== false) {
          close(topModal.id);
        }
      }
    });
  }

  /**
   * Show modal
   * @param {Object} options - Modal options
   * @returns {string} Modal ID
   */
  function show(options = {}) {
    const {
      id = `modal-${Date.now()}`,
      title = '',
      content = '',
      actions = [],
      size = 'md',
      closable = true,
      onOpen = null,
      onClose = null
    } = options;

    // Create modal HTML
    const modalHtml = `
      <div class="modal-overlay" id="${id}" role="dialog" aria-modal="true" aria-labelledby="${id}-title">
        <div class="modal-backdrop" onclick="${closable ? `Modal.close('${id}')` : ''}"></div>
        <div class="modal-container modal-${size}" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title" id="${id}-title">${title}</h2>
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
                        id="${action.id || ''}"
                        onclick="${action.onclick || `Modal.close('${id}')`}"
                        ${action.disabled ? 'disabled' : ''}>
                  ${action.label}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // Add to container
    container.insertAdjacentHTML('beforeend', modalHtml);

    // Get modal element
    const modalEl = document.getElementById(id);

    // Store modal info
    activeModals.push({ id, closable, onClose });

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Animate in
    requestAnimationFrame(() => {
      modalEl.classList.add('modal-visible');
    });

    // Apply translations
    if (window.I18n) {
      window.I18n.applyTranslations();
    }

    // Call onOpen callback
    if (onOpen && typeof onOpen === 'function') {
      onOpen(modalEl);
    }

    // Focus first focusable element
    const focusable = modalEl.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) {
      focusable.focus();
    }

    return id;
  }

  /**
   * Close modal
   * @param {string} id - Modal ID (optional, closes top modal if not provided)
   */
  function close(id) {
    // If no id provided, close the top modal
    if (!id && activeModals.length > 0) {
      id = activeModals[activeModals.length - 1].id;
    }
    
    const modalEl = document.getElementById(id);
    if (!modalEl) return;

    // Find modal info
    const modalIndex = activeModals.findIndex(m => m.id === id);
    const modalInfo = modalIndex >= 0 ? activeModals[modalIndex] : null;

    // Animate out
    modalEl.classList.remove('modal-visible');
    modalEl.classList.add('modal-closing');

    // Remove after animation
    setTimeout(() => {
      modalEl.remove();

      // Remove from active modals
      if (modalIndex >= 0) {
        activeModals.splice(modalIndex, 1);
      }

      // Restore body scroll if no more modals
      if (activeModals.length === 0) {
        document.body.style.overflow = '';
      }

      // Call onClose callback
      if (modalInfo?.onClose && typeof modalInfo.onClose === 'function') {
        modalInfo.onClose();
      }
    }, 200);
  }

  /**
   * Close all modals
   */
  function closeAll() {
    [...activeModals].forEach(modal => close(modal.id));
  }

  /**
   * Show confirm dialog
   * @param {Object} options - Confirm options
   * @returns {Promise<boolean>}
   */
  function confirm(options = {}) {
    const {
      title = window.t ? window.t('common.confirm') : 'ยืนยัน',
      message = '',
      confirmText = window.t ? window.t('common.confirm') : 'ยืนยัน',
      cancelText = window.t ? window.t('common.cancel') : 'ยกเลิก',
      confirmClass = 'btn-primary',
      dangerous = false
    } = options;

    return new Promise((resolve) => {
      const id = show({
        title,
        content: `<p class="text-center py-4">${message}</p>`,
        size: 'sm',
        actions: [
          {
            label: cancelText,
            class: 'btn-outline',
            onclick: `Modal.close('${id}'); window._modalResolve && window._modalResolve(false);`
          },
          {
            label: confirmText,
            class: dangerous ? 'btn-error' : confirmClass,
            onclick: `Modal.close('${id}'); window._modalResolve && window._modalResolve(true);`
          }
        ],
        onClose: () => {
          resolve(false);
          delete window._modalResolve;
        }
      });

      window._modalResolve = resolve;
    });
  }

  /**
   * Show alert dialog
   * @param {Object} options - Alert options
   * @returns {Promise<void>}
   */
  function alert(options = {}) {
    const {
      title = '',
      message = '',
      buttonText = window.t ? window.t('common.ok') : 'ตกลง',
      type = 'info' // info, success, warning, error
    } = options;

    const icons = {
      info: '<svg class="w-12 h-12 text-blue-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      success: '<svg class="w-12 h-12 text-green-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      warning: '<svg class="w-12 h-12 text-yellow-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      error: '<svg class="w-12 h-12 text-red-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
    };

    return new Promise((resolve) => {
      const id = show({
        title,
        content: `
          <div class="text-center py-4">
            ${icons[type] || ''}
            <p>${message}</p>
          </div>
        `,
        size: 'sm',
        actions: [
          {
            label: buttonText,
            class: 'btn-primary w-full',
            onclick: `Modal.close('${id}')`
          }
        ],
        onClose: resolve
      });
    });
  }

  /**
   * Show prompt dialog
   * @param {Object} options - Prompt options
   * @returns {Promise<string|null>}
   */
  function prompt(options = {}) {
    const {
      title = '',
      message = '',
      placeholder = '',
      defaultValue = '',
      inputType = 'text',
      confirmText = window.t ? window.t('common.confirm') : 'ยืนยัน',
      cancelText = window.t ? window.t('common.cancel') : 'ยกเลิก'
    } = options;

    return new Promise((resolve) => {
      const inputId = `prompt-input-${Date.now()}`;
      const id = show({
        title,
        content: `
          <div class="py-4">
            ${message ? `<p class="mb-4">${message}</p>` : ''}
            <input type="${inputType}" 
                   id="${inputId}" 
                   class="input input-bordered w-full" 
                   placeholder="${placeholder}"
                   value="${defaultValue}">
          </div>
        `,
        size: 'sm',
        actions: [
          {
            label: cancelText,
            class: 'btn-outline',
            onclick: `Modal.close('${id}'); window._promptResolve && window._promptResolve(null);`
          },
          {
            label: confirmText,
            class: 'btn-primary',
            onclick: `
              const val = document.getElementById('${inputId}').value;
              Modal.close('${id}');
              window._promptResolve && window._promptResolve(val);
            `
          }
        ],
        onOpen: (el) => {
          const input = el.querySelector(`#${inputId}`);
          if (input) {
            input.focus();
            input.select();
          }
        },
        onClose: () => {
          resolve(null);
          delete window._promptResolve;
        }
      });

      window._promptResolve = resolve;
    });
  }

  /**
   * Show loading modal
   * @param {string} message - Loading message
   * @returns {string} Modal ID
   */
  function loading(message = '') {
    const loadingText = message || (window.t ? window.t('common.loading') : 'กำลังโหลด...');
    
    return show({
      content: `
        <div class="text-center py-8">
          <div class="loading-spinner mx-auto mb-4">
            <svg class="spinner w-12 h-12" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="4" class="text-primary"></circle>
            </svg>
          </div>
          <p class="text-gray-600">${loadingText}</p>
        </div>
      `,
      size: 'sm',
      closable: false
    });
  }

  /**
   * Update modal content
   * @param {string} id - Modal ID
   * @param {string} content - New content
   */
  function updateContent(id, content) {
    const modalEl = document.getElementById(id);
    if (!modalEl) return;

    const bodyEl = modalEl.querySelector('.modal-body');
    if (bodyEl) {
      bodyEl.innerHTML = content;

      // Apply translations
      if (window.I18n) {
        window.I18n.applyTranslations();
      }
    }
  }

  /**
   * Check if modal is open
   * @param {string} id - Modal ID
   * @returns {boolean}
   */
  function isOpen(id) {
    return activeModals.some(m => m.id === id);
  }

  /**
   * Get active modal count
   * @returns {number}
   */
  function getActiveCount() {
    return activeModals.length;
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    show,
    close,
    closeAll,
    confirm,
    alert,
    prompt,
    loading,
    updateContent,
    isOpen,
    getActiveCount
  };
})();

// Export
window.Modal = Modal;
