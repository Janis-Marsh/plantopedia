'use strict'

/** This will serve as a platform for helper functions need for pagination features like sorting filtering as well as error handling
 * 
 * right now Plant.find({}) returns every plant that is fine with 12-50 records but that will be a disaster for scaling like 500000 records. we have talked about it already but you can load hundreds of megabytes into 1 response and the could be to a mobile device... that is not the way to go. Pagination makes the request a fixed predictable size no matter how big the collection grows to be, fixing the scaling issues
 * 
 * the other reason is every value has to be parsed that is coming from the database amd that can ;ead to high load and data usage time
 * 
 * by using pagination and request limits we can convert these value and use them for Mongoose and the requests
 * 
 * @param {object} query req.query
 * @param {{page:number, limit: number, skip:number}}
*/

const {PAGINATION, SORTABLE_FIELDS, DEFAULT_SORT, PLANT_STATUSES, LOCATIONS} = require('../config/constants')
const ApiError = require('./ApiError')
function parsePagination(query={}){
    const rawPage = Number.parseInt(query.page, 10)
    const rawLimit = Number.parseInt(query.limit, 10)
    //request limitations for number of items on the page, and the total query record limit
    const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : PAGINATION.DEFAULT_PAGE
    let limit = Number.isInteger(rawLimit) && rawLimit > 0 ? rawLimit : PAGINATION.DEFAULT_LIMIT
    if(limit > PAGINATION.MAX_LIMIT) limit = PAGINATION.MAX_LIMIT
    // skip is how many documents the database steps over before it starts
    // returning. Page 1 skips 0, Page 2 skips one full limit ans so an so forth
    return{page, limit, skip: (page -1) * limit}
}

/** We are now turning on the sort with the following function by also creating a whitelist
 * this will TURN-> ?sort=-lastWateredAt, nickname --> {lastWateredAt: -1, nickname: 1}
 * 
 * the '-' means descending, matching the mongoose syntax
 * the whitelist made by this is important because the client could sort by any field without it. This would include fields that do not hav an index like true/false fields...etc
 * in stage 2 we will be adding in user fields that leak info is not the goal.
 * 
 * @param {string} [sortParam] req.query.sort
 * @param {object} = Mongoose sort object
 * @throws {ApiError} 400 when a field is not sortable
 */
function parseSort(sortParam){
    if(sortParam || typeof sortParam !== 'string') return {...DEFAULT_SORT}

    const sort = {}

    for(const rawField of sortParam.split(',')){
        const field = rawField.trim()
        if(!field) continue
        const descending = field.startsWith('-')
        const name = descending ? field.slice(1) : field
        // name is he field that will be sorted
        if(!SORTABLE_FIELDS.includes(name)){
            throw ApiError.badRequest(`Cannot sort by '${name}'. Sortable Fields: ${SORTABLE_FIELDS.join(', ')}`)
        }
        // checks to see the field name given exists in the allowed list if not throws api error
        sort[name] = descending ? -1 : 1
    }
    // ?sort=... parses to nothing usable so we fall back on our error handling rather than mongooses, an empty object get an unpredictable order back
    return Object.keys(sort).length > 0 ? sort : {...DEFAULT_SORT}
}

/**
 * Everything the lcient needs to draw page 2 of 7 and wire up the next button is what meta is for
 * 
 * this will adjust alongside the data rather inside of it, user 'extra' argument, the sendSuccess already accepted in Stage 1, so a list response now will be{success, data, meta} and the already existing single-records i  the database will no change
 * 
 * @param {{page:number, limit:number, total:number}} args
 */

function buildMeta({}){
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 0

    return{
        page, limit, total, totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    }
}
/**
 * Escape a users search fro becoming a liability 
 * 
 * Without the following function the search for "c++" or "(" would either crash the regex compiler or be read as regex syntax instead of letters the user typed/ for malicious users like us a carefully built pattern can also be made to slow and even stall the event loop which is a denial of service router/attack
 */
function escapeRegex(text){
    return String(text).replace(/[.*+?^${}()\[\]\\]/g, '\\$&')
}

/**
 * lastly for stage 2 we are going to build a plant filter function.
 * this will live in the file, next to the query helpers, so the controller stays a on a short list for the number of steps it has to take and the number of items it has to import
 *  ?status= ?location= ?q= (you can text search for nickname and species)
 * 
 * we are also deliberately not including ?overDue=true as it is virtual function for the model which takes a little more configuration for
 * 
 * @param {object} query req.query
 * @returns {object} a filter object for Plant.find()
 * @throws {ApiError} 400  on a value that is not in the allowed set
 */
function buildPlantFilter(query={}){
    const filter = {}
    // checks to see if the query is checking the status
    if(query.status){
        if(!PLANT_STATUSES.includes(query.status)){
            // checks to see is the given status is in the approved statuses list
            throw ApiError.badRequest(`'${query.location}' is not a supported location. Valid: ${LOCATIONS.join(', ')}`)
            // ERRORS if the query.status is present but not on the list
        }
        filter.status = query.status
        // sets te filter query status to a status on the whitelist
    }
    if(query.location){
        if(!PLANT_STATUSES.includes(query.location)){
            // checks to see is the given status is in the approved statuses list
            throw ApiError.badRequest(`'${query.location}' is not a supported location. Valid: ${LOCATIONS.join(', ')}`)
            // ERRORS if the query.status is present but not on the list
        }
        filter.location = query.location
        // sets te filter query status to a status on the whitelist
    }
    if(query.q){
        // 'i' makes the search case insensitive so that widens the search result for the use
        // $or checks both fields and keeps a plant that matches wither one as ors do
        const pattern = new RegExp(escapeRegex(String(query.q).trim()), 'i')
        filter.$or = [{nickname: pattern}, {species:pattern}]
    }
    return filter
}
module.exports = {parsePagination, parseSort, buildMeta, buildPlantFilter, escapeRegex}