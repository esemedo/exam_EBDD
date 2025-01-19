const express = require("express")
const { getCategories, postCategories, putCategories, deleteCategories } = require("../controller/categoriesController")
const { postCategoriesValidation, putCategoriesValidation, deleteCategoriesValidation, getCategoriesValidation } = require("../middleware/categoriesValidation")
const router = express.Router()

router.get('/',getCategoriesValidation, getCategories)
router.post('/', postCategoriesValidation, postCategories)
router.put('/', putCategoriesValidation, putCategories)
router.delete('/:name_category', deleteCategoriesValidation, deleteCategories)


module.exports = router