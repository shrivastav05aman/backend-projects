const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const authMiddleware = async(req,res,next)=>{
    const authorization = req.headers.authorization
    if(!authorization || !authorization.startsWith('Bearer '))
        throw new UnauthenticatedError('Invalid Token')
    const token = authorization.split(' ')[1]

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET)
        req.user = data
    } catch (error) {
        throw new UnauthenticatedError('Invalid Token')
    }
    
    next()
}

module.exports = authMiddleware