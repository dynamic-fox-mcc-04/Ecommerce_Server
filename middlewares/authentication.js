const { User } = require("../models")
const { verToken } = require("../helpers/jwt")

module.exports = (req, res, next) => {
    try {
        let decoded = verToken(req.headers.access_token)
        User.findOne({
            where: {
                'id': decoded.id
            }
        }).then(result => {
            if (result) {
                // console.log(result.id)
                req.currentUserId = result.id
                return next()
            } else {
                return next({
                    name: 'NotAuthorized'
                })
            }
        }).catch(err => {
            return next({
                name: 'NotAuthorized'
            })
        })
    } catch (error) {
        return next(error)
    }
}
