const router = require("express").Router()
const userRouter = require("./users")
const productRouter = require("./products")
const orderRouter = require('./orders')

router.use(userRouter)
router.use('/products', productRouter)
router.use('/orders', orderRouter)

module.exports = router