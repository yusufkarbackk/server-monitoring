const admin = require('firebase-admin')

var serviceAccount = require("./service-account.json");



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://server-monitoring-19773-default-rtdb.asia-southeast1.firebasedatabase.app"
});



module.exports = admin