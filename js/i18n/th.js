/* ============================================
   WellNest Thai Translations
   ภาษาไทย
   ============================================ */

const th = {
  // ===== Common =====
  common: {
    appName: 'WellNest',
    loading: 'กำลังโหลด...',
    save: 'บันทึก',
    cancel: 'ยกเลิก',
    confirm: 'ยืนยัน',
    delete: 'ลบ',
    edit: 'แก้ไข',
    add: 'เพิ่ม',
    search: 'ค้นหา',
    filter: 'กรอง',
    sort: 'เรียง',
    close: 'ปิด',
    back: 'กลับ',
    next: 'ถัดไป',
    done: 'เสร็จสิ้น',
    yes: 'ใช่',
    no: 'ไม่',
    ok: 'ตกลง',
    retry: 'ลองใหม่',
    refresh: 'รีเฟรช',
    viewAll: 'ดูทั้งหมด',
    noData: 'ไม่มีข้อมูล',
    error: 'เกิดข้อผิดพลาด',
    success: 'สำเร็จ',
    warning: 'คำเตือน',
    info: 'ข้อมูล',
    required: 'จำเป็น',
    optional: 'ไม่บังคับ'
  },
  
  // ===== Navigation =====
  nav: {
    home: 'หน้าหลัก',
    dashboard: 'แดชบอร์ด',
    medications: 'รายการยา',
    reminders: 'การเตือน',
    notifications: 'การแจ้งเตือน',
    devices: 'อุปกรณ์',
    settings: 'ตั้งค่า',
    profile: 'โปรไฟล์',
    logout: 'ออกจากระบบ'
  },
  
  // ===== Auth =====
  auth: {
    login: 'เข้าสู่ระบบ',
    logout: 'ออกจากระบบ',
    register: 'สร้างบัญชี',
    username: 'ชื่อผู้ใช้',
    password: 'รหัสผ่าน',
    confirmPassword: 'ยืนยันรหัสผ่าน',
    email: 'อีเมล',
    fullName: 'ชื่อ-นามสกุล',
    firstName: 'ชื่อจริง',
    lastName: 'นามสกุล',
    forgotPassword: 'ลืมรหัสผ่าน?',
    noAccount: 'ยังไม่มีบัญชี?',
    haveAccount: 'มีบัญชีอยู่แล้ว?',
    hasAccount: 'มีบัญชีอยู่แล้ว?',
    createAccount: 'สร้างบัญชีใหม่',
    loginNow: 'เข้าสู่ระบบ',
    registerSubtitle: 'เริ่มต้นดูแลสุขภาพของคุณ',
    fullNamePlaceholder: 'ชื่อ นามสกุล',
    firstNamePlaceholder: 'ชื่อ',
    lastNamePlaceholder: 'นามสกุล',
    usernamePlaceholder: 'ชื่อผู้ใช้ (ภาษาอังกฤษและตัวเลข)',
    usernameHint: '3-50 ตัวอักษร (a-z, 0-9, _)',
    emailPlaceholder: 'your@email.com',
    passwordPlaceholder: 'อย่างน้อย 8 ตัวอักษร',
    confirmPasswordPlaceholder: 'กรอกรหัสผ่านอีกครั้ง',
    loginSuccess: 'เข้าสู่ระบบสำเร็จ',
    registerSuccess: 'สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ',
    logoutSuccess: 'ออกจากระบบแล้ว',
    loginFailed: 'เข้าสู่ระบบไม่สำเร็จ',
    registerFailed: 'สมัครสมาชิกไม่สำเร็จ',
    invalidCredentials: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
    usernameExists: 'ชื่อผู้ใช้นี้ถูกใช้แล้ว',
    sessionExpired: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่',
    welcomeBack: 'ยินดีต้อนรับกลับมา',
    welcomeNew: 'ยินดีต้อนรับสู่ WellNest'
  },
  
  // ===== Dashboard =====
  dashboard: {
    greeting: {
      morning: 'สวัสดีตอนเช้า',
      afternoon: 'สวัสดีตอนบ่าย',
      evening: 'สวัสดีตอนเย็น',
      night: 'สวัสดีตอนค่ำ'
    },
    todayMeds: 'ยาวันนี้',
    upcomingReminders: 'การเตือนที่กำลังมา',
    compliance: 'อัตราการทานยา',
    devices: 'อุปกรณ์ของฉัน',
    quickActions: 'ทางลัด',
    searchMeds: 'ค้นหายา',
    myMeds: 'ยาของฉัน',
    reminders: 'การเตือน',
    noReminders: 'ยังไม่มีการเตือน',
    addReminder: 'เพิ่มการเตือน',
    recentActivity: 'กิจกรรมล่าสุด',
    noMedsToday: 'ไม่มียาที่ต้องทานวันนี้',
    allDone: 'ทานยาครบแล้ว! 🎉',
    pendingMeds: 'รอทาน {count} รายการ'
  },
  
  // ===== Medications =====
  medications: {
    title: 'รายการยาของฉัน',
    catalog: 'ค้นหายา',
    addNew: 'เพิ่มยาใหม่',
    myMedications: 'ยาของฉัน',
    medicationName: 'ชื่อยา',
    dosageForm: 'รูปแบบยา',
    strength: 'ความแรง',
    description: 'คำอธิบาย',
    manufacturer: 'ผู้ผลิต',
    prescribedDosage: 'ขนาดที่สั่ง',
    startDate: 'วันที่เริ่ม',
    endDate: 'วันที่สิ้นสุด',
    notes: 'หมายเหตุ',
    quantity: 'จำนวน',
    unit: 'หน่วย',
    frequency: 'ความถี่',
    perDay: 'ต่อวัน',
    dosageForms: {
      tablet: 'เม็ด',
      capsule: 'แคปซูล',
      syrup: 'น้ำเชื่อม',
      injection: 'ฉีด',
      cream: 'ครีม/ขี้ผึ้ง',
      inhaler: 'พ่น',
      drop: 'หยด'
    },
    calculationMode: {
      auto: 'คำนวณอัตโนมัติ',
      manual: 'กำหนดเอง',
      continuous: 'ใช้ต่อเนื่อง'
    },
    status: {
      active: 'กำลังใช้',
      inactive: 'หยุดใช้',
      expired: 'หมดอายุ'
    },
    actions: {
      take: 'ทานยา',
      skip: 'ข้าม',
      snooze: 'เลื่อน',
      details: 'รายละเอียด',
      remove: 'นำออก'
    },
    messages: {
      addSuccess: 'เพิ่มยาสำเร็จ',
      removeSuccess: 'นำยาออกแล้ว',
      takeSuccess: 'บันทึกการทานยาแล้ว',
      noMedications: 'ยังไม่มียา',
      searchEmpty: 'ไม่พบยาที่ค้นหา'
    },
    confirmRemove: 'ต้องการนำยานี้ออกจากรายการหรือไม่?'
  },
  
  // ===== Reminders =====
  reminders: {
    title: 'การเตือนทานยา',
    addReminder: 'เพิ่มการเตือน',
    editReminder: 'แก้ไขการเตือน',
    reminderTime: 'เวลาเตือน',
    frequency: 'ความถี่',
    frequencyTypes: {
      daily: 'ทุกวัน',
      once: 'ครั้งเดียว'
    },
    enabled: 'เปิดใช้งาน',
    disabled: 'ปิดใช้งาน',
    // M3 Fix: shortcut keys สำหรับ dashboard Toast
    taken: 'บันทึกการทานยาแล้ว',
    snoozed: 'เลื่อนแล้ว {minutes} นาที',
    add: {
      title: 'เพิ่มการเตือน',
      medication: 'ยา',
      time: 'เวลาเตือน',
      frequency: 'ความถี่',
      selectMedication: 'เลือกยา',
      noMedications: 'ยังไม่มียาที่กำหนดไว้',
      addMedicationFirst: 'กรุณาเพิ่มยาก่อนสร้างการเตือน'
    },
    edit: {
      title: 'แก้ไขการเตือน',
      enabled: 'เปิดการเตือน',
      save: 'บันทึก',
      delete: 'ลบ'
    },
    frequency: {
      daily: 'ทุกวัน',
      dailyDesc: 'เตือนทุกวันในเวลาเดียวกัน',
      once: 'ครั้งเดียว',
      onceDesc: 'เตือนเพียงครั้งเดียว'
    },
    snooze: {
      title: 'เลื่อนการเตือน',
      minutes: '{minutes} นาที',
      snoozed: 'เลื่อนแล้ว {minutes} นาที',
      limitReached: 'เลื่อนครบ {max} ครั้งแล้ววันนี้',
      remaining: 'เหลืออีก {count} ครั้งวันนี้'
    },
    messages: {
      addSuccess: 'เพิ่มการเตือนสำเร็จ',
      updateSuccess: 'แก้ไขการเตือนสำเร็จ',
      deleteSuccess: 'ลบการเตือนแล้ว',
      snoozeSuccess: 'เลื่อนการเตือนแล้ว',
      noReminders: 'ยังไม่มีการเตือน',
      selectMedication: 'กรุณาเลือกยา'
    },
    confirmDelete: 'ต้องการลบการเตือนนี้หรือไม่?'
  },
  
  // ===== History =====
  history: {
    title: 'ประวัติการทานยา',
    filter: {
      all: 'ทั้งหมด',
      today: 'วันนี้',
      week: '7 วันที่ผ่านมา',
      month: '30 วัน'
    },
    stats: {
      taken: 'ทานแล้ว',
      skipped: 'ข้าม',
      rate: 'อัตราการทาน'
    },
    status: {
      taken: 'ทานแล้ว',
      skipped: 'ข้าม',
      pending: 'รอทาน'
    },
    empty: {
      title: 'ยังไม่มีประวัติ',
      description: 'ประวัติการทานยาจะปรากฏที่นี่เมื่อคุณกดทานหรือข้ามยา'
    },
    loadMore: 'โหลดเพิ่มเติม'
  },
  
  // ===== Notifications =====
  notifications: {
    title: 'การแจ้งเตือน',
    history: 'ประวัติการแจ้งเตือน',
    stats: 'สถิติ',
    pending: 'รอดำเนินการ',
    acknowledged: 'รับทราบแล้ว',
    types: {
      reminder: 'เตือนทานยา',
      missed: 'พลาดการทานยา',
      refill: 'ยาใกล้หมด',
      device: 'อุปกรณ์',
      system: 'ระบบ'
    },
    actions: {
      acknowledge: 'รับทราบ',
      viewAll: 'ดูทั้งหมด',
      markAllRead: 'อ่านทั้งหมด',
      clearAll: 'ล้างทั้งหมด'
    },
    complianceRate: 'อัตราการทานยา',
    thisWeek: 'สัปดาห์นี้',
    thisMonth: 'เดือนนี้',
    noNotifications: 'ไม่มีการแจ้งเตือน',
    permissionDenied: 'ไม่อนุญาตการแจ้งเตือน',
    enablePush: 'เปิดรับการแจ้งเตือน'
  },
  
  // ===== Devices =====
  devices: {
    title: 'อุปกรณ์ IoT',
    myDevices: 'อุปกรณ์ของฉัน',
    claimDevice: 'ลงทะเบียนอุปกรณ์',
    deviceId: 'รหัสอุปกรณ์',
    deviceName: 'ชื่ออุปกรณ์',
    serialNumber: 'หมายเลขซีเรียล',
    status: 'สถานะ',
    lastSeen: 'ออนไลน์ล่าสุด',
    telemetry: 'ข้อมูลเซ็นเซอร์',
    temperature: 'อุณหภูมิ',
    humidity: 'ความชื้น',
    power: 'พลังงาน',
    doorOpen: 'เปิด/ปิดประตู',
    deviceStatus: {
      online: 'ออนไลน์',
      offline: 'ออฟไลน์',
      warning: 'มีปัญหา'
    },
    messages: {
      claimSuccess: 'ลงทะเบียนอุปกรณ์สำเร็จ',
      unclaimSuccess: 'ยกเลิกการลงทะเบียนแล้ว',
      notFound: 'ไม่พบอุปกรณ์',
      noDevices: 'ยังไม่มีอุปกรณ์'
    },
    confirmUnclaim: 'ต้องการยกเลิกการลงทะเบียนอุปกรณ์นี้หรือไม่?'
  },
  
  // ===== Settings =====
  settings: {
    title: 'ตั้งค่า',
    profile: 'ข้อมูลส่วนตัว',
    account: 'บัญชี',
    app: 'แอปพลิเคชัน',
    notifications: 'การแจ้งเตือน',
    notificationsDesc: 'เปิด/ปิดการแจ้งเตือน',
    notificationsEnabled: 'เปิดการแจ้งเตือนแล้ว',
    notificationsDisabled: 'ปิดการแจ้งเตือนแล้ว',
    language: 'ภาษา',
    theme: 'ธีม',
    about: 'เกี่ยวกับ',
    help: 'ช่วยเหลือ',
    privacy: 'ความเป็นส่วนตัว',
    terms: 'เงื่อนไขการใช้งาน',
    version: 'เวอร์ชัน',
    editProfile: 'แก้ไขโปรไฟล์',
    editProfileDesc: 'ชื่อ, อีเมล, รูปภาพ',
    changePassword: 'เปลี่ยนรหัสผ่าน',
    changePasswordDesc: 'รหัสผ่านปัจจุบัน, รหัสผ่านใหม่',
    logoutConfirm: 'ออกจากระบบ?',
    logoutMessage: 'คุณจะต้องเข้าสู่ระบบใหม่อีกครั้งเมื่อต้องการใช้งาน',
    languages: {
      th: 'ไทย',
      en: 'English'
    },
    themes: {
      light: 'สว่าง',
      dark: 'มืด',
      system: 'ตามระบบ'
    },
    pushSettings: {
      title: 'การแจ้งเตือนแบบ Push',
      enabled: 'เปิดใช้งาน',
      sound: 'เสียง',
      vibration: 'การสั่น',
      quiet: 'โหมดเงียบ'
    },
    // M2 Fix: notification status subtitle texts
    notifStatus: {
      unsupported: 'เบราว์เซอร์ไม่รองรับ',
      enabled: 'เปิดอยู่ — รับการแจ้งเตือนผ่าน browser',
      blocked: 'ถูกบล็อก — เปิดได้ในตั้งค่าเบราว์เซอร์',
      disabled: 'ปิดอยู่ — ไม่รับการแจ้งเตือน',
      enabling: 'กำลังเปิด...',
      disabling: 'กำลังปิด...',
      denied: 'ไม่ได้รับอนุญาต',
      tokenFailed: 'ขอ token ไม่สำเร็จ',
      enableFailed: 'เปิดไม่สำเร็จ',
      openBrowserSettings: 'กรุณาเปิดการแจ้งเตือนในตั้งค่าเบราว์เซอร์',
      enableError: 'เปิดการแจ้งเตือนไม่สำเร็จ',
      disableError: 'ปิดการแจ้งเตือนไม่สำเร็จ'
    },
    messages: {
      updateSuccess: 'บันทึกการตั้งค่าแล้ว',
      languageChanged: 'เปลี่ยนภาษาแล้ว',
      themeChanged: 'เปลี่ยนธีมแล้ว'
    }
  },
  
  // ===== Validation =====
  validation: {
    required: 'กรุณากรอกข้อมูล',
    invalidEmail: 'รูปแบบอีเมลไม่ถูกต้อง',
    minLength: 'ต้องมีอย่างน้อย {min} ตัวอักษร',
    maxLength: 'ต้องไม่เกิน {max} ตัวอักษร',
    passwordMatch: 'รหัสผ่านไม่ตรงกัน',
    passwordMismatch: 'รหัสผ่านไม่ตรงกัน',
    invalidUsername: 'ชื่อผู้ใช้ใช้ได้เฉพาะ a-z, A-Z, 0-9 และ _',
    invalidPassword: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวอักษรและตัวเลข',
    usernameTaken: 'ชื่อผู้ใช้นี้ถูกใช้แล้ว',
    passwordWeak: 'รหัสผ่านอ่อนแอ',
    passwordMedium: 'รหัสผ่านปานกลาง',
    passwordStrong: 'รหัสผ่านแข็งแกร่ง'
  },
  
  // ===== Errors =====
  errors: {
    generic: 'เกิดข้อผิดพลาด กรุณาลองใหม่',
    network: 'ไม่สามารถเชื่อมต่อได้ กรุณาตรวจสอบอินเทอร์เน็ต',
    timeout: 'การเชื่อมต่อหมดเวลา',
    unauthorized: 'กรุณาเข้าสู่ระบบใหม่',
    forbidden: 'คุณไม่มีสิทธิ์เข้าถึง',
    notFound: 'ไม่พบข้อมูลที่ต้องการ',
    serverError: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์',
    offline: 'ไม่มีการเชื่อมต่ออินเทอร์เน็ต'
  },
  
  // ===== Time =====
  time: {
    justNow: 'เมื่อสักครู่',
    minutesAgo: '{n} นาทีที่แล้ว',
    hoursAgo: '{n} ชั่วโมงที่แล้ว',
    daysAgo: '{n} วันที่แล้ว',
    today: 'วันนี้',
    yesterday: 'เมื่อวาน',
    tomorrow: 'พรุ่งนี้'
  }
};

// Export
window.i18n_th = th;
