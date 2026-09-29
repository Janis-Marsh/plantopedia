'use strict'

const {isTest} = require('../config/env')

/**
 * Logs one line per completed request: method, path, status, and duration
 */

module.exports = function requestLogger(req, res, next) {
    if(isText) return next()
    // is this is a test return nothing and move on
    const start = process.hrtime.bigint()

    res.on('finish', () => {
        const ms = Number(process.hrtime.bigint() - start / 1e6)
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(1)} ms`)
    })
    next()
    // basically every time there is a 'finished' or completed request the method type url path and code will be logged along with the time of completion
    // us can also add dates
}