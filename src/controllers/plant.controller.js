'use strict'

const asyncHandler = require('../utils/asyncHandler')
const {sendSuccess, sendCreated, sendNoContent} = require('../utils/apiresponse')
const Plant = require('../models/plant.model.js')
const ApiError = require('../utils/ApiError')
const {PLANT_STATUS} = require('../config/constants')
// Stage 2:
const {parsePagination, parseSort, buildMeta, buildPlantFilter} = require('../utils/queryFeatures.js')

/**
 * Plant HTTP handlers
 * 
 * each handler will be a method/service, this takes in req and completes the actions required
 */

// POST /api/v1/plants
// const create = asyncHandler(async (req, res) => {
//     return Plant.create(req.body)
// })
/**Stage 2: fields a client is allowed to see 
 * 
 * Everything else in the body is ignored. Without a list like we are about to make
 * Plant.create(req.body) lets anyone POST {'ownerId': "someone else's id"} and
 * creates a record under another account which would quietly undo the ownership rules that we made so far.
 * The server decides ownerId the client never gets a vote is ow it should be,
 * thus kind of bug is called a mass assignment bug/weakness
*/

const WRITABLE_FIELDS = ['nickname', 'species', 'location', 'wateringIntervalDays', 'lastWateredAt', 'status', 'notes']
// notice that ownerId was not included and should not be allow the user to change the field

function pickWritableFields(body={}){
    const payload = {}
    for (const field of WRITABLE_FIELDS){
        if(body[field] !== undefined) payload[field] = body[field]
    }
    return payload
}
// GET /api/v1/plants/stats
const plantStats = asyncHandler(async (req, res) => {
    const [total, grouped, all] = await Promise.all([
        Plant.countDocuments(),
        Plant.aggregate([{ $group: { _id:'$status', count:{ $sum: 1 } } }]),
        Plant.find({status: {$ne: PLANT_STATUS.RETIRED}})
    ])

    const byStatus = grouped.reduce((acc, row) => ({
        ...acc, [row._id]: row.count
    }), {})
    const overdue = all.filter((plant) => plant.isOverdue).length
    sendCreated(res, {total, byStatus, overdue})
})

// GET /api/v1/plants
const getAllPlants = asyncHandler(async (req, res) => {
    /** Stage 2: pagination, features; sorting, filtering
     * 
     * each helper function should throw a 400 ApiError on bad inputs and the asyncHandler wil forward ut to the errorHandler so this handles all forms of error 
     * */ 
    const filter = buildPlantFilter(req.query)
    const sort = parseSort(req.query.sort)
    const {page, limit, skip} = parsePagination(req.query)

    /**2 queries eun together rather than one after the other the page of records and the total number of matches the client needs to know how many pages will exist. countDocuments uses the same filter so the count describes the filtered set, not the whole collection */
    const [plant, total] = await Promise.all([
        Plant.find(filter).sort(sort).skip(skip).limit(limit),
        Plant.countDocuments(filter)
    ])
    /** the meta data will fo along with the sendSuccess extra argument so the response will be
     * {success, data, meta} and the single
     */
    sendSuccess(res, plant, 200, {meta: buildMeta({page, limit, total})})
})

// POST /api/v1/plants/
const createPlant = asyncHandler(async (req, res) => {
    /**this is the line that plant.model.js is waiting for
     * requireAuth guarantees req.user exists so the new record is going to be stamped with the id of whoever is logged in. ownerId is set from the token, never from the body, which is why the pickWritableFields filters the body first
     */
    const plant = await Plant.create({
        ...pickWritableFields(req.body),
        ownerId: req.user._id
        // using the mongodb is -- _id
    })
    sendCreated(res, plant)
})

// GET /api/v1/plants/:id
const getOnePlant = asyncHandler(async (req, res) => {
    const plant = await Plant.findById(req.params.id)
    if (!plant) throw new ApiError.notFound('Plant not found')
    sendSuccess(res, plant)
})

// POST /api/v1/plants/:id/water
const waterPlant = asyncHandler(async (req, res) => {
    const plant = await Plant.findById(req.params.id)
    if(!plant) throw ApiError.notFound('Plant not Found')

    if(plant.status === PLANT_STATUS.RETIRED) {
        throw ApiError.conflict("Cannot water a retired plant")
    }
    plant.markWatered()
    plant.save()
    sendSuccess(res, plant)
})

// PUT/PATCH /api/v1/plants/:id
const updatePlant = asyncHandler(async (req, res) => {
    const plant = await Plant.findByIdAndUpdate(req.params.id, req.body, {
        new:true, runValidators:true
    })
    if (!plant) throw ApiError.notFound('Plant not found')
    sendCreated(res, plant)
})

// DELETE /api/v1/plants/:id
const removePlant = asyncHandler(async (req, res) => {
    const plant = await Plant.findByIdAndDelete(req.params.id)
    if (!plant) throw ApiError.notFound('Plant not found')
    sendNoContent(res)
})


module.exports = {plantStats, getAllPlants, getOnePlant, removePlant, createPlant, waterPlant, updatePlant}