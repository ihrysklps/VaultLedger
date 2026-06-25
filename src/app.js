const express = require('express')
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.routes")
const app = express()
const accountRouter = require("./routes/accounts.routes")

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRouter)
app.use("/api/accounts", accountRouter)

module.exports = app
