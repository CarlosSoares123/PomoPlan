const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const authRoutes = require('./routes/auth.routes')

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.use('/auth', authRoutes)

module.exports = app