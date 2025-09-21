const express = require('express')
const router = express.Router()

const { signup, login } = require('../controllers/Users')
const authMiddleware = require('../middleware/auth')

router.route('/signup').post(signup)
router.route('/login').post(authMiddleware,login)

module.exports = router