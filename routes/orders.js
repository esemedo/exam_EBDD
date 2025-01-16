const express = require("express")
const { getOrders, postOrders, putOrders, deleteOrders } = require("../controller/ordersController")
const router = express.Router()

router.get('/', getOrders)
router.post('/', postOrders)
router.put('/', putOrders)
router.delete('/:number_order', deleteOrders)


module.exports = router