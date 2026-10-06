'use Strict'

/** Plant Schema
 * 
 * This template will be used as a form of validation for the creation of new plants,
 * as well as a rigid structure defining a;; aspects of what a plant will be.
 * 
 * It is extremely important to plan out our models/schema as if you change the models
 * after you have stored information it will create anomalies in the api function because
 * of the difference between record types
 */

const mongoose = require('mongoose')
const {LOCATIONS, PLANT_STATUSES, PLANT_STATUS} = require('../config/constants')

const plantSchema = new mongoose.Schema(
    {
        nickname: {
            type: String,
            required: [true, 'nickname required'],
            trim: true,
            maxlength: [60, 'nickname cannot exceed 60 characters']
        },
        species:{
            type: String,
            trim: true,
            maxlength: [80, 'species cannot exceed 80 characters'],
            default: 'Unknown'
        },
        location:{
            type: String,
            required: [true, 'location required'],
            enum:{values: LOCATIONS, message: '{VALUE is not a supported location'}
            // enum only allows for the preset options defined by you and if none of those
            // are options set as a value then the validation will fail and the message will appear
        },
        wateringIntervalDays:{
            type: Number,
            required: [true, 'wateringIntervalDays required'],
            min: [1, 'wateringIntervalDays must be at least 1'],
            max: [365, 'wateringIntervalDays cannot exceed 365']
        },
        lastWateredAt:{
            type: Date,
            default: null
        },
        status:{
            type: String,
            enum: {values: PLANT_STATUSES, message: '{VALUE is not a supported status'},
            default: PLANT_STATUS.HEALTHY
        },
        notes:{
            type: String,
            trim: true,
            maxlength: [2000, 'notes cannot exceed 2000 characters']
        },

        //** Owner f the record:
        // can be set to null at first but this 
        // is needed for stage 2 to allow users to create their own records, and
        // have those records tied to their account allowing them crud permissions for
        // only those records that is for stage 3 
        // 
        // For now: set the req.user.id on create will make it required as well */
        ownerId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            index: true
            // this indexing is to allow faster records searching and other types of queries
            // when this is true this will create a sorted map for the database to force better and faster
            // think of it like the whitepages listing in order for all people
            // specifically it will speed up find, findOne, and sort functions in mongoose
        },
    }, {
        timestamps: true,
        toJSON: {
            virtuals: true,
            versionKey: true,
            transform(doc, ret){
                ret.id = ret._id
                delete ret._id
                return ret
            }
        },
        toObject: {virtuals: true}
        /**
         * Virtuals:
         * are structures and properties that ate not stored on mongoDB it set but can be used
         * to eliminate data redundancy, keeping all the data encapsulated and separate, this will be
         * basically the process of creating and using getters and setters
         */
    }
)

/** Date the plant is to be watered next or null if it has never been watered */
plantSchema.virtual('nextWateringDue').get(function getNextWateringDue() {
    if(!this.lastWateredAt) return null
    const due = new Date(this.lastWateredAt)
    due.setDate(due.getDate + this.wateringIntervalDays)
    // calculates when the next acceptable water day is based on the lastWateredAt
    // field and data
    return due
})

/** true when the plant is past due and still active */
plantSchema.virtual('isOverdue').get(function getIsOverdue() {
    if(this.status === PLANT_STATUS.RETIRED) return false
    // checks to make sure plant isn't retired
    const due = this.nextWateringDue
    // uses the previous virtual to compute the next date and then returns it
    return due ? due.getTime() < Date.now() : true
    // checks to make sure that there is a due if not make that due time is before now
})

/** Helper used by the service when watering the plant */
plantSchema.methods.markWatered = function markWatered(when = new Date()) {
    this.lastWateredAt = when
    this.status = PLANT_STATUS.HEALTHY
    return this
    // this is a premade function that the api user can call and have it set the plant status and update the
    // last wateredAt field of the plant record
}

/** this will support the status and location filters they will use and that are exposed by the list endpoints */
plantSchema.index({status: 1, location: 1})
// creates an index on both the status and location fields: the 1 means ascending order
plantSchema.index({createdAt: -1})
// -1 is descending order

module.exports = mongoose.model('Plant', plantSchema)
// all models no matter what should have the first character capitalized 
// and the first character cannot be a number