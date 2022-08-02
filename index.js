// import needed tools
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const bodyParser = require('body-parser')
const cors = require('cors')

//bring in method override
const methodOverride = require('method-override');


// connect DB
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log("mongoDB is connected"))
  .catch((err) => console.log(err));

// Middleware
// Use body-parser instead of express.json
// app.use(express.json())              commented out

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use(methodOverride('_method'));



// get ejs
const Post = require('./model/user')

app.set('view engine', 'ejs')
app.get('/', async (req, res) => {
  let user = await Post.find()
  res.render('home', {user: user})
})

// Route
app.use('/user', require('./routes/user'))

// access public folder
app.use(express.static('public'));



app.listen(process.env.PORT, () => console.log('Server is running'))
