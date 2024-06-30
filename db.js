const admin = require('firebase-admin')

//var serviceAccount = require("./server-monitoring-19773-firebase-adminsdk-9xsse-71a0194911.json");
// Load environment variables
require('dotenv').config();

// Load the service account key from an environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://server-monitoring-19773-default-rtdb.asia-southeast1.firebasedatabase.app"
});



module.exports = admin