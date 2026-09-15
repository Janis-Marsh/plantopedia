const express = require('express')

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
app.get('/plants', (req, res) => {
    res.status(200).json(plants)
    // responds back with all pants in the "database" in the form of a json
})

// READ --- 200 or 404
app.get('/plants/:id', (req, res) => {
    // requires a parameter that is in the URL segment, express captures this with :id
    const plant = plants.find((p) => p.id === req.params.id)
    // uses id parameter to search database for object with the same id
    if(!plant) {
        return res.status(404).json({error: 'Plant not found'})
        // If the plant is not found using the plant variable this conditional with respond
    }
    res.status(200).json(plant)
    // If it does exist then respond back with good status and specific plant data
})

// CREATE --- 201
app.post('/plants', (req, res) => {
    const plant = {id: String(nextId++), status: "healthy", ...req.body}
    // creates the template for a new plant and fills the rest of the nr=ew plant data from the req.body
    plants.push(plant)
    // adds plant to the database
    res.status(201).json(plant)
    // responds with new plant data from the database
})

// UPDATE --- 200 or 404
app.patch('/plants/:id', (req, res) => {
    const plant = plants.find((p) => p.id === req.params.id)
    // find specific plant record
    if(!plant) return res.status(404).json({error: "Plant not Found"})
        // if not plant found respond 404
    Object.assign(plant, req.body)
    // update plant data from req.body
    // this update is with the mindset that all data from req.body fulfills all plant requirements
    res.status(200).json(plant)
    // respond with new plant dta from the database
})

// DELETE -- 204
app.delete('/plants/:id', (req, res) => {
    const index = plants.findIndex((p) => p.id === req.params.id)
    if(index === -1) return res.status(404).json({error: "Plant not Found"})
        // if find does not find a record it returns -1 which means record not found responds with 404
    plants.splice(index, 1)
    // remove the record from the database
    res.status(204).send()
    // confirm removal of the record
})
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})