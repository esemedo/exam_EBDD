const express = require("express")
const { getCategories, postCategories, putCategories, deleteCategories } = require("../controller/categoriesController")
const router = express.Router()

router.get('/', getCategories)
router.post('/', postCategories)
router.put('/', putCategories)
router.delete('/:name_category', deleteCategories)


module.exports = router