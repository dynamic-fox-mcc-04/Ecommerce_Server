const {app, PORT }= require("../app")
const http = require("http")

const server = http.createServer(app)

server.listen(PORT,() => console.log(`running on PORT ${PORT}`))