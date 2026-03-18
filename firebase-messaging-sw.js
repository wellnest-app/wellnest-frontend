// Firebase Cloud Messaging Service Worker
// This file must be in the root of your web server
// Bug #2 Fix v2: ใช้ data-only FCM message
//   - Backend ส่งเฉพาะ data payload (ไม่มี notification payload)
//   - SW จัดการแสดง notification เองทั้งหมด
//   - ป้องกัน duplicate + แก้ mojibake ภาษาไทย

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration
firebase.initializeApp({
    apiKey: "AIzaSyCV4iN3x6h9tJMJPex9WXDU9gL-AF61ES0",
    authDomain: "wellnest-push-notification.firebaseapp.com",
    projectId: "wellnest-push-notification",
    storageBucket: "wellnest-push-notification.firebasestorage.app",
    messagingSenderId: "286182410972",
    appId: "1:286182410972:web:9c2820d5deeb8d58e90219"
});

const messaging = firebase.messaging();

// Handle background messages (data-only)
// Backend ส่ง title/body ใน data field → SW อ่านจาก payload.data
// ไม่มี notification payload → browser ไม่ auto-display → ไม่มี duplicate
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);
    
    // อ่านจาก data (data-only message) หรือ notification (fallback กรณีเก่า)
    const title = payload.data?.title || payload.notification?.title || 'WellNest';
    const body = payload.data?.body || payload.notification?.body || '';
    
    const options = {
        body: body,
        icon: '/wellnest-frontend/assets/icons/icon-192x192.png',
        tag: 'wellnest-' + (payload.data?.reminder_id || Date.now()),
        renotify: true,
        requireInteraction: true,
        data: payload.data
    };
    
    return self.registration.showNotification(title, options);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification clicked:', event);
    
    event.notification.close();
    
    // Open app — Phase 4.5: Open WellNest app on notification click
    const appUrl = '/wellnest-frontend/pages/dashboard.html';
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Try to focus existing WellNest window
                for (const client of clientList) {
                    if (client.url.includes('wellnest-frontend') && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Open new window if none found
                if (clients.openWindow) {
                    return clients.openWindow(appUrl);
                }
            })
    );
});
