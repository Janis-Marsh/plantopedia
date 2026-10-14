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
     * We will pick up here tomorrow
     */
}

module.exports = ApiError