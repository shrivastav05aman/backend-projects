const express = require('express')
const router = express.Router()
const { signup, login, logout } = require('../controllers/Doctors')
const authMiddleware = require('../middleware/auth')

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout').get(authMiddleware,logout)

module.exports = router