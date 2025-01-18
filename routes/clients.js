const express = require("express")
const { getClients, postClients, putClients, deleteClients } = require("../controller/clientsController")
const router = express.Router()

router.get('/', getClients )
router.post('/', postClients)
router.put('/', putClients)
router.delete('/:email', deleteClients)


module.exports = router