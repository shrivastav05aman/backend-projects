require('dotenv').config()
const express = require('express')
const app = express()
const connectDb = require('./db/connect')
const DoctorRouter = require('./routes/Doctors')
const AppointmentRouter = require('./routes/Appointments')
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')


//middlewares
app.use(express.json())
app.use('/api/v1/doctors', DoctorRouter)
app.use('/api/v1/appointments',AppointmentRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

//port number
const port = 3000

const start = async()=>{
    await connectDb(process.env.MONGO_URL)
    app.listen(port,()=>{
        console.log(`Server is listening on port ${port}`)
    })
}

start()