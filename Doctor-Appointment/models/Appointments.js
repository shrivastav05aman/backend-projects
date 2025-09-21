const mongoose = require('mongoose')
const AppointmentSchema = new mongoose.Schema({
    patientName : {
        type: String,
        required : [true, 'Please provide your name']
    },
    appointmentDate: {
        type: Date,
        required : [true, 'Please provide appointment date']
    },
    appointmentTime: {
        type: String,
        required : [true, 'Please provide appointment time']
    },
    status: {
        type: String,
        enum: ['scheduled','completed','cancelled'],
        default: 'scheduled'
    },
    serviceType:{
        type: String,
        enum:{
            values : ['consultation','check-up','therapy'],
            message: '{VALUE} is not supported'
        }, 
        required : [true, 'Please provide service type']
    },
    doctor: {
        type: mongoose.Types.ObjectId,
        ref: 'Doctors',
        required : [true, 'Please provide doctor details']
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Appointments", AppointmentSchema)