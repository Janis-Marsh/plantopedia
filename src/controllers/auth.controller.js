'use strict'
/**Stage 2: Register Logins and report who you are in requests */

const asyncHandler = require('../utils/asyncHandler')
const {sendSuccess, sendCreated} = require('../utils/apiresponse')
const ApiError = require('../utils/ApiError')
const {signToken} = require('../utils/jwt')
const user = require('../models/user.model')

/** Pick up here monday */