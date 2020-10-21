const jwt = require("jsonwebtoken")


function getToken(payload) {
    return jwt.sign(payload, process.env.SECRETTOKEN)
}
function verToken(token){
    return jwt.verify(token, process.env.SECRETTOKEN)
}
module.exports = {
    getToken,
    verToken
}