const express = require('express');
const app = express();
const cors = require('cors');  // Import cors
require('dotenv').config();

const patientRoutes = require('./routes/patientRoutes');
const userRoutes = require('./routes/userRoutes');


app.use(express.json());
// Enable CORS for all origins
app.use(cors());
app.use('/api/patients', patientRoutes);
app.use('/api/users', userRoutes); // Make sure the /api/users is correctly mapped
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
