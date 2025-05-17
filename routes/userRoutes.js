const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { loginUser } = require('../controllers/auth'); // Login controller
const verifyToken = require('../controllers/verifyToken'); // JWT middleware

// ✅ Login route
router.post('/login', loginUser);

// ✅ Example protected route
router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: 'Protected route accessed', user: req.user });
});

// ✅ Get all users
router.get('/', verifyToken, userController.getAllUsers);

// ✅ Create new user
router.post('/',verifyToken,userController.createUser);

// Update user by ID route (PUT)
router.put('/:id',verifyToken, userController.updateUserById);

// ✅ Get user by ID (must come last)
router.get('/:id',verifyToken, userController.getUserById);

module.exports = router;
