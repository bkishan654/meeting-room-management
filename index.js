const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2/promise')
const userRoutes = require('./apis/user')
const meetingRoutes = require('./apis/meeting-room')
const bookingRoutes = require('./apis/booking')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 8000
app.use(cors())

// Load environment variables from .env file
require('dotenv').config()

// Connect to MySQL database
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

// Parse incoming request bodies as JSON
app.use(bodyParser.json())
app.use('/user', userRoutes)
app.use('/meeting-room', meetingRoutes)
app.use('/booking', bookingRoutes)

// Start the server
app.listen(port, () => {
  console.lo(`Server listening on port ${port}`)
})
