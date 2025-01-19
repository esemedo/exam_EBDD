const express = require("express")
const { getOrders, postOrders, putOrders, deleteOrders } = require("../controller/ordersController")
const { postOrdersValidation, putOrdersValidation, deleteOrdersValidation, getOrdersValidation } = require("../middleware/ordersValidation")
const router = express.Router()

router.get('/', getOrdersValidation, getOrders)
router.post('/', postOrdersValidation, postOrders)
router.put('/', putOrdersValidation, putOrders)
router.delete('/:number_order', deleteOrdersValidation, deleteOrders)


module.exports = router