const { User } = require("../models/index")
const { encryptPassword, decryptPassword } = require("../helpers/bcrypt")
const { getToken } = require("../helpers/jwt")

class UserController {
    static register(req, res, next) {
        const { email, password } = req.body
        let newUser = {
            email,
            password: encryptPassword(password)
        }
        User.create(newUser)
            .then(result => {
                const { email, id } = result
                return res.status(201).json({
                    id,
                    email
                })
            }).catch(err => next(err))
    }
    static login(req, res, next) {
        const { email, password } = req.body
        let user = {
            email, password
        }
        User.findOne({
            where: {
                email: user.email
            }
        }).then(result => {
            if (result) {
                let compare = decryptPassword(user.password, result.password)
                if (compare) {
                    let payload = {
                        id: result.id,
                        email: result.email
                    }
                    return res.status(200).json({
                        id: result.id,
                        email: result.email,
                        access_token: getToken(payload)
                    })
                } else {
                    return next({
                        name: 'InvalidLogin'
                    })
                }
            } else {

                return next({
                    name: 'InvalidLogin'
                })
            }
        }).catch(err => {
            return next(err)
        })
    }
}

module.exports = UserController