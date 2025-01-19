const express = require("express")
const { getProviders, postProviders, putProviders, deleteProviders } = require("../controller/providersController")
const { postProvidersValidation, putProvidersValidation, deleteProvidersValidation, getProvidersValidation } = require("../middleware/providersValidation")
const router = express.Router()

router.get('/',getProvidersValidation, getProviders)
router.post('/', postProvidersValidation, postProviders)
router.put('/',putProvidersValidation, putProviders)
router.delete('/:name_provider',deleteProvidersValidation, deleteProviders)


module.exports = router