const router = require("express").Router()
const auth = require("../middlewares/authentication")
const authorization = require("../middlewares/authorization")
const ProductController = require("../controllers/ProductController")

router.get('/', ProductController.getAll)
router.use(auth)
router.post('/', ProductController.create)
// router.use(authorization)
router.put('/:id', authorization, ProductController.update)
router.get('/:id', authorization, ProductController.getProduct)
router.delete('/:id', authorization, ProductController.delete)



module.exports = router