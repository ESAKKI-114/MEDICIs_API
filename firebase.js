// firebase.js (or db.js)
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Path to your Firebase service account key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore(); // Initialize Firestore instance
module.exports = db;
