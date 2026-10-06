'use strict'

const asyncHandler = require('../utils/asyncHandler')
const {sendSuccess, sendCreated, sendNoContent} = require('../utils/apiresponse')
const Plant = require('../models/plant.model.js')
const ApiError = require('../utils/ApiError')
const {PLANT_STATUS} = require('../config/constants')

/**
 * Plant HTTP handlers
 * 
 * each handler will be a method/service, this takes in req and completes the actions required
 */

// POST /api/v1/plants
// const create = asyncHandler(async (req, res) => {
//     return Plant.create(req.body)
// })

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
    try {
        const plants = await Plant.find({})
        res.status(200).json({success:true, data:plants})
    } catch (error) {
        res.status(500).json({success:false, error:error})
    }
})

// POST /api/v1/plants/
const createPlant = asyncHandler(async (req, res) => {
    const plant = await Plant.create(req.body)
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