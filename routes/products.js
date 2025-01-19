const express = require("express")
const { getProducts, postProducts, deleteProducts, putProducts } = require("../controller/productsController")
const { postProductsValidation, putProductsValidation, deleteProductsValidation } = require("../middleware/productsValidation")
const router = express.Router()

router.get('/', getProducts)
router.post('/', postProductsValidation, postProducts)
router.put('/',putProductsValidation, putProducts)
router.delete('/:references_product', deleteProductsValidation, deleteProducts)


module.exports = router