const {connectDatabase, disconnectDatabase} = require('./config/database.js')
const {port, nodeEnv} = require('./config/env.js')
const app = require('./app.js')
const {API_PREFIX} = require('./config/constants')

async function start() {
    await connectDatabase()
    const server = app.listen(port, () => console.log(`Listening on http://localhost:${port}`))

    /**
     * stops new connections, let currently running reqs finish, then close db
     * every req in progress will fail if not done
     */
    const shutdown = (signal) => {
        console.log(`\n${signal} received, shutting down`)

        const force = setTimeout(() => {
            console.error("FORCING EXIT AFTER 10s")
            process.exit(1)
        }, 10000);
        force.unref()

        server.close(async () => {
            await disconnectDatabase()
            console.log("Shutdown complete")
            process.exit(0)
        })

        // significant terms and ints
        process.on('SIGTERM', () => shutdown('SIGTERM'))
        process.on('SIGINT', () => shutdown('SIGINT'))
    }
}

start()
