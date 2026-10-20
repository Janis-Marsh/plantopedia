'use strict'

const express = require('express')
const authController = require('../controllers/auth.controller')
const {requireAuth} = require('../middleware/auth')

const router = express.Router()

// Public Routes: you cannot be logged in yet when tou are asking to log in
router.post('/register', authController.register)
router.post('/login', authController.login)

/**Protected Routes: require runs first and either sets req.user or ends with a 401
 * listing middleware before the handler is how a route says this step has to apss before the handler is allowed to run
 */

router.get('/me', requireAuth, authController.me)

module.exports = router