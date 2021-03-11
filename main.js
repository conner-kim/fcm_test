var isServiceWorkerSupported = 'serviceWorker' in navigator;
if (isServiceWorkerSupported) {
    navigator.serviceWorker
        .register('main.js', {scope: '/fcm_test/'})
        .then(function (registration) {
            console.log('serviceWorker 등록 성공: ', registration)

            var isNotificationSupported = 'Notification' in window;
            if(isNotificationSupported) {
                Notification.requestPermission()
                    .then((result) => {
                        if(result === 'granted') {
                            console.log('Notification 허용: ', result)
                        } else {
                            console.log('Notification 차단: ', result)
                        }
                    })
            }

        })
        .catch((error) => {
            console.log('serviceWorker 등록 실패: ', error)
        })
}