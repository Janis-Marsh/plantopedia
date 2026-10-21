'use strict'

const {isConnected} = require('../config/database.js')
const {sendSuccess} = require('../utils/apiResponse.js')

function health(req,res){
    sendSuccess(res, {
        status: 'ok',
        database: isConnected() ? 'connected' : 'disconnected',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    })
}
/** No async wrapper needed as nothing here awaits and thee are no promises
 * Does not live inside of the /api/v1 because it is not part of the api itself 
 * this data an info can be used to create and maintain admin dashboard tools, or a public API health page(Aka down detector)
 * This is also the same technique and function needed to create an internet deadman switch
 */

module.exports = {health}