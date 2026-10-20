'use strict'
/**Stage 2: Register Logins and report who you are in requests */

const asyncHandler = require('../utils/asyncHandler')
const {sendSuccess, sendCreate} = require('../utils/apiResponse')
const ApiError = require('../utils/ApiError')
const {signToken} = require('../utils/jwt')
const User = require('../models/user.model')

/** Auth HTTP handlers:
 * This is will be the same shape as plant.controller.js, it will read
 * the request, and lean on the model for rules and then answer through the shared response objects/envelope(basically not in the body of the response)
 */

// POST /api/vv1/auth/register
const register = asyncHandler(async(req,res)=>{
    /** req.body leaves the undefined when there is no readable body that arrives with the req, we are destructuring the values that should be in the req and in case that is not there we used the '??' {} turns what would be an error into a 400 error the client gets back */
    const {name, email, password} = req.body ?? {}
    /**the reason we have destructure instead of just using the req.body to create the user is that be doing so the user could also add other fields like {"role": "admin"} WHICH WE DO NOT WANT
     * It also guards the ownerId once again.
     */
    const user = await User.create({name, email, password})
    /**Skipping stupid steps: we will be logging in the newly created user, some platforms force the user to login separately but that is dumb, who makes a new account not to use it immediately */
    sendCreate(res, {user, token: signToken(user)})
    /** after this the new users data goes through the schema its validation and uses the toJSON function on the way to the database, which then deletes the hash from the backend server also not as THIS THING */
})

// POST /api/v1/auth/login
const login = asyncHandler(async(req,res)=>{
    const {name, email, password} = req.body ?? {}

    if(!email || !password)
        throw ApiError.badRequest('email and password are required')
    //** checks to make sure the user filled both fields before submitting the form */
    const user = await User.findOne({email: String(email).toLowerCase().trim()}).select('+password')
    /** .select('+password') overrides the schema that select:false for this one query, because comparing the hash is the goal here */
    
    if(!user || !(await user.comparePassword(password))){
        throw ApiError.unauthorized('Invalid email or password')
    }
    /** making user exists and the passwords match */

    sendSuccess(res, {user, token: signToken(user)})
})

//GET /api/v1/auth/me
const me = asyncHandler(async(res,req)=>{
    /**requireAuth will have already verified the token and loaded whatever user settings/info... so this nothing left to do but use this endpoint so the a client can confirm a saved token is still good. and refresh the profile it is showing. this will also the user to refresh his token as well */
    sendSuccess(res, req.user)
})

module.exports = {register, login, me}