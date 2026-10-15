require('dotenv').config()

const REQUIRED = ['NODE_ENV', 'PORT', 'MONGODB_URI']
const missing = REQUIRED.filter((key) => !process.env[key])
//Built above is a set of rules to check and report amd required ENV variables

if(missing.length > 0) {
    console.log(`Missing required environmental variable(s): ${missing.join(', ')}`)
    process.exit(1)
}

module.exports = {
    nodeEnv: process.env.NODE_ENV,
    port: Number(process.env.PORT),
    mongoUri: process.env.MONGODB_URI,
    isProduction: process.env.NODE_ENV === 'production',
    // stage 2:
    isTest: process.env.NODE_ENV === 'test',
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || AUTH.DEFAULT_JWT_EXPIRES_IN
}

// exported variables can and should be used through the project and should serve as a central hub if any need to be added or changed