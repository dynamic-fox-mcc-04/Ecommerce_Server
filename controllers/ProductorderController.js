const { ProductOrder, Order, Product } = require("../models/index")

class ProductorderController {
    static addCart(req, res, next) {
        const { total_price, quantity, OrderId, ProductId } = req.body
        let newCart = { total_price, quantity, OrderId, ProductId }
        ProductOrder.create(newCart)
            .then(result => {
                return res.status(201).json({
                    id: result.id,
                    total_price: result.total_price,
                    quantity: result.quantity,
                    OrderId: result.OrderId,
                    ProductId: result.ProductId
                })
            })
            .catch(err => next(err))
    }

    static getCarts(req, res, next) {
        ProductOrder.findAll({
            where: {
                'OrderId': req.params.OrderId
            },
            include: [{ model: Order }, { model: Product }]
        }).then(result => {
            let productOrders = []
            result.forEach(el => {
                productOrders.push({
                    id: el.id,
                    total_price: el.total_price,
                    quantity: el.quantity,
                    OrderId: el.OrderId,
                    ProductId: el.ProductId,
                    Order: el.Order.dataValues,
                    Product: el.Product.dataValues
                })
                return productOrders
            })
            return res.status(200).json(productOrders)
        })
            .catch(err => next(err))
    }

    static deleteCart(req, res, next) {
        let id = req.params.id
        ProductOrder.destroy({
            where: {
                'id': id
            }
        }).then(() => res.status(200).json({ msg: `success deleting cart with id ${id}` }))
            .catch(err => next(err))
    }
}


module.exports = ProductorderController