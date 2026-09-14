'use strict'

const{port, nodeEnv} = require('./config/env')
const {API_PREFIX} = require('./config/constants')


async function start() {
    

    const server = app.listen(port, () => {
        console.log(`Plantopedia API [${nodeEnv}] listening on http://localhost:${port}`)
        console.log(` healthCheck: http://localhost:${port}/health`)
        console.log(` api: http://localhost:${host}${API_PREFIX}/plants`)
    })
}