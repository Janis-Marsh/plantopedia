'use Strict'

const ApiError = require('../utils/ApiError')

/** 404 Handler for unmatched routes
 * 
 * this will forward to the error handler we built rather than responding directly so unknown routes
 * return the same packet response as every other failure as if the record existed but no 
 * access...ect
 */
module.exports = function notFound(req, res, next) {
    next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}
/** next function: remember that the next function is used in the middleware as a callback
 * allowing the request-response cycle to continue. In middleware if you do not have the next and
 * use it ast the end of the middleware function the entire project will stall after a request
 * because of this. BE SURE TO REMEMBER THIS
 * 
 * next also allows use to chain the execution of functions, prevent hangups like the one we
 * prevented above through error handling.
 */