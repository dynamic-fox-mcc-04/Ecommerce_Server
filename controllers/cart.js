const { Cart } = require('../models/index')

class CartController {
    static add (req, res, next) {
        const { ProductId, amount } = req.body
        const UserId = req.user.id
        Cart.findOne({ where: { ProductId: ProductId, UserId: UserId, status: false } })
            .then(response => {
                if(response) {
                    Cart.update({ amount }, { where: { id: response.id }, returning: true })
                } else {
                    Cart.create({ ProductId, UserId, amount, status: false })
                }
            })
            .then(response => {
                if(response[1][0]) {
                    return res.status(200).json(response[1][0])
                } else {
                    return res.status(201).json(response)
                }
            })
            .catch(err => {
                return next(err)
            })
    }
    static read (req, res, next) {
        Cart.findAll({ where: { UserId: req.user.id } })
            .then(response => {
                return res.status(200).json(response)
            })
            .catch(err => {
                return next(err)
            })
    }
    static checkout (req, res, next) {
        Cart.update({ status: true }, { where: { UserId: req.user.id} })
            .then(response => {
                return res.status(200).json({ message: `Your current cart has been checked out.`})
            })
            .catch(err => {
                return next(err)
            })
    }
    static changeAmt (req, res, next) {
        Cart.update({ amount: req.body.amount }, { where: { id: req.params.id }, returning: true })
            .then(response => {
                return res.status(200).json(response[0][1])
            })
            .catch(err => {
                return next(err)
            })
    }
    static destroy (req, res, next) {
        Cart.destroy({where: { id: req.params.id } })
            .then(response => {
                return res.status(200).json({ message: `Purchase cancelled` })
            })
            .catch(err => {
                return next(err)
            })
    }
}

module.exports = CartController