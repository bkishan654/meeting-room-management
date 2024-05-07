const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors)

const fetch = require('./fetch/fetch')
app.use('/fetch', fetch)

app.listen(8000)
console.log('server listening on port 8000')
