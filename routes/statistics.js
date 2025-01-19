const express = require("express")
const { getTopProducts, getTotalSalesByRange } = require("../controller/statisticsController")
const { getStatisticsValidation } = require("../middleware/statisticsValidation")
const router = express.Router()

router.get('/top-products', getTopProducts)
router.get('/total-sales', getStatisticsValidation, getTotalSalesByRange)


module.exports = router