const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const authRoutes = require('./routes/auth.routes')
const eventoEstudo = require('./routes/eventoEstudo.routes')

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.use('/auth', authRoutes)
app.use('/Evento', eventoEstudo)

module.exports = app