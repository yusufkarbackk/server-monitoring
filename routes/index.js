var express = require('express');
var router = express.Router();
const admin = require('../db');
const CryptoJS = require('crypto-js')

const secretKey = 'server-monitoring'
// Encryption function
function encrypt(data) {
  //AES-256-CBC 
  return CryptoJS.AES.encrypt(data, secretKey).toString()
}

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
   
    const hashedSuhu = encrypt(String(suhu))
    const hashedKelembaban = encrypt(String(kelembaban))
    const hashedTeganganAC = encrypt(String(teganganAC))


    // Save data to Firebase Realtime Database
    await admin.database().ref('sensorData').push({ suhu: hashedSuhu, kelembaban: hashedKelembaban, teganganAC: hashedTeganganAC });

    res.status(200).json({ message: 'Data saved to Firebase Realtime Database' });
  } catch (error) {
    console.error("Error saving data to Firebase Realtime Database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//REGISTER USER

module.exports = router;
