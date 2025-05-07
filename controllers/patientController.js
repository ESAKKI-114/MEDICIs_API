const db = require('../firebase');
const collection = db.collection('MedPatients');

exports.getAllPatients = async (req, res) => {
  try {
    const { date } = req.query;

    let queryRef = collection;

    // ✅ If a date is provided in query, filter by dateString
if (date) {
  queryRef = queryRef.where('date.dateString', '==', date); // Filter by dateString field within the 'date' object
}


    const snapshot = await queryRef.get();
    const patients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getPatientById = async (req, res) => {
  try {
    const doc = await collection.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Patient not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPatient = async (req, res) => {
  try {
    const docRef = await collection.add(req.body);
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    await collection.doc(req.params.id).update(req.body);
    res.json({ message: 'Patient updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    await collection.doc(req.params.id).delete();
    res.json({ message: 'Patient deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// API to check if token exists
exports.isTokenAvailable = async (tokenId, res) => {
  try {
    // Check if a patient with the given tokenId already exists
    const snapshot = await collection.where("tokenId", "==", tokenId).get();

    // If the snapshot exists, it means the tokenId is taken
    if (!snapshot.empty) {
      res.json({ available: false }); // Token is already in use
    } else {
      res.json({ available: true }); // Token is available
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMaxTokenIdForToday = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Missing required "date" query parameter (YYYY-MM-DD)' });
    }
    const snapshot = await collection.get();

    const matchingPatients = snapshot.docs.filter((doc) => {
      const patient = doc.data();
    
      // Defensive check in case `date` or `dateString` is missing
      if (!patient?.date?.dateString) return false;
    
      return patient.date.dateString === date;
    });
    console.log(
      'Matching Patients for',
      date,
      '=>',
      matchingPatients.map(doc => {
        const data = doc.data();
        return {
          tokenId: data.tokenId,
          dateString: data?.date?.dateString,
        };
      })
    );
    
    // Safely parse tokenId to number
    const maxTokenId = matchingPatients.reduce((max, doc) => {
      const data = doc.data(); // Make sure you're using the `data()` method to get the actual fields
      const token = Number(data.tokenId); // Safely parse to number
    
      // If `tokenId` is valid (not NaN), compare
      return isNaN(token) ? max : Math.max(max, token);
    }, 0);    
    
    res.json({ maxTokenId });    
  } catch (error) {
    console.error('Error fetching max token ID:', error.message);
    res.status(500).json({ error: error.message });
  }
};



// API to check if tokenId exists for a specific date
exports.checkTokenExistenceByDate = async (req, res) => {
  try {
    const { tokenId, date } = req.query;

    if (!tokenId || !date) {
      return res.status(400).json({ error: 'Missing tokenId or date in query parameters' });
    }

    const snapshot = await collection
      .where('tokenId', '==', parseInt(tokenId))
      .where('date.dateString', '==', date)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return res.json({ exists: true, id: doc.id });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking token existence:', error.message);
    res.status(500).json({ error: error.message });
  }
};
