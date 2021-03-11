var isServiceWorkerSupported = 'serviceWorker' in navigator;
if (isServiceWorkerSupported) {
    navigator.serviceWorker
        .register('main.js', {scope: '/fcm_test/'})
        .then(function (registration) {
            console.log('serviceWorker 등록 성공: ', registration)

            notification_requestPermission()
        })
        .catch((error) => {
            console.log('serviceWorker 등록 실패: ', error)
        })
}

function notification_requestPermission() {
    var isNotificationSupported = 'Notification' in window;
    if (isNotificationSupported) {
        Notification.requestPermission()
            .then((result) => {
                if (result === 'granted') {
                    console.log('Notification 허용: ', result)

                } else {
                    console.log('Notification 차단: ', result)
                }
            })
    }
}

// Push Message 수신 이벤트
self.addEventListener('push', (event) => {
    console.log('serviceWorker 푸시알림 수신: ', event);

    // Push 정보 조회
    var title = event.data.title || '알림';
    var body = event.data.body;
    var icon = event.data.icon;
    var badge = event.data.badge;
    var options = {
        body: body,
        icon: icon,
        badge: badge
    };

    //Notification 출력
    event.waitUntil(self.registration.showNotification(title, options));
})

// 사용자가 Notification을 클릭했을 때
self.addEventListener('notificationclick', (event) => {
    console.log('serviceWorker 푸시 알림 클릭: ', event);

    event.notification.close();
    event.waitUntil(
        clients.matchAll({type: "window"})
            .then(function (clientList) {
                //실행된 브라우저가 있으면 Focus
                for (var i = 0; i < clientList.length; i++) {
                    var client = clientList[i];
                    if (client.url == '/' && 'focus' in client)
                        return client.focus();
                }
                //실행된 브라우저가 없으면 Open
                if (clients.openWindow)
                    return clients.openWindow('https://localhost:44337/');
            })
    );
});

