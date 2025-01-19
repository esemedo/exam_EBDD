const express = require("express")
const { getOrders, postOrders, putOrders, deleteOrders } = require("../controller/ordersController")
const { postOrdersValidation, putOrdersValidation, deleteOrdersValidation } = require("../middleware/ordersValidation")
const router = express.Router()

router.get('/', getOrders)
router.post('/', postOrdersValidation, postOrders)
router.put('/', putOrdersValidation, putOrders)
router.delete('/:number_order', deleteOrdersValidation, deleteOrders)


module.exports = router