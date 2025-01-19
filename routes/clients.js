const express = require("express")
const { getClients, postClients, putClients, deleteClients, getClientsOrders } = require("../controller/clientsController")
const { postClientsValidation, putClientsValidation, deleteClientsValidation, getClientsValidation, getClientsValidationQuery } = require("../middleware/clientsValidation")
const router = express.Router()

router.get('/', getClientsValidationQuery, getClients )
router.get('/:email/orders', getClientsValidation, getClientsOrders )
router.post('/', postClientsValidation, postClients)
router.put('/', putClientsValidation, putClients)
router.delete('/:email', deleteClientsValidation, deleteClients)


module.exports = router