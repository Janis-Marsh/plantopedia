'use strict'

const {isTest} = require('../config/env.js')

/**
 * Logs one line per completed request method path status and dur
 */

module.exports = function requestLogger(req, res, next) {
    if(isTest) return next()
    const start = process.hrtime.bigint()

    // runs on every completed res
    res.on('finish', () => {
        const ms = Number(process.hrtime.bigint() - start) / 1e6
        console.log(`${req.method} ${req.originalUrl} ${req.statusCode}  ${ms.toFixed(1)} ms`)
    })

    next()
}