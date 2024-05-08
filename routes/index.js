const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');
var express = require('express');
var router = express.Router();
const admin = require('../db');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// Endpoint untuk mendapatkan data (belombisa)
router.get('/get-data', (req, res) => {
  admin.database().ref('sensorData').once('value').then((snapshot) => {
      const data = snapshot.val();
      res.json(data);
    })
    .catch((error) => {
      console.error('The read failed:', error);
      res.status(500).json({ error: 'Something went wrong' });
    });
});

router.post('/post-data', async (req, res) => {
  try {
    const { suhu, kelembaban, teganganAC } = req.body;

    // Save data to Firebase Realtime Database
    await admin.database().ref('sensorData').push({ suhu, kelembaban, teganganAC });

    res.status(200).json({ message: 'Data saved to Firebase Realtime Database' });
  } catch (error) {
    console.error("Error saving data to Firebase Realtime Database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  // const data = req.body
  // console.log('received sensor data', data)
  // res.send({ "status": "success" })

  // const dataRef = db.ref('sensorData')
  // dataRef.push(data).then(() => {
  //   console.log('data saved successfully')
  //   res.send({ "status": "success" })
  // })
  //   .catch((error) => {
  //     console.error('Error saving data:', error);
  //     res.status(500).send('Error saving data');
  //   })
});

//REGISTER USER

module.exports = router;
