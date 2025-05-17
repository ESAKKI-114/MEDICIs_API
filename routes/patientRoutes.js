const express = require('express');
const router = express.Router();
const verifyRole = require('../verifyRole');
const controller = require('../controllers/patientController');
const verifyToken = require('../controllers/verifyToken');


router.get('/exist',verifyToken, controller.checkTokenExistenceByDate);

// Route to check token availability
router.get('/max-token',verifyToken, controller.getMaxTokenIdForToday);

// 🟢 Public or unrestricted access (read-only)
router.get('/',verifyToken, verifyRole(['ADMIN', 'HOSPITAL','CLINIC']),controller.getAllPatients);
router.get('/:id',verifyToken,verifyRole(['ADMIN', 'HOSPITAL','CLINIC']), controller.getPatientById);

// 🟡 Restricted: ADMIN and INTERNAL can create and update
router.post('/', verifyToken,verifyRole(['ADMIN', 'HOSPITAL','CLINIC']), controller.createPatient);
router.put('/:id', verifyToken,verifyRole(['ADMIN', 'HOSPITAL','CLINIC']), controller.updatePatient);   

// 🔴 Strict: Only ADMIN can delete
router.delete('/:id',verifyToken, verifyRole(['ADMIN']), controller.deletePatient);

  

module.exports = router;
