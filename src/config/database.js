// We are pulling the connection logic for the database only and create functions for connecting and disconnecting from the database

const mongoose = require('mongoose')
const {mongoUri} = require('./env')

// mongoose by default will always auto reconnect after a network outage or issue. If you are not using listeners or trackers you and your code would have no idea it happened and worse yet no way to account for the loss of connection

let listenersAttached = false

function attachListeners() {
    if(listenersAttached) return;
    // making sure that if the function already ru to exit as to not double down
    listenersAttached = true

    mongoose.connection.on('connected', () => {
        console.log(`MongoDB Connected: ${mongoose.connection.name}`)
    })

    mongoose.connection.on('error', (err) => {
        console.log(`MongoDB error: ${err.message}`)
    })

    mongoose.connection.on('disconnected', () => {
        console.log(`MongoDB disconnected`)
    })
    // above and essentially if statements for mongoose. that '.on' the detection of connected, error, or disconnected the following console.logs will be executed

    // The next section will be connecting to the database and if that is not successful exits the process rather than throwing an error.
    // @param [string] [uri=mongoURI] overrides the configured uri used vy tests and script than target and different database

}

async function connectDatabase(uri = mongoUri) {
    // this strips the query fields that are not in the schema instead forwarding them to MONGODB a small way to guard against the user input reaching a query iba a shape you never meant for or use.
    mongoose.set("strictQuery", true)
    attachListeners()

    try {
        await mongoose.connect(uri, {
            // The failure to connect in 10secs rather than hanging for 30 seconds which is the default. we do this to be fast and it will be obvious if there is a failure
            serverSelectionTimeoutMS: 10000
        })
    } catch (err) {
        console.log(` Could not connect to MongoDB: ${err.message}`)
        process.exit(1)
    }
}

async function disconnectDatabase() {
    await mongoose.connection.close()
}

    function isConnected() {
    return mongoose.connection.readyState === 1
}

module.exports = { connectDatabase, disconnectDatabase, isConnected }