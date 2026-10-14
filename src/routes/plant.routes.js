'use strict'

const express = require('express')
const plantController = require('../controllers/plant.controller')


const router = express.Router()


router.get('/stats', plantController.plantStats)

router
    .route('/')
        // any get on this route will execute the controller func
        .get(plantController.getAllPlants)
        .post(plantController.createPlant)
router
    .route('/:id')
        .get(plantController.getOnePlant)
        .put(plantController.updatePlant)
        .patch(plantController.updatePlant)
        // TODO: authorized delete
        .delete(plantController.removePlant)

router.post('/:id/water', plantController.waterPlant)


// here there will be more routes each with their own combo of methods

module.exports = router