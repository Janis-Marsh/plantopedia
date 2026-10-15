class ApiError extends Error {
    constructor(statusCode, message, details = null) {
        super(message)
        this.statusCode = statusCode
        this.details = details
        this.isOperational = true
        Error.captureStackTrace(this, this.constructor)
    }

    /** Stage 2: fix all the static shortcuts and create proper error functions
     * 
     * We will be making static requests that will expand the type of errors and response this middleware can be used for
     * 
     * These static routes will be set as a basis for stage 3 as well. ApiError as it is
     * with status codes already filled in, the controllers read the full sentences of the error and has no way to remember that notfound means 404
     */
    static badRequest(message = 'Bad Request', details = null){
        return new ApiError(400, message, details)
    }

    // 401: we did not know who you are -- Login and try again
    static unauthorized(message = "Unauthorized", details = null) {
        return new ApiError(401, message, details)
    }

    // 403: we did not know who you are -- and still may not do this
    // for stage 3 this will be a per record permission not just access to all
    static unauthorized(message = "Unauthorized", details = null) {
        return new ApiError(403, message, details)
    }

    // basic not found
    static notFound(message = "Not Found", details = null) {
        return new ApiError(404, message, details)
    }

    // 409: the request is a valid one, but there are conflicts with the current state of the plant i.e. something like the plant was retired since the last watering
    static conflict(message = "Conflict", details = null) {
        return new ApiError(409, message, details)
    }

}

module.exports = ApiError