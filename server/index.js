require('dotenv').config()
import express from 'express'
import { Nuxt, Builder } from 'nuxt'

import api from './api'
import mongoose from 'mongoose'

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.set('port', port)

// Import API Routes
app.use('/api', api)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)

//Set up Database
const url = 'mongodb://' + process.env.DB_USER + ":" + process.env.DB_PASS + "@ds135966.mlab.com:35966/mail"
mongoose.connect(url)

// Listen the server
const server = app.listen(port, host)
server.timeout = 240000; //4 minutes
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
