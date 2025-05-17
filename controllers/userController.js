// controllers/userController.js

const db = require('../firebase');
const collection = db.collection('Users');
const bcrypt = require('bcryptjs');

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
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const docRef = collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract user data
    const userData = doc.data();

    // Remove password field from user data
    if (userData.password) {
      delete userData.password;
    }

    res.json({
      id: doc.id,
      ...userData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.createUser = async (req, res) => {
  try {
    const { name,username, email, role, password,location,phonenumber,job } = req.body;

    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save user with hashed password
    const docRef = await collection.add({
      name,
      username,
      email,
      role,
      password: hashedPassword, // save hashed password here
      location,
      phonenumber,
      job
    });

    res.status(201).json({ id: docRef.id, name,username, email, role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateUserById = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    username,
    email,
    role,
    password,
    location,
    phonenumber,
    job
  } = req.body;

  try {
    const docRef = collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updateData = {
      name,
      username,
      email,
      role,
      location,
      phonenumber,
      job
    };

    // Remove undefined fields so we don't overwrite unintentionally
    Object.keys(updateData).forEach(
      key => updateData[key] === undefined && delete updateData[key]
    );

    // If password provided, hash it
    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateData.password = hashedPassword;
    }

    await docRef.update(updateData);

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
