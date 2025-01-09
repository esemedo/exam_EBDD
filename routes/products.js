const express = require("express")
const { getProducts, postProducts, deleteProducts, putProducts } = require("../controller/productsController")
const router = express.Router()

router.get('/', getProducts)
router.post('/', postProducts)
router.put('/', putProducts)
router.delete('/:referenceProduct', deleteProducts)


module.exports = router