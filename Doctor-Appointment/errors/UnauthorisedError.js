const CustomApiError = require('./CustomApiError')
const {StatusCodes} = require('http-status-codes')

class UnauthorisedError extends CustomApiError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

module.exports = UnauthorisedError