const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const DoctorSchema = new mongoose.Schema({
    name: { 
        type: String,
        required : [true, 'Please provide name']
    },
    email: { 
        type: String,
        required : [true, 'Please provide email'],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Enter a valid email"]
    },
    password: { 
        type: String,
        required : [true, 'Please provide password'],
        minlength: 6
    },
    department: {
        type: String,
        enum: {
            values: ["cardiology", "haematology", "nephrology", "physiology", "orthopaedics"],
            message: '{VALUE} is not supported'
        },
        required : [true, 'Please provide department']
    }
},{
    timestamps: true
})

DoctorSchema.pre("save", async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

DoctorSchema.methods.createJwt = function(){
    const token = jwt.sign({
        id: this._id,
        name: this.name,
        email: this.email
    }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    })
    return token
}

DoctorSchema.methods.comparePassword = function(password, newPassword){
    return bcrypt.compare(password, newPassword)
}

DoctorSchema.methods.deleteToken = function(token){
    console.log("delete")
}

module.exports = mongoose.model("Doctors", DoctorSchema)