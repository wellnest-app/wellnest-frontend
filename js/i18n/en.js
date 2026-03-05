/* ============================================
   WellNest English Translations
   English
   ============================================ */

const en = {
  // ===== Common =====
  common: {
    appName: 'WellNest',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    retry: 'Retry',
    refresh: 'Refresh',
    viewAll: 'View All',
    noData: 'No data',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
    required: 'Required',
    optional: 'Optional'
  },
  
  // ===== Navigation =====
  nav: {
    home: 'Home',
    dashboard: 'Dashboard',
    medications: 'Medications',
    reminders: 'Reminders',
    notifications: 'Notifications',
    devices: 'Devices',
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout'
  },
  
  // ===== Auth =====
  auth: {
    login: 'Login',
    logout: 'Logout',
    register: 'Create Account',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    email: 'Email',
    fullName: 'Full Name',
    firstName: 'First Name',
    lastName: 'Last Name',
    forgotPassword: 'Forgot Password?',
    noAccount: 'Don\'t have an account?',
    haveAccount: 'Already have an account?',
    hasAccount: 'Already have an account?',
    createAccount: 'Create Account',
    loginNow: 'Login',
    registerSubtitle: 'Start your health journey',
    fullNamePlaceholder: 'Full Name',
    firstNamePlaceholder: 'First Name',
    lastNamePlaceholder: 'Last Name',
    usernamePlaceholder: 'Username (letters and numbers)',
    usernameHint: '3-50 characters (a-z, 0-9, _)',
    emailPlaceholder: 'your@email.com',
    passwordPlaceholder: 'At least 8 characters',
    confirmPasswordPlaceholder: 'Re-enter password',
    loginSuccess: 'Login successful',
    registerSuccess: 'Registration successful. Please login.',
    logoutSuccess: 'Logged out',
    loginFailed: 'Login failed',
    registerFailed: 'Registration failed',
    invalidCredentials: 'Invalid username or password',
    usernameExists: 'Username is already taken',
    sessionExpired: 'Session expired, please login again',
    welcomeBack: 'Welcome back',
    welcomeNew: 'Welcome to WellNest'
  },
  
  // ===== Dashboard =====
  dashboard: {
    greeting: {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
      night: 'Good night'
    },
    todayMeds: 'Today\'s Medications',
    upcomingReminders: 'Upcoming Reminders',
    compliance: 'Compliance Rate',
    devices: 'My Devices',
    quickActions: 'Quick Actions',
    searchMeds: 'Search Meds',
    myMeds: 'My Meds',
    reminders: 'Reminders',
    noReminders: 'No reminders yet',
    addReminder: 'Add Reminder',
    recentActivity: 'Recent Activity',
    noMedsToday: 'No medications for today',
    allDone: 'All done! 🎉',
    pendingMeds: '{count} pending'
  },
  
  // ===== Medications =====
  medications: {
    title: 'My Medications',
    catalog: 'Search Catalog',
    addNew: 'Add Medication',
    myMedications: 'My Medications',
    medicationName: 'Medication Name',
    dosageForm: 'Dosage Form',
    strength: 'Strength',
    description: 'Description',
    manufacturer: 'Manufacturer',
    prescribedDosage: 'Prescribed Dosage',
    startDate: 'Start Date',
    endDate: 'End Date',
    notes: 'Notes',
    quantity: 'Quantity',
    unit: 'Unit',
    frequency: 'Frequency',
    perDay: 'per day',
    dosageForms: {
      tablet: 'Tablet',
      capsule: 'Capsule',
      syrup: 'Syrup',
      injection: 'Injection',
      cream: 'Cream/Ointment',
      inhaler: 'Inhaler',
      drop: 'Drops'
    },
    calculationMode: {
      auto: 'Auto Calculate',
      manual: 'Manual',
      continuous: 'Continuous'
    },
    status: {
      active: 'Active',
      inactive: 'Inactive',
      expired: 'Expired'
    },
    actions: {
      take: 'Take',
      skip: 'Skip',
      snooze: 'Snooze',
      details: 'Details',
      remove: 'Remove'
    },
    messages: {
      addSuccess: 'Medication added',
      removeSuccess: 'Medication removed',
      takeSuccess: 'Medication taken',
      noMedications: 'No medications',
      searchEmpty: 'No medications found'
    },
    confirmRemove: 'Remove this medication from your list?'
  },
  
  // ===== Reminders =====
  reminders: {
    title: 'Medication Reminders',
    addReminder: 'Add Reminder',
    editReminder: 'Edit Reminder',
    reminderTime: 'Reminder Time',
    frequency: 'Frequency',
    frequencyTypes: {
      daily: 'Daily',
      once: 'Once'
    },
    enabled: 'Enabled',
    disabled: 'Disabled',
    add: {
      title: 'Add Reminder',
      medication: 'Medication',
      time: 'Reminder Time',
      frequency: 'Frequency',
      selectMedication: 'Select Medication',
      noMedications: 'No medications assigned',
      addMedicationFirst: 'Please add a medication first'
    },
    edit: {
      title: 'Edit Reminder',
      enabled: 'Enable Reminder',
      save: 'Save',
      delete: 'Delete'
    },
    frequency: {
      daily: 'Daily',
      dailyDesc: 'Remind every day at the same time',
      once: 'Once',
      onceDesc: 'Remind only once'
    },
    snooze: {
      title: 'Snooze Reminder',
      minutes: '{minutes} minutes',
      snoozed: 'Snoozed for {minutes} minutes',
      limitReached: 'Snooze limit ({max}) reached for today',
      remaining: '{count} snoozes remaining today'
    },
    messages: {
      addSuccess: 'Reminder added',
      updateSuccess: 'Reminder updated',
      deleteSuccess: 'Reminder deleted',
      snoozeSuccess: 'Reminder snoozed',
      noReminders: 'No reminders',
      selectMedication: 'Please select a medication'
    },
    confirmDelete: 'Delete this reminder?'
  },
  
  // ===== History =====
  history: {
    title: 'Medication History',
    filter: {
      all: 'All',
      today: 'Today',
      week: 'Last 7 days',
      month: '30 days'
    },
    stats: {
      taken: 'Taken',
      skipped: 'Skipped',
      rate: 'Compliance Rate'
    },
    status: {
      taken: 'Taken',
      skipped: 'Skipped',
      pending: 'Pending'
    },
    empty: {
      title: 'No history yet',
      description: 'Your medication history will appear here when you take or skip medications'
    },
    loadMore: 'Load More'
  },
  
  // ===== Notifications =====
  notifications: {
    title: 'Notifications',
    history: 'Notification History',
    stats: 'Statistics',
    pending: 'Pending',
    acknowledged: 'Acknowledged',
    types: {
      reminder: 'Medication Reminder',
      missed: 'Missed Medication',
      refill: 'Refill Needed',
      device: 'Device',
      system: 'System'
    },
    actions: {
      acknowledge: 'Acknowledge',
      viewAll: 'View All',
      markAllRead: 'Mark All Read',
      clearAll: 'Clear All'
    },
    complianceRate: 'Compliance Rate',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    noNotifications: 'No notifications',
    permissionDenied: 'Notification permission denied',
    enablePush: 'Enable Push Notifications'
  },
  
  // ===== Devices =====
  devices: {
    title: 'IoT Devices',
    myDevices: 'My Devices',
    claimDevice: 'Claim Device',
    deviceId: 'Device ID',
    deviceName: 'Device Name',
    serialNumber: 'Serial Number',
    status: 'Status',
    lastSeen: 'Last Seen',
    telemetry: 'Telemetry',
    temperature: 'Temperature',
    humidity: 'Humidity',
    power: 'Power',
    doorOpen: 'Door Open/Close',
    deviceStatus: {
      online: 'Online',
      offline: 'Offline',
      warning: 'Warning'
    },
    messages: {
      claimSuccess: 'Device claimed successfully',
      unclaimSuccess: 'Device unclaimed',
      notFound: 'Device not found',
      noDevices: 'No devices'
    },
    confirmUnclaim: 'Unclaim this device?'
  },
  
  // ===== Settings =====
  settings: {
    title: 'Settings',
    profile: 'Profile',
    account: 'Account',
    app: 'Application',
    notifications: 'Notifications',
    notificationsDesc: 'Enable/disable notifications',
    notificationsEnabled: 'Notifications enabled',
    notificationsDisabled: 'Notifications disabled',
    language: 'Language',
    theme: 'Theme',
    about: 'About',
    help: 'Help',
    privacy: 'Privacy',
    terms: 'Terms of Service',
    version: 'Version',
    editProfile: 'Edit Profile',
    editProfileDesc: 'Name, email, photo',
    changePassword: 'Change Password',
    changePasswordDesc: 'Current password, new password',
    logoutConfirm: 'Log out?',
    logoutMessage: 'You will need to log in again to use the app',
    languages: {
      th: 'Thai',
      en: 'English'
    },
    themes: {
      light: 'Light',
      dark: 'Dark',
      system: 'System'
    },
    pushSettings: {
      title: 'Push Notifications',
      enabled: 'Enabled',
      sound: 'Sound',
      vibration: 'Vibration',
      quiet: 'Quiet Mode'
    },
    messages: {
      updateSuccess: 'Settings saved',
      languageChanged: 'Language changed',
      themeChanged: 'Theme changed'
    }
  },
  
  // ===== Validation =====
  validation: {
    required: 'This field is required',
    invalidEmail: 'Invalid email format',
    minLength: 'Must be at least {min} characters',
    maxLength: 'Must not exceed {max} characters',
    passwordMatch: 'Passwords do not match',
    passwordMismatch: 'Passwords do not match',
    invalidUsername: 'Username can only contain a-z, A-Z, 0-9 and _',
    invalidPassword: 'Password must be at least 8 characters with letters and numbers',
    usernameTaken: 'Username is already taken',
    passwordWeak: 'Weak password',
    passwordMedium: 'Medium password',
    passwordStrong: 'Strong password'
  },
  
  // ===== Errors =====
  errors: {
    generic: 'An error occurred. Please try again.',
    network: 'Connection failed. Please check your internet.',
    timeout: 'Connection timed out',
    unauthorized: 'Please login again',
    forbidden: 'Access denied',
    notFound: 'Not found',
    serverError: 'Server error',
    offline: 'No internet connection'
  },
  
  // ===== Time =====
  time: {
    justNow: 'Just now',
    minutesAgo: '{n} minutes ago',
    hoursAgo: '{n} hours ago',
    daysAgo: '{n} days ago',
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow'
  }
};

// Export
window.i18n_en = en;
