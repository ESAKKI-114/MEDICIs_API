// controllers/userController.js

const db = require('../firebase');
const collection = db.collection('Users');

// Get all users from Firestore
exports.getAllUsers = async (req, res) => {
  try {
    const snapshot = await collection.get();  // Fetch all users
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(users);  // Return users as a response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new user in Firestore
exports.createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    // Create a new document in Firestore with a new auto-generated ID
    const docRef = await collection.add({
      name,
      email,
      role,
    });

    // Send back the newly created user with its auto-generated Firestore ID
    res.status(201).json({ id: docRef.id, name, email, role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
