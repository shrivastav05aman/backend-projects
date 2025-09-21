const Doctors = require('../models/Doctors')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, NotFoundError, UnauthorisedError } = require('../errors')

const signup = async(req, res)=>{    
    const doctor = await Doctors.create(req.body)
    const token = doctor.createJwt()
    
    res.status(StatusCodes.CREATED).json({msg : doctor, token: token})
}

const login = async(req, res)=>{
    const {email, password} = req.body
    const doctor = await Doctors.findOne({email: email})

    if(!doctor)
        throw new NotFoundError(`Not any doctor found with email ${email}`)
    const newPassword = doctor.password

    const comparePassword = await doctor.comparePassword(password, newPassword)
    if(!comparePassword)
        throw new BadRequestError('Password does not match')
    
    const token = doctor.createJwt()
    res.status(StatusCodes.OK).json({msg: doctor, token: token})

}

const logout = async(req, res)=>{    
    const authorization = req.headers.authorization
    if(authorization.split(" ")[1] === "null")
        throw new UnauthorisedError("Unauthorised User")
    
    res.status(StatusCodes.OK).json({msg : "User successfully logged out"})
}

module.exports = {
    signup,
    login,
    logout
}