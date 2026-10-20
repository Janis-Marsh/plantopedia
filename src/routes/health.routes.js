'use strict'

const express = require('express')
const healthController = require('../controllers/health.controller')

const router = express.Router()
// '/' remember that we use just the backslash where the route will mount from app.js using the /health
router.get('/', healthController.health)

module.exports = router