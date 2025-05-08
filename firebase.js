// firebase.js
const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_KEY); // Read from environment variable

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;
