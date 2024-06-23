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


function decrypt(data) {
  const bytes = CryptoJS.AES.decrypt(data, secretKey);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return parseFloat(decryptedData); // Convert string back to double
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('server monitoring');
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
    // await admin.database().ref('sensorData').push({ suhu: suhu, kelembaban: kelembaban, teganganAC: teganganAC });


    // Save data to Firebase Realtime Database
    await admin.database().ref('sensorData').push({ suhu: hashedSuhu, kelembaban: hashedKelembaban, teganganAC: hashedTeganganAC });

    res.status(200).json({ message: 'Data saved to Firebase Realtime Database' });
  } catch (error) {
    console.error("Error saving data to Firebase Realtime Database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/decrypt-data', async (req, res) => {
  try {
    const {encryptedSuhu, encryptedKelembaban, encryptedTeganganAC} = req.body
    
    const decryptedSuhu = decrypt(encryptedSuhu)
    const decryptedKelembaban = decrypt(encryptedKelembaban)
    const decryptedTeganganAC = decrypt(encryptedTeganganAC)

    res.status(200).json({
        decryptedSuhu,
        decryptedKelembaban,
        decryptedTeganganAC
    })
  } catch (e) {
    console.error("Error decrypting data:", e);
    res.status(500).json({ error: "Internal server error" });
  }
})

//REGISTER USER

module.exports = router;
