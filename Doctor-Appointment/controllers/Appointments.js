const { BadRequestError, NotFoundError } = require('../errors')
const Appointments = require('../models/Appointments')
const Doctors = require('../models/Doctors')
const {StatusCodes} = require('http-status-codes')

const bookAppointment = async(req, res)=>{
    const {patientName, appointmentDate, appointmentTime, serviceType, doctor} = req.body
    const doc = await Doctors.findOne({name : doctor}).select("-password")
    if(!doc)
        throw new NotFoundError(`Doctor not found with name ${doctor}`)

    const bookedAppointment = await Appointments.findOne({
        appointmentDate : appointmentDate, 
        appointmentTime: appointmentTime, 
        doctor : doc
    })

    const day = new Date(appointmentDate).getDay()
    if(day === 0)
        throw new BadRequestError("Sunday is Holiday!!")

    if(bookedAppointment)
        throw new BadRequestError("Appointment is already done")

    const patientDetails = {
        patientName: patientName,
        appointmentDate : appointmentDate,
        appointmentTime : appointmentTime,
        serviceType : serviceType,
        doctor : doc
    }
    
    const appointment = await Appointments.create(patientDetails)

    res.status(StatusCodes.CREATED).json({
        msg : appointment, 
        success: "Congratulations! Your appointment is booked"
    })
}

const getAllDoctors = async(req,res)=>{
    let doctors = await Doctors.find({})

    const {department} = req.query
    if(department)
        doctors = await Doctors.find({department : department})

    res.status(StatusCodes.OK).json({msg : doctors})
}

const getAllAppointments = async(req,res)=>{
    const id = req.user.id
    const appointments = await Appointments.find({doctor : id}).populate("doctor")
    if(!appointments)
        throw new NotFoundError("Not found any appointment")

    res.status(StatusCodes.OK).json({msg : appointments})
}

const getAppointment = async(req,res)=>{
    const {id} = req.params
    const doctorId = req.user.id
    
    const appointment = await Appointments.findOne({doctor: doctorId, _id : id}).populate("doctor")
    if(!appointment)
        throw new NotFoundError("Not found any appointment")

    res.status(StatusCodes.OK).json({msg : appointment})
}

const updateAppointment = async(req,res)=>{
    const {id} = req.params
    const doctorId = req.user.id
    
    let appointment = await Appointments.findOne({doctor: doctorId, _id : id})
    if(!appointment)
        throw new NotFoundError("Not found any appointment")

    appointment = await Appointments.findOneAndUpdate({doctor: doctorId, _id : id}, {status: "completed"}, {
        new: true,
        runValidators: true
    })
    .populate("doctor")

    res.status(StatusCodes.OK).json({msg : appointment})
}

const cancelAppointment = async(req,res)=>{
    const token = req.headers.authorization.split(" ")[1]
    if(token != "null")
        throw new BadRequestError("Doctor can't cancel appointment")
    const {id} = req.params
    let appointment = await Appointments.findOne({_id: id})
    if(!appointment)
        throw new NotFoundError('Appointment not found')

    appointment = await Appointments.findOneAndUpdate({_id : id}, {status: "cancelled"}, {
        new: true,
        runValidators: true
    })
    .populate("doctor")

    res.status(StatusCodes.OK).json({msg : appointment})
}

const deleteAppointment = async(req,res)=>{
    const id = req.user.id
    const appointments = await Appointments.find({doctor: id, status : ["completed", "cancelled"]}).select("_id")

    if(!appointments)
        throw new NotFoundError('Appointments not found')

    await Appointments.deleteMany({_id : {$in : appointments}})

    res.status(StatusCodes.OK).json({msg : "Appointments deleted successfully"})
}

module.exports = {
    bookAppointment,
    getAllAppointments,
    getAppointment,
    updateAppointment,
    cancelAppointment,
    getAllDoctors,
    deleteAppointment
}