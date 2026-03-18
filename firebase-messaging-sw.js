// Firebase Cloud Messaging Service Worker
// This file must be in the root of your web server
// Bug #2 Fix: ใส่ showNotification() กลับ + ใช้ tag ป้องกัน duplicate notification

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

// Handle background messages
// Bug #2 Fix: ใส่ showNotification() กลับเพื่อแก้ปัญหา mojibake ภาษาไทย
// เมื่อปล่อยให้ browser แสดง notification อัตโนมัติจาก FCM notification payload
// → encoding ภาษาไทยเพี้ยน (เ°Cà.§à.³...)
// ใช้ tag เดียวกันเพื่อป้องกัน duplicate — browser จะ replace ไม่ใช่เพิ่ม
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);
    
    const title = payload.notification?.title || 'WellNest';
    const options = {
        body: payload.notification?.body || '',
        icon: '/wellnest-frontend/assets/icons/icon-192x192.png',
        tag: 'wellnest-' + (payload.data?.reminder_id || Date.now()),
        renotify: true,
        requireInteraction: true,
        data: payload.data
    };
    
    // ใช้ tag เดียวกันกับที่ browser auto-display → จะ replace แทนที่จะเพิ่มซ้ำ
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
