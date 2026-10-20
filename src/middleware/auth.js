'use strict'

const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const {verifyToken} = require('../utils/jwt')
const {AUTH} = require('../config/constants')
const User = require('../models/user.model')

/**This will require a user to already be logged in
 * 
 * This middleware will attach verification and require it for every request
 * This will run before the controller functions on the protected routes, so that by 
 * the time the handler runs the req.user it guaranteed to be a real user and controller never have to
 * worry about id checks themselves
 * 
 * The users will send a authorized Bearer token(AKA signed JWT token)
 * this is wrapped in the asyncHandler because it needs to await the database res
 * with no wrapper immediate 500 error res given
 */

const requireAuth = asyncHandler(async(req, res, next)=>{
    const header = req.get('authorization')

    if(!header.startsWith(AUTH.BEARER_PREFIX)){
        throw ApiError.unauthorized('missing or malformed Authorization header')
    }

    const token = header.slice(AUTH.BEARER_PREFIX.length).trim()

    if(!token) throw ApiError.unauthorized('Missing or malformed Authorization header')
        // Throws 401 ApiError on forged, expired, or garbage tokens
    const payload = verifyToken(token)

    const user = await User.findById(payload.sub)
    if(!user) throw ApiError.unauthorized('This account no longer exists')
    /**The reason that the user is loaded instead of trusting the payload is because a token stays valid until it expires, so the account could have been deleted, or its role changed, since the token was issued. the look */
    req.user = user
    next()
})
module.exports = {requireAuth}