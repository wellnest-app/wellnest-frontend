/* ============================================
   WellNest Configuration
   การตั้งค่าหลักของแอป
   ============================================ */

const config = {
  // ===== API Configuration =====
  api: {
    // Base URL ของ Backend API
    // เปลี่ยนเป็น URL จริงเมื่อ deploy
    baseUrl: 'https://api.wellnest-care.com',
    
    // API Version
    version: 'v1',
    
    // Request timeout (ms)
    timeout: 30000,
    
    // Retry configuration
    retry: {
      maxRetries: 3,
      retryDelay: 1000
    }
  },
  
  // ===== Authentication =====
  auth: {
    // LocalStorage keys
    tokenKey: 'wellnest_token',
    userKey: 'wellnest_user',
    
    // Token expiration check interval (ms)
    tokenCheckInterval: 60000,
    
    // Redirect paths
    loginPath: '/wellnest-frontend/pages/auth/login.html',
    dashboardPath: '/wellnest-frontend/pages/dashboard.html',
    
    // Public paths (ไม่ต้อง login)
    publicPaths: [
      '/wellnest-frontend/',
      '/wellnest-frontend/index.html',
      '/wellnest-frontend/pages/auth/login.html',
      '/wellnest-frontend/pages/auth/register.html'
    ]
  },
  
  // ===== App Settings =====
  app: {
    // App name
    name: 'WellNest',
    
    // Default language
    defaultLang: 'th',
    
    // Supported languages
    supportedLangs: ['th', 'en'],
    
    // Language storage key
    langKey: 'wellnest_lang',
    
    // Theme storage key
    themeKey: 'wellnest_theme',
    
    // Default theme
    defaultTheme: 'light',
    
    // Timezone
    timezone: 'Asia/Bangkok',
    
    // Date/Time formats
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    dateTimeFormat: 'DD/MM/YYYY HH:mm'
  },
  
  // ===== MQTT Configuration =====
  mqtt: {
    // MQTT Broker URL (WebSocket)
    brokerUrl: 'wss://api.wellnest-care.com/mqtt',
    
    // MQTT Topics
    topics: {
      notifications: 'wellnest/user/{userId}/notifications',
      devices: 'wellnest/user/{userId}/devices',
      telemetry: 'wellnest/device/{deviceId}/telemetry'
    },
    
    // Connection options
    options: {
      keepalive: 60,
      reconnectPeriod: 5000,
      connectTimeout: 30000
    }
  },
  
  // ===== Push Notifications =====
  push: {
    // Firebase VAPID Key (สำหรับ Web Push)
    vapidKey: 'YOUR_FIREBASE_VAPID_KEY',
    
    // Firebase Config
    firebaseConfig: {
      apiKey: 'YOUR_FIREBASE_API_KEY',
      authDomain: 'YOUR_PROJECT.firebaseapp.com',
      projectId: 'YOUR_PROJECT_ID',
      storageBucket: 'YOUR_PROJECT.appspot.com',
      messagingSenderId: 'YOUR_SENDER_ID',
      appId: 'YOUR_APP_ID'
    }
  },
  
  // ===== Snooze Settings =====
  snooze: {
    // Available snooze durations (minutes)
    durations: [5, 10, 15, 30, 60],
    
    // Maximum snooze per day
    maxPerDay: 3,
    
    // Default snooze duration
    defaultDuration: 10
  },
  
  // ===== UI Settings =====
  ui: {
    // Toast duration (ms) - ✅ Bug Fix: เพิ่มจาก 4000 เป็น 5000 เพื่อให้อ่านทัน
    toastDuration: 5000,
    
    // Debounce delay for search (ms)
    searchDebounce: 300,
    
    // Animation duration (ms)
    animationDuration: 200,
    
    // Skeleton loading delay (ms)
    skeletonDelay: 150,
    
    // Infinite scroll threshold (px)
    scrollThreshold: 200,
    
    // Items per page
    pageSize: 20
  },
  
  // ===== Cache Settings =====
  cache: {
    // Default cache duration (ms) - 1 hour
    defaultTTL: 3600000,
    
    // Medication cache duration (ms) - 5 minutes
    medicationsTTL: 300000,
    
    // Reminders cache duration (ms) - 1 minute
    remindersTTL: 60000,
    
    // User data cache duration (ms) - 30 minutes
    userTTL: 1800000
  },
  
  // ===== Feature Flags =====
  features: {
    // Enable dark mode toggle
    darkMode: true,
    
    // Enable offline mode
    offlineMode: true,
    
    // Enable push notifications
    pushNotifications: true,
    
    // Enable MQTT realtime
    mqttRealtime: true,
    
    // Enable IoT devices
    iotDevices: true,
    
    // Enable analytics
    analytics: false
  },
  
  // ===== Validation Rules =====
  validation: {
    username: {
      minLength: 3,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9_]+$/
    },
    password: {
      minLength: 8,
      maxLength: 100
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  },
  
  // ===== Debug Mode =====
  debug: {
    // Enable debug mode
    enabled: false,
    
    // Log API calls
    logApi: false,
    
    // Log MQTT messages
    logMqtt: false
  }
};

// Helper function to get full API URL
config.getApiUrl = (endpoint) => {
  const base = config.api.baseUrl.replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}/api/${config.api.version}${path}`;
};

// Helper function to replace placeholders in MQTT topics
config.getMqttTopic = (topicKey, params = {}) => {
  let topic = config.mqtt.topics[topicKey];
  if (!topic) return null;
  
  Object.keys(params).forEach(key => {
    topic = topic.replace(`{${key}}`, params[key]);
  });
  
  return topic;
};

// Freeze config to prevent modifications
Object.freeze(config);
Object.freeze(config.api);
Object.freeze(config.auth);
Object.freeze(config.app);
Object.freeze(config.mqtt);
Object.freeze(config.push);
Object.freeze(config.snooze);
Object.freeze(config.ui);
Object.freeze(config.cache);
Object.freeze(config.features);
Object.freeze(config.validation);
Object.freeze(config.debug);

// Export for use in other modules
window.WellNestConfig = config;
