require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const PORT = process.env.PORT
const routes = require('./routes/index')
const errorsHandling = require("./middlewares/errorsHandling")

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(routes)
app.use(errorsHandling)

app.listen(PORT, () => console.log(`running on PORT ${PORT}`))
module.exports = { app, PORT }

