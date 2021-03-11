var isServiceWorkerSupported = 'serviceWorker' in navigator;
if (isServiceWorkerSupported) {
    navigator.serviceWorker
        .register('main.js', {scope: '/fcm_test/'})
        .then(function (registration) {
            console.log('serviceWorker 등록 성공: ', registration)

            console.log('init Firebase!')
            initFirebase(registration);
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

$(document).ready(function () {

    notification_requestPermission();
})

self.addEventListener('message', e => {
    console.log(e)
    console.log(e.data)
})

// Push Message 수신 이벤트
self.addEventListener('push', (event) => {
    console.log('serviceWorker 푸시알림 수신: ', event);

    console.log(event.data)
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

// 사용자가 Notification을 클릭했을 때R
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

// Firebase SDK 초기화
function initFirebase(serviceWorkerRegistration) {

    var firebaseConfig = {
        apiKey: "AIzaSyCMqYCykd6Plc-DfKgOPvQ3sQ8jNmgOLxQ",
        authDomain: "news-crawler-f3e51.firebaseapp.com",
        projectId: "news-crawler-f3e51",
        storageBucket: "news-crawler-f3e51.appspot.com",
        messagingSenderId: "36550956009",
        appId: "1:36550956009:web:05e667202df4a309fe3178",
        measurementId: "G-T99VDX84B1"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    console.log('메세지 작업 시작!!')
    var messaging = firebase.messaging();
    messaging.useServiceWorker(serviceWorkerRegistration);
    const public_key = 'BJIUP33x5zzOvKmkkO8bZHl8mq7nfnLGhv120-MjYCq4D_esq4UgfTfa4CVYsvc33n8WI1pWn76TcqH3NPMN3G0';
    messaging.usePublicVapidKey(public_key);

    console.log('public key 입력')
    window.msg = messaging;
    // Instance ID Token 발급 요청
    messaging.getToken()
        .then((currentToken) => {
            if (currentToken) {
                console.log('Instance ID Token 발행 완료: ' + currentToken);
                sendTokenToServer(currentToken);
            } else {
                console.log('Instance ID Token 발행 실패');
                sendTokenToServer(null);
            }
        })

    messaging.onTokenRefresh(() => {
        messaging.getToken()
            .then((refreshedToken) => {
                console.log('Instance Id Token 갱신 완료: ' + refreshedToken)
                sendTokenToServer(refreshedToken);
            })
            .catch((error) => {
                console.log('Instance ID Token 갱신 실패: ' + error);
                sendTokenToServer(null);
            })
    })

    messaging.onMessage((payload) => {
        // push message 수신 시 호출되는 이벤트
        console.log('PushMessage 수신: ', payload);
    })
}

function sendTokenToServer(token) {
    return alert(token);
}