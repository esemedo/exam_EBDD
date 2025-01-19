const express = require("express")
const { getClients, postClients, putClients, deleteClients } = require("../controller/clientsController")
const { postClientsValidation, putClientsValidation, deleteClientsValidation } = require("../middleware/clientsValidation")
const router = express.Router()

router.get('/', getClients )
router.post('/', postClientsValidation, postClients)
router.put('/', putClientsValidation, putClients)
router.delete('/:email', deleteClientsValidation, deleteClients)


module.exports = router