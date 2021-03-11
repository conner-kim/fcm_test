import firebase from "firebase/app";
import "firebase/messaging";

let self;

function initInSw() {
    importScripts('https://www.gstatic.com/firebasejs/8.2.5/firebase-app.js');
    importScripts('https://www.gstatic.com/firebasejs/8.2.5/firebase-messaging.js');

    firebase.initializeApp({
        apiKey: "AIzaSyCMqYCykd6Plc-DfKgOPvQ3sQ8jNmgOLxQ",
        authDomain: "news-crawler-f3e51.firebaseapp.com",
        projectId: "news-crawler-f3e51",
        storageBucket: "news-crawler-f3e51.appspot.com",
        messagingSenderId: "36550956009",
        appId: "1:36550956009:web:05e667202df4a309fe3178",
        measurementId: "G-T99VDX84B1"
    });

    const messaging = firebase.messaging();
}

function onBackgroundMessage() {
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
        console.log('Received background message', payload);

        const notificationTitle = 'Background Message Title';
        const notificationOptions = {
            body: 'Background Message body',
        }
        self.registration.showNotification(notificationTitle, notificationOptions)
    });


}