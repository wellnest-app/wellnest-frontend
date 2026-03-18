// Firebase Cloud Messaging Service Worker
// This file must be in the root of your web server

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
// หมายเหตุ: เมื่อ FCM message มี "notification" payload, browser จะแสดง
// desktop notification อัตโนมัติ → ไม่ต้องเรียก showNotification() ซ้ำ
// (ถ้าเรียกซ้ำจะได้ notification 2 อันบน desktop)
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);
    
    // ไม่ต้อง showNotification() — browser จัดการแสดงให้อัตโนมัติแล้ว
    // เก็บ log ไว้สำหรับ debug เท่านั้น
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification clicked:', event);
    
    event.notification.close();
    
    // Open app
    // Phase 4.5: Open WellNest app on notification click
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
