const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

// Rotas
const authRoutes = require('./routes/auth')
app.use('/api', authRoutes)

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB conectado')
  app.listen(5000, () => console.log('Servidor na porta 5000'))
}).catch(err => console.error(err))
