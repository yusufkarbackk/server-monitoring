const admin = require('firebase-admin')
const functions = require('firebase-functions');
const path = require('path');
const fs = require('fs');
var serviceAccount = require("./service-account.json");

const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');
const { Storage } = require('@google-cloud/storage');
const { json } = require('express');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://server-monitoring-19773-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const storage = new Storage()
const bucketName = "server-monitoring-bucket"
const dbRef = admin.database().ref("sensorData")

exports.exportData = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
    const fileName = `backup-${new Date().toISOString()}.json`
    const tempFilePath = path.join('/tmp', fileName)

    const data = await dbRef.once('value').then(snapshot => snapshot.val())
    fs.writeFileSync(tempFilePath, JSON.stringify(data, null, 2))

    await storage.bucket(bucketName).upload(tempFilePath, {
        destination: fileName,
        metadata: {
            contentType: "application/json"
        }
    })

    fs.unlinkSync(tempFilePath)

    await dbRef.remove()
    console.log('Database export completed and data deleted')

})