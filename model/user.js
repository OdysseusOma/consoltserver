const mongoose = require('mongoose')


// create new schema for mongodb
const userSchema = new mongoose.Schema({
    title: {type: String},
    author_name: {type: String},
    article: {type: String},
    post_date: {type: String},
    post_length: {type: String},
    imageURL: {type: String},
    cloudinary_id: {type: String},
})


module.exports = mongoose.model('Post', userSchema)