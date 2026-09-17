const {connectDatabase, disconnectDatabase} = require('./config/database.js')
const {port} = require('./config/env.js')
const app = require('./app.js')

async function start() {
    await connectDatabase()
    const server = app.listen(port, () => console.log(`Listening on port:${port}`))
}
start()

async function stop() {
    await disconnectDatabase()
}