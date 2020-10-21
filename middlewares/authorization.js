const { Product } = require("../models/index")

module.exports = (req, res, next) => {
    let id = +req.params.id
    if (req.currentUserId) { //untuk authentikasi admin
        Product.findOne({
            where: {
                'id': id
            }
        }).then(result => {
            if (result) {
                req.authorizedId = result.id
                return next()
            } else {
                return next({
                    name: 'NotFound'
                })
            }

        }).catch(err => {
            return next({
                name: 'NotFound'
            })
        })
    }
}