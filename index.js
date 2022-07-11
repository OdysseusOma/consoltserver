// import needed tools
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const bodyParser = require('body-parser')
const cors = require('cors')


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



// Route
app.use('/user', require('./routes/user'))


app.listen(process.env.PORT, () => console.log('Server is running'))
