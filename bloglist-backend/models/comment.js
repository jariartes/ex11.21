const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const commentSchema = mongoose.Schema({
    comment: {
        type: String,
        required: true,
        minlength: 3
    },
})

commentSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Comment = mongoose.model('Comment', commentSchema)
commentSchema.plugin(uniqueValidator)

module.exports = Comment