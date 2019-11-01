require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const routes = require('./routes/routes')

const app = express()
const port = process.env.PORT || 8000

app.use(express.static('public'))
app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.text({ type: 'text/html' }))

routes(app)

app.listen(port)
