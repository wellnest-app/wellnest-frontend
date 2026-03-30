/* ============================================
   WellNest — Native Push Notifications (Capacitor)
   ใช้ @capacitor/push-notifications plugin
   สำหรับ Android/iOS native app
   
   ไฟล์นี้ทำงานเฉพาะเมื่อรันใน Capacitor
   PWA บน browser ยังใช้ Web FCM เดิม
   ============================================ */

const NativePush = (function() {
  'use strict';

  // ใช้ key เดียวกับ Web FCM เพื่อให้ settings page sync ได้
  const PUSH_REGISTERED_KEY = 'wellnest_push_registered';
  const PUSH_TOKEN_KEY = 'wellnest_push_token';

  let _initialized = false;
  let _onNotificationCallback = null;

  // ============================================================
  // Detection
  // ============================================================

  /**
   * ตรวจว่า Capacitor Push Plugin พร้อมใช้งานหรือไม่
   */
  function isAvailable() {
    return window.Capacitor && 
           window.Capacitor.isNativePlatform && 
           window.Capacitor.isNativePlatform() &&
           window.Capacitor.Plugins && 
           window.Capacitor.Plugins.PushNotifications;
  }

  // ============================================================
  // Core Functions
  // ============================================================

  /**
   * เริ่มต้น Native Push Notifications
   * Flow: requestPermissions → register → listener ได้ token → register กับ backend
   * 
   * @param {Object} options
   * @param {Function} options.onStatusChange - callback(icon, text, show) เมื่อสถานะเปลี่ยน
   * @param {Function} options.onNotification - callback(notification) เมื่อได้รับ push ขณะเปิดแอป
   * @returns {Promise<boolean>} true ถ้าสำเร็จ
   */
  async function init(options) {
    if (!isAvailable()) {
      console.log('[NativePush] ไม่ใช่ Capacitor native — ข้าม');
      return false;
    }

    if (_initialized) {
      console.log('[NativePush] เริ่มต้นแล้ว — ข้าม');
      return true;
    }

    var showStatus = (options && options.onStatusChange) ? options.onStatusChange : function() {};
    _onNotificationCallback = (options && options.onNotification) ? options.onNotification : null;

    var PushNotifications = window.Capacitor.Plugins.PushNotifications;

    try {
      // --- 1. ขอ Permission ---
      console.log('[NativePush] กำลังขอ permission...');
      var permResult = await PushNotifications.requestPermissions();
      console.log('[NativePush] Permission result:', permResult.receive);

      if (permResult.receive !== 'granted') {
        console.log('[NativePush] Permission ไม่ได้รับ:', permResult.receive);
        showStatus('🔕', 'การแจ้งเตือนถูกปิด (เปิดได้ในตั้งค่าแอป)', true);
        return false;
      }

      // --- 2. ตั้ง Listeners ก่อน register ---

      // 2a. Registration success → ได้ FCM token
      PushNotifications.addListener('registration', async function(token) {
        console.log('[NativePush] ได้ FCM token:', token.value.substring(0, 20) + '...');
        await _registerTokenWithBackend(token.value, showStatus);
      });

      // 2b. Registration error
      PushNotifications.addListener('registrationError', function(error) {
        console.error('[NativePush] Registration error:', error);
        showStatus('⚠️', 'ลงทะเบียนแจ้งเตือนไม่สำเร็จ', true);
      });

      // 2c. Foreground notification — แอปเปิดอยู่ ได้รับ push
      PushNotifications.addListener('pushNotificationReceived', function(notification) {
        console.log('[NativePush] Foreground notification:', notification);
        if (_onNotificationCallback) {
          _onNotificationCallback(notification);
        }
      });

      // 2d. User tap notification — กด notification เปิดแอป
      PushNotifications.addListener('pushNotificationActionPerformed', function(action) {
        console.log('[NativePush] Notification tapped:', action);
        // Navigate ไป dashboard (หรือหน้าที่เกี่ยวข้อง)
        var data = action.notification.data;
        if (data && (data.type === 'medication_reminder' || data.type === 'reminder')) {
          window.location.href = '/wellnest-frontend/pages/dashboard.html';
        }
      });

      // --- 3. Register กับ FCM ---
      // จะ trigger 'registration' listener เมื่อได้ token
      console.log('[NativePush] กำลัง register กับ FCM...');
      await PushNotifications.register();

      _initialized = true;
      console.log('[NativePush] เริ่มต้นสำเร็จ — รอ token จาก FCM...');
      return true;

    } catch (error) {
      console.error('[NativePush] init error:', error);
      showStatus('⚠️', 'ตั้งค่าการแจ้งเตือนไม่สำเร็จ', true);
      return false;
    }
  }

  /**
   * Register FCM token กับ backend API
   * @private
   */
  async function _registerTokenWithBackend(fcmToken, showStatus) {
    try {
      var savedToken = localStorage.getItem(PUSH_TOKEN_KEY);
      var isAlreadyRegistered = localStorage.getItem(PUSH_REGISTERED_KEY) === 'true';

      // ถ้า token เดิมและ register แล้ว → ข้าม
      if (isAlreadyRegistered && savedToken === fcmToken) {
        console.log('[NativePush] Token เดิม — ข้ามการ register');
        showStatus('🔔', 'การแจ้งเตือนเปิดอยู่', true);
        return;
      }

      // เรียก API register
      console.log('[NativePush] กำลัง register token กับ Backend...');
      var result = await Api.post('/push/register', {
        fcm_token: fcmToken,
        device_type: 'android',
        device_name: navigator.userAgent.substring(0, 50)
      });
      console.log('[NativePush] Register สำเร็จ:', result);

      // บันทึก flag ใน localStorage (ใช้ key เดียวกับ Web FCM)
      localStorage.setItem(PUSH_REGISTERED_KEY, 'true');
      localStorage.setItem(PUSH_TOKEN_KEY, fcmToken);

      showStatus('🔔', 'เปิดการแจ้งเตือนสำเร็จ', true);

    } catch (error) {
      console.error('[NativePush] Register กับ Backend ล้มเหลว:', error);
      showStatus('⚠️', 'ลงทะเบียนแจ้งเตือนไม่สำเร็จ', true);
    }
  }

  // ============================================================
  // Unregister
  // ============================================================

  /**
   * ยกเลิกการลงทะเบียน push notification
   * เรียก API unregister + ลบ flag ใน localStorage
   * @returns {Promise<boolean>}
   */
  async function unregister() {
    try {
      var savedToken = localStorage.getItem(PUSH_TOKEN_KEY);
      if (savedToken) {
        try {
          await Api.post('/push/unregister', { fcm_token: savedToken });
          console.log('[NativePush] Token unregistered จาก backend');
        } catch (apiErr) {
          console.warn('[NativePush] Unregister API error:', apiErr.message);
        }
      }

      localStorage.removeItem(PUSH_REGISTERED_KEY);
      localStorage.removeItem(PUSH_TOKEN_KEY);
      _initialized = false;

      console.log('[NativePush] Unregistered สำเร็จ');
      return true;

    } catch (error) {
      console.error('[NativePush] Unregister error:', error);
      return false;
    }
  }

  // ============================================================
  // Status Helpers
  // ============================================================

  /**
   * ตรวจว่า register แล้วหรือยัง (จาก localStorage)
   */
  function isRegistered() {
    return localStorage.getItem(PUSH_REGISTERED_KEY) === 'true';
  }

  /**
   * ตรวจสถานะ permission ปัจจุบัน
   * @returns {Promise<string>} 'prompt' | 'granted' | 'denied' | 'unavailable'
   */
  async function checkPermissions() {
    if (!isAvailable()) return 'unavailable';
    try {
      var result = await window.Capacitor.Plugins.PushNotifications.checkPermissions();
      return result.receive;
    } catch (e) {
      return 'unavailable';
    }
  }

  // ============================================================
  // Public API
  // ============================================================
  return {
    isAvailable: isAvailable,
    init: init,
    unregister: unregister,
    isRegistered: isRegistered,
    checkPermissions: checkPermissions
  };

})();

// Export to window
window.NativePush = NativePush;
