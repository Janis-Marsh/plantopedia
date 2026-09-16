const express = require('express')
const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI

// Remember that the schema is the blue print for a record in the database and is used to validate new record data before the record is created
const plantSchema = new mongoose.Schema({
    nickname: {type: String, required: true},
    id:{type: Number, required: true},
    species: {type: String, default: "Unknown"},
    location: {type: String, required: true},
    wateringIntervalDays: {type: Number, required: true},
    lastWateredAt: {type: Date, default: null},
    status: {type: String, default: 'healthy'}
}, {timestamps:true})
// Model: for a plant
const Plant = mongoose.model("Plant", plantSchema)
// variable storing the model made from plantSchema
const app = express()
// What was missing
app.use(express.json())
const PORT = 3000
let plants = [
    {
        id: '1', 
        nickname: 'Mike', 
        location: 'living_room',
        wateringInterval: 7,
        status: 'healthy'
    }
]
let nextId = 2

app.get('/health', (req, res) => {
    res.status(200).json({status: 'ok'})
})
// CRUD Responses: crud stand for Create, Read, Update, and Delete 
app.get('/plants', async (req, res) => {
    try {
        const plants = await Plant.find({})
        // the above async request ses the mongoose find functions and returns all records that use the Plant model
        res.status(200).json(plants)
        // responds back with all pants in the "database" in the form of a json
    } catch (error) {
        res.status(500).json({error: "Plant not Found"})
    }
})

// READ --- 200 or 404
app.get('/plants/:id', async (req, res) => {
    try {
        // requires a parameter that is in the URL segment, express captures this with :id
        const plant = await Plant.find({id: Number(req.params.id)})
        // uses id parameter to search database for object with the same id
        if(!plant) return res.status(404).json({error: 'Plant not found'})
            // If the plant is not found using the plant variable this conditional with respond
        res.status(200).json(plant)
        // If it does exist then respond back with good status and specific plant data
    } catch (error) {
        res.status(500).json({error: "Plant not Found"})
    }
})

// WATERED --- 200 or 500
app.post('/plants/:id/water', async (req, res) => {
    // Run this route when the plant has been watered to update the database
    try {
        const plant = await Plant.findOne({id: Number(req.params.id)})
        if(!plant) return res.status(404).json({error: "Plant not Found"})

        if(plant.status === 'retired')
            return res.status(409).json({error: "Cannot be watered retired plant"})
        plant.lastWateredAt = new Date()
        plant.status = "healthy"
        await plant.save()
        res.status(200).json(plant)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// CREATE --- 201
app.post('/plants', async (req, res) => {
    try {
        const plant = await Plant.create({id:String(nextId++), ...req.body})
        res.status(201).json(plant)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
   /*  try {
        const plant = await Plant.findById(req.params.id).exec()
        if(!plant) return res.status(404).json({error: "Plant not Found"})
        if(plant.status === 'retired'){
            return res.status(409).json({error: "Cannot water retired plants"})
        }
        // if the plant does exist and the plant is not returned the code below executes
        plant.lastWateredAt = new Date()
        plant.status = 'healthy'
        await plant.save()
        // above is he function that uses the mongoose connection and model to save it to the database directly
    } catch (err) {
        res.status(500).json({error: err.message})
    } */
})

// UPDATE --- 200 or 404
app.patch('/plants/:id', async (req, res) => {
    try {
        const plant = await Plant.findOneAndUpdate({id: Number(req.params.id)})
        // find specific plant record
        if(!plant) return res.status(404).json({error: "Plant not Found"})
            // if not plant found respond 404
        Object.assign(plant, req.body)
        // update plant data from req.body
        // this update is with the mindset that all data from req.body fulfills all plant requirements
        res.status(200).json(plant)
        // respond with new plant data from the database
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// DELETE -- 204
app.delete('/plants/:id', async (req, res) => {
    try {
        const plant = await Plant.findOneAndDelete({id:req.params.id}).exec()
        if(!plant) return res.status(404).json({error: "Plant not Found"})
            // if find does not find a record it returns -1 which means record not found responds with 404
        // plants.splice(index, 1)
        // remove the record from the database
        res.status(204).send()
        // confirm removal of the record
    } catch (error) {
        res.status(500).json({error: error.message})
    }
    
})

// below we are connecting the MONGODB database
mongoose.connect(MONGODB_URI).then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on http://localhost:${PORT}`)
    })
})