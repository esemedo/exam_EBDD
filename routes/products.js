const express = require("express")
const { getProducts } = require("../controller/productsController")
const router = express.Router()

router.get('/', getProducts)