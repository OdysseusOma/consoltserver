const mongoose = require('mongoose')


const domPurifier = require('dompurify');
const { JSDOM } = require('jsdom');
const htmlPurify = domPurifier(new JSDOM().window);

const { stripHtml } = require('string-strip-html');

// create new schema for mongodb
const userSchema = new mongoose.Schema({
    title: {type: String},
    author_name: {type: String},
    article: {type: String},
    snippet: {type: String},
    post_date: {type: String},
    post_length: {type: String},
    imageURL: {type: String},
    cloudinary_id: {type: String},
})

userSchema.pre('validate', function (next) {
  //check if there is an article
  if (this.article) {
    this.article = htmlPurify.sanitize(this.article);
    this.snippet = stripHtml(this.article.substring(0, 134)).result;
  }

  next();
});

module.exports = mongoose.model('Post', userSchema)