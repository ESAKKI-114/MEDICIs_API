const db = require('../firebase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt for:', username);
  
    try {
      const userSnapshot = await db.collection('Users')
        .where('username', '==', username)
        .get();
  
      if (userSnapshot.empty) {
        console.log('User not found');
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      let userData;
      userSnapshot.forEach(doc => {
        userData = { id: doc.id, ...doc.data() };
      });
  
      console.log('User data:', userData);
  
      const isMatch = await bcrypt.compare(password, userData.password);
      console.log('Password match:', password );
      console.log('Password match1:', userData.password );
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined!');
        return res.status(500).json({ message: 'Server error' });
      }
  
      const token = jwt.sign(
        { id: userData.id, username: userData.username, role: userData.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.json({ token, user: { username: userData.username, role: userData.role } });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  