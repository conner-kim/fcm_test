var isServiceWorkerSupported = 'serviceWorker' in navigator;
if (isServiceWorkerSupported) {
    navigator.serviceWorker
        .register('main.js', {scope: '/fcm_test/'})
        .then(function (registration) {
            console.log('serviceWorker 등록 성공: ', registration)
        })
        .catch((error) => {
            console.log('serviceWorker 등록 실패: ', error)
        })
}