/* ============================================
   WellNest Storage
   LocalStorage Cache & Data Management
   ============================================ */

const storage = {
  // ===== Storage Keys =====
  KEYS: {
    MEDICATIONS: 'wellnest_medications',
    REMINDERS: 'wellnest_reminders',
    NOTIFICATIONS: 'wellnest_notifications',
    DEVICES: 'wellnest_devices',
    USER: 'wellnest_user',
    LAST_SYNC: 'wellnest_last_sync',
    PENDING_ACTIONS: 'wellnest_pending_actions'
  },
  
  // ===== Basic Operations =====
  
  /**
   * Set item with timestamp
   * @param {string} key - Storage key
   * @param {any} data - Data to store
   * @param {number} ttl - Time to live in ms (optional)
   */
  set(key, data, ttl = null) {
    const config = window.WellNestConfig;
    
    const item = {
      data,
      timestamp: Date.now(),
      ttl: ttl || config.cache.defaultTTL
    };
    
    try {
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      // Handle quota exceeded
      if (error.name === 'QuotaExceededError') {
        this.cleanup();
        try {
          localStorage.setItem(key, JSON.stringify(item));
          return true;
        } catch {
          console.error('[Storage] Failed to save after cleanup:', key);
          return false;
        }
      }
      console.error('[Storage] Error saving:', key, error);
      return false;
    }
  },
  
  /**
   * Get item from storage
   * @param {string} key - Storage key
   * @param {boolean} ignoreExpiry - Ignore TTL check
   * @returns {any|null} - Stored data or null
   */
  get(key, ignoreExpiry = false) {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      
      const item = JSON.parse(stored);
      
      // Check expiry
      if (!ignoreExpiry && item.ttl) {
        const age = Date.now() - item.timestamp;
        if (age > item.ttl) {
          this.remove(key);
          return null;
        }
      }
      
      return item.data;
    } catch (error) {
      console.error('[Storage] Error reading:', key, error);
      return null;
    }
  },
  
  /**
   * Check if item exists and is valid
   * @param {string} key - Storage key
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== null;
  },
  
  /**
   * Remove item from storage
   * @param {string} key - Storage key
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('[Storage] Error removing:', key, error);
    }
  },
  
  /**
   * Clear all app-specific storage
   */
  clear() {
    Object.values(this.KEYS).forEach(key => {
      this.remove(key);
    });
  },
  
  /**
   * Cleanup expired items
   */
  cleanup() {
    const keysToCheck = [];
    
    // Get all wellnest keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('wellnest_')) {
        keysToCheck.push(key);
      }
    }
    
    // Remove expired items
    keysToCheck.forEach(key => {
      this.get(key); // This will remove if expired
    });
  },
  
  // ===== Medications Cache =====
  
  /**
   * Cache medications list
   * @param {array} medications - Medications array
   */
  setMedications(medications) {
    const config = window.WellNestConfig;
    return this.set(this.KEYS.MEDICATIONS, medications, config.cache.medicationsTTL);
  },
  
  /**
   * Get cached medications
   * @returns {array|null}
   */
  getMedications() {
    return this.get(this.KEYS.MEDICATIONS);
  },
  
  // ===== Reminders Cache =====
  
  /**
   * Cache reminders list
   * @param {array} reminders - Reminders array
   */
  setReminders(reminders) {
    const config = window.WellNestConfig;
    return this.set(this.KEYS.REMINDERS, reminders, config.cache.remindersTTL);
  },
  
  /**
   * Get cached reminders
   * @returns {array|null}
   */
  getReminders() {
    return this.get(this.KEYS.REMINDERS);
  },
  
  // ===== Notifications Cache =====
  
  /**
   * Cache notifications
   * @param {array} notifications - Notifications array
   */
  setNotifications(notifications) {
    return this.set(this.KEYS.NOTIFICATIONS, notifications);
  },
  
  /**
   * Get cached notifications
   * @returns {array|null}
   */
  getNotifications() {
    return this.get(this.KEYS.NOTIFICATIONS);
  },
  
  // ===== Devices Cache =====
  
  /**
   * Cache devices list
   * @param {array} devices - Devices array
   */
  setDevices(devices) {
    return this.set(this.KEYS.DEVICES, devices);
  },
  
  /**
   * Get cached devices
   * @returns {array|null}
   */
  getDevices() {
    return this.get(this.KEYS.DEVICES);
  },
  
  // ===== Sync Management =====
  
  /**
   * Record last sync time
   */
  recordSync() {
    this.set(this.KEYS.LAST_SYNC, new Date().toISOString());
  },
  
  /**
   * Get last sync time
   * @returns {Date|null}
   */
  getLastSync() {
    const iso = this.get(this.KEYS.LAST_SYNC, true);
    return iso ? new Date(iso) : null;
  },
  
  /**
   * Check if sync is needed
   * @param {number} maxAge - Maximum age in ms
   * @returns {boolean}
   */
  needsSync(maxAge = 60000) {
    const lastSync = this.getLastSync();
    if (!lastSync) return true;
    
    return Date.now() - lastSync.getTime() > maxAge;
  },
  
  // ===== Offline Queue =====
  
  /**
   * Add pending action for offline sync
   * @param {object} action - Action to queue
   */
  addPendingAction(action) {
    const pending = this.get(this.KEYS.PENDING_ACTIONS, true) || [];
    pending.push({
      ...action,
      id: Date.now(),
      timestamp: new Date().toISOString()
    });
    this.set(this.KEYS.PENDING_ACTIONS, pending);
  },
  
  /**
   * Get pending actions
   * @returns {array}
   */
  getPendingActions() {
    return this.get(this.KEYS.PENDING_ACTIONS, true) || [];
  },
  
  /**
   * Remove pending action
   * @param {number} actionId - Action ID to remove
   */
  removePendingAction(actionId) {
    const pending = this.getPendingActions();
    const filtered = pending.filter(a => a.id !== actionId);
    this.set(this.KEYS.PENDING_ACTIONS, filtered);
  },
  
  /**
   * Clear all pending actions
   */
  clearPendingActions() {
    this.remove(this.KEYS.PENDING_ACTIONS);
  },
  
  /**
   * Sync pending actions when online
   * @returns {Promise<object>} - Sync results
   */
  async syncPendingActions() {
    if (!navigator.onLine) {
      return { success: false, message: 'ไม่มีการเชื่อมต่ออินเทอร์เน็ต' };
    }
    
    const pending = this.getPendingActions();
    if (pending.length === 0) {
      return { success: true, synced: 0 };
    }
    
    let synced = 0;
    let failed = 0;
    
    for (const action of pending) {
      try {
        await this.executeAction(action);
        this.removePendingAction(action.id);
        synced++;
      } catch (error) {
        console.error('[Storage] Sync action failed:', action, error);
        failed++;
      }
    }
    
    return { success: failed === 0, synced, failed };
  },
  
  /**
   * Execute a queued action
   * @param {object} action - Action to execute
   */
  async executeAction(action) {
    switch (action.type) {
      case 'TAKE_MEDICATION':
        await api.post('/medication/take', action.data);
        break;
      case 'SNOOZE_REMINDER':
        await api.post(`/reminders/${action.data.reminderId}/snooze`, {
          snooze_minutes: action.data.minutes
        });
        break;
      case 'ACKNOWLEDGE_NOTIFICATION':
        await api.patch(`/notifications/${action.data.notificationId}/acknowledge`);
        break;
      default:
        console.warn('[Storage] Unknown action type:', action.type);
    }
  },
  
  // ===== Full Sync =====
  
  /**
   * Sync all data with server
   * @returns {Promise<boolean>}
   */
  async sync() {
    if (!navigator.onLine) {
      console.log('[Storage] Offline, skipping sync');
      return false;
    }
    
    try {
      // Sync pending actions first
      await this.syncPendingActions();
      
      // Fetch fresh data
      const [medications, reminders] = await Promise.all([
        api.get('/medications/mine').catch(() => null),
        api.get('/reminders').catch(() => null)
      ]);
      
      // Update cache
      if (medications) this.setMedications(medications);
      if (reminders) this.setReminders(reminders);
      
      // Record sync time
      this.recordSync();
      
      return true;
    } catch (error) {
      console.error('[Storage] Sync failed:', error);
      return false;
    }
  }
};

// ===== Network Status Listener =====

// Auto-sync when coming online
window.addEventListener('online', () => {
  console.log('[Storage] Back online, syncing...');
  storage.syncPendingActions();
});

// Export for global use
window.storage = storage;
