const express = require('express')
const router = express.Router()

const { bookAppointment, 
    getAppointment, 
    updateAppointment, 
    cancelAppointment, 
    getAllAppointments, 
    getAllDoctors, 
    deleteAppointment 
} = require('../controllers/Appointments')
const authMiddleware = require('../middleware/auth')

router.route('/book').post(bookAppointment)
router.route('/').get(authMiddleware, getAllAppointments).delete(authMiddleware,deleteAppointment)
router.route('/doctors').get(getAllDoctors)
router.route('/:id').get(authMiddleware,getAppointment).patch(authMiddleware,updateAppointment)
router.route('/cancel/:id').patch(cancelAppointment)

module.exports = router