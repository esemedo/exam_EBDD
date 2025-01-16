const express = require("express")
const { getProviders, postProviders, putProviders, deleteProviders } = require("../controller/providersController")
const router = express.Router()

router.get('/', getProviders)
router.post('/', postProviders)
router.put('/', putProviders)
router.delete('/:name_provider', deleteProviders)


module.exports = router