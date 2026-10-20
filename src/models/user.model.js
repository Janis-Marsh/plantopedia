'use strict'

/** User Schema */

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const {ROLE_VALUES, ROLES, AUTH} = require('../config/constants')

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, 'name required'],
            trim:true,
            maxlength:[60, 'name cannot exceed 60 characters']
        },
        email:{
            type:String,
            required:[true, 'email required'],
            unique:true,
            // unique is a =n index not a validator. Mongoose will ote raise validation error
            lowercase:true,
            trim:true,
            match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'please provide a valid email']
        },
        password:{
            type:String,
            required:[true, 'password required'],
            minlength:[8, 'password must be at least 8 characters long'],
            select: false
            /** select: false keeps the hash (encrypted password) out of every result unless specifically request using .select("password") */
        },
        role:{
            type:String,
            enum:{values:ROLE_VALUES, message:`{Value} is not a valid role`},
            default: ROLES.USER,
        }
    }, {
        timestamps:true,
        toJSON:{
            virtuals:true,
            versionKey:false,
            transform(doc, ret){
                ret.id = ret._id
                /**this is the second line of defense dor the password has, since select:false already keeps out most queries, but the login will need to load it on purpose and then send that same record back in the response */
                delete ret._id
                delete ret.password
                return ret
            }
        },
        toObject:{virtuals:true}
    }
)

/** DO NOT EVER STORE PASSWORDS UNENCRYPTED/PLAIN ON YOUR DATABASE
 * one database leak will mean the attacker will have user account information and access.
 * YOU CAN EVEN BE LIABLE FOR NOT SECURING INFORMATION
 * bcrypt is how we are going to encrypt user passwords, other info you should encrypt include user: address, ssn, phone number, userid (if not randomly made natively), banking info...etc
 * This will mean that you as the admin will not be able to give the user the password
 * 
 * the isModified check also matters this hook runs on every save, so without it changing a users name would rehash the already hashed password and lock the account out permanently
 */

userSchema.pre('save', async function hashPassword(){
    if(!this.isModified('password')) return
    // if the password was changed stop the function and return nothing

    this.password = await bcrypt.hash(this.password, AUTH.SALT_ROUNDS)
})


userSchema.methods.comparePassword = function comparePassword(candidatePassword){
    return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)