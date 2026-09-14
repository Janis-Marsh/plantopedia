/**
 * These constants will be shared throughout the project and are store and exported here to allow for updates across the entire app at one.
 */

/* Rooms a plant can live in: */
const LOCATION = Object.freeze([
    'living_room',
    'kitchen',
    'bedroom',
    'bathroom',
    'office',
    'balcony'
])
/* PLANT Life Cycle */
const PLANT_STATUS = Object.freeze({
    HEALTH: 'healthy',
    THIRSTY: 'thirsty',
    STRUGGLING: 'struggling',
    RETIRED: 'retired'  // retired plants can not be watered
})

const PLANT_STATUSES = Object.freeze(Object.values(PLANT_STATUS))
// just an objects of all the statuses possible

/* Client Fields for sorting/ filtering: everything else is ignored */
const SORTABLE_FIELDS = Object.freeze([
    'createdAt', 'updatedAt', 'nickname', 'wateringIntervalDays', 'lastWateredAt'
])

/* Pagination for request limits */
const PAGINATION = Object.freeze({
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
})

/* API prefix, the strings added to the url to acess the api not the homepage or documentation page */
const API_PREFIX = '/api/v1'

module.exports = {
    LOCATIONS, PLANT_STATUS, PLANT_STATUSES, SORTABLE_FIELDS, PAGINATION, API_PREFIX
}