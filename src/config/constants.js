


/** rooms a plant can live in*/
const LOCATIONS = Object.freeze([
    'living-room', 'kitchen', 'bedroom', 'bathroom', 'office', 'balcony', 'home-theatre'
])

/** Life Cycles */
const PLANT_STATUS = Object.freeze({
    HEALTHY: 'healthy', THIRSTY: 'thirsty', STRUGGLING: 'struggling', RETIRED: 'retired'
})
const PLANT_STATUSES = Object.freeze(Object.values(PLANT_STATUS))

//** Client Tags for Sorting*/
const SORTABLE_FIELDS = Object.freeze([
    'createdAt', 'updatedAt', 'nickname', 'wateringIntervalDays', 'lastWateredAt'
])

const PAGINATION = Object.freeze({
    DEFAULT_PAGE: 1, DEFAULT_LIMIT: 20, MAX_LIMIT: 100
})

const API_PREFIX = '/api/v1'

module.exports = {LOCATIONS, PLANT_STATUS, PLANT_STATUSES, SORTABLE_FIELDS, PAGINATION, API_PREFIX}