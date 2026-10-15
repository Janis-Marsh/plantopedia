'use strict'

/**Everything JWT and token will touch this file aka logins, logouts, and authorizations */

/**A JWT stand for Javascript Web Token: It is an industry standard for securely sending information 
 * 
 */

/** Why we use tokens instead of sessions
 * 
 * JSON web tokens use 3 base64 chunks that with the secret, header(algorithm and type), make is a far more secure option than just sessions which can be interrupted, connections ...etc
 * Think back on how you interact with google gmail or facebook .....etc these major sites also use token this allows use the user to now have to deal with session reminders to stay active the, and increases the overall security of the interaction between the client and the server
 * 
 * @param {object} user
 * @returns {string} a signed token
 */

const jwt = require('jsonwebtoken')
const {jwtSecret, jwtExpiresIn} = require('../config/env')

