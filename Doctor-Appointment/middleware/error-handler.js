const { CustomApiError } = require('../errors')
const {StatusCodes} = require('http-status-codes')

const errorHandlerMiddleware = async(err,req,res,next)=>{
    
    if(err.name === "ValidationError"){
        return res.status(StatusCodes.NOT_FOUND).json({msg : Object.values(err.errors).map((item)=>item.message)})
    }

    if(err.code === 11000){
        return res.status(StatusCodes.BAD_REQUEST).json({msg : "Duplicate email error"})
    }

    return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({msg : err.message})
}

module.exports = errorHandlerMiddleware