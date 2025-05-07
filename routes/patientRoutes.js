const express = require('express');
const router = express.Router();
const verifyRole = require('../verifyRole');
const controller = require('../controllers/patientController');


router.get('/exist', controller.checkTokenExistenceByDate);

// Route to check token availability
router.get('/max-token', controller.getMaxTokenIdForToday);

// 🟢 Public or unrestricted access (read-only)
router.get('/', verifyRole(['ADMIN', 'HOSPITAL','CLINIC']),controller.getAllPatients);
router.get('/:id',verifyRole(['ADMIN', 'HOSPITAL','CLINIC']), controller.getPatientById);

// 🟡 Restricted: ADMIN and INTERNAL can create and update
router.post('/', verifyRole(['ADMIN', 'HOSPITAL','CLINIC']), controller.createPatient);
router.put('/:id', verifyRole(['ADMIN', 'HOSPITAL','CLINIC']), controller.updatePatient);   

// 🔴 Strict: Only ADMIN can delete
router.delete('/:id', verifyRole(['ADMIN']), controller.deletePatient);

  

module.exports = router;
