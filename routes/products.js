const express = require("express")
const { getProducts, postProducts, deleteProducts, putProducts, getProductsOrders, getNotifStockLow } = require("../controller/productsController")
const { postProductsValidation, putProductsValidation, deleteProductsValidation, getProductsValidation, getNotifProductsValidation, getFirstfProductsValidation } = require("../middleware/productsValidation")
const router = express.Router()

router.get('/', getFirstfProductsValidation,getProducts)
router.get('/:references_product/orders', getProductsValidation, getProductsOrders)
router.get('/stock-low', getNotifProductsValidation, getNotifStockLow)
router.post('/', postProductsValidation, postProducts)
router.put('/',putProductsValidation, putProducts)
router.delete('/:references_product', deleteProductsValidation, deleteProducts)


module.exports = router