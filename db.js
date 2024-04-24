const admin = require('firebase-admin')
const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');
var serviceAccount = require("./service-account.json");

// const firebaseConfig = {
//     apiKey: "AIzaSyBHkiTFvQP9TazrQh2dyMiZ8eCXkDQmus4",
//     authDomain: "server-monitoring-19773.firebaseapp.com",
//     databaseURL: "https://server-monitoring-19773-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "server-monitoring-19773",
//     storageBucket: "server-monitoring-19773.appspot.com",
//     messagingSenderId: "623461435158",
//     appId: "1:623461435158:web:365ad1fa2fbfd497fef237"
// };


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://server-monitoring-19773-default-rtdb.asia-southeast1.firebasedatabase.app"
});


// const app = initializeApp(firebaseConfig)
// const db = getDatabase(app)
module.exports = admin