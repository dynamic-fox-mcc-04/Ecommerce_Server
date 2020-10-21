const bcrypt = require("bcryptjs")

function encryptPassword(password) {
    let salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
}
// let hash = encryptPassword("12345")
function decryptPassword(password, hash) {
    return bcrypt.compareSync(password, hash)
}
// console.log(decryptPassword("12345", hash))

module.exports = {
    encryptPassword,
    decryptPassword
}