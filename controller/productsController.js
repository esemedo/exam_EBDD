const { SUCCESS_STATUS, NETWORK_ERROR_STATUS, NOTFOUND_STATUS } = require("../constants")
const ErrorResponseDTO = require("../dto/ErrorReponseDTO")
const ResponseDTO = require("../dto/ResponseDTO")
const { getConnectionDb } = require("../utils/db")

exports.getProducts = async (req, res, next) =>{
    try {
        const connection = await getConnectionDb()
        const sql = `SELECT * FROM Products ORDER BY id`
        const [data] = await connection.query(sql)
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Données récupérées", data, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
}


exports.postProducts = async (req, res, next) =>{
    try {
        const body = req.body
        const connection = await getConnectionDb()
        const sqlCategory = `SELECT id FROM Categories WHERE name_category= '${body.category}'`
        const [[category]] = await connection.query(sqlCategory)
        const sqlProducts = `INSERT INTO Products (name_product, references_product, stock, price, id_category) VALUES ('${body.nameProduct}', '${body.referenceProduct}', ${body.stock}, ${body.price}, ${category.id})`
        const data = await connection.query(sqlProducts)
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Donnée insérée", data, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
}

exports.putProducts = async (req, res, next) =>{
    try {
        const {references_product,name_product, stock, price,category} = req.body
        const connection = await getConnectionDb()
        const sqlSelectProducts = `SELECT * FROM Products WHERE references_product='${references_product}'`
        const [products] = await connection.query(sqlSelectProducts)
        if(!products){
            return res.status(NOTFOUND_STATUS).json(new ErrorResponseDTO("Le produit n'existe pas.", {}, NOTFOUND_STATUS))
        }
        let updates =""
        if(name_product){
            updates += `${updates.length >0? ",": ""}name_product='${name_product}'`
        }
        if(stock){
            updates += `${updates.length >0? ",": ""}stock=${stock}`
        } 
        if(price){
            updates += `${updates.length >0? ",": ""}price=${price}`
        }
        const productInfo = products[0]
        if(category){
            const sqlCategory = `SELECT id FROM Categories WHERE name_category= '${category}'`
            const [[result_category]] = await connection.query(sqlCategory)
            if(!result_category){
                throw new Error("Il y a eu une erreur lors de la mise à jour des données.")
            }
            updates += `${updates.length >0? ",": ""}id_category=${result_category.id}`
        }
        const sqlProducts = `UPDATE Products SET ${updates} WHERE id=${productInfo.id} `
        const [result] = await connection.query(sqlProducts)
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Données mis à jour.", result, SUCCESS_STATUS))
    } catch (error) {
        console.log(error);
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.", error, NETWORK_ERROR_STATUS))
    }
}

exports.deleteProducts = async (req,res, next) => {
    try {
        const {referenceProduct} = req.params
        const connection = await getConnectionDb()
        const sqlSelectProducts = `SELECT id FROM Products WHERE references_product='${referenceProduct}'`
        const [[products]] = await connection.query(sqlSelectProducts)
        if(!products){
            return res.status(NOTFOUND_STATUS).json(new ErrorResponseDTO("Le produit n'existe pas.", {}, NOTFOUND_STATUS))
        }
        const sql = `DELETE FROM Products WHERE id=${products.id}`
        const [data] = await connection.query(sql)
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Donnée supprimée", data, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
}