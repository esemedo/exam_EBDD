const { SUCCESS_STATUS, NETWORK_ERROR_STATUS, NOTFOUND_STATUS } = require("../constants")
const ErrorResponseDTO = require("../dto/ErrorReponseDTO")
const ResponseDTO = require("../dto/ResponseDTO")
const { getConnectionDb } = require("../utils/db")

exports.getCategories= async (req, res, next) =>{
    try {
        const connection = await getConnectionDb()
        const sql = `SELECT * FROM Categories ORDER BY id`
        const [data] = await connection.query(sql)
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Données récupérées", data, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
}



exports.postCategories= async (req, res, next) =>{
    try {
        const {name_category} = req.body
        const connection = await getConnectionDb()
        const sqlCategories= `INSERT INTO Categories (name_category) VALUES ('${name_category}')`
        const data = await connection.query(sqlCategories)
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Donnée insérée", data, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
}

exports.putCategories= async (req, res, next) =>{
    try {
        const {name_category, new_name_category} = req.body
        const connection = await getConnectionDb()
        const sqlSelectCategories= `SELECT * FROM Categories WHERE name_category='${name_category}'`
        const [category] = await connection.query(sqlSelectCategories)
        if(!category){
            return res.status(NOTFOUND_STATUS).json(new ErrorResponseDTO("La catégorie n'existe pas.", {}, NOTFOUND_STATUS))
        }
        const categoryInfo = category[0]
        const sqlCategories= `UPDATE Categories SET name_category='${new_name_category}' WHERE id=${categoryInfo.id} `
        const [result] = await connection.query(sqlCategories)
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Données mis à jour.", result, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.", error, NETWORK_ERROR_STATUS))
    }
}

exports.deleteCategories= async (req,res, next) => {
    try {
        const {name_category} = req.params
        const connection = await getConnectionDb()
        const sqlSelectCategories= `SELECT id FROM Categories WHERE name_category='${name_category}'`
        const [[category]] = await connection.query(sqlSelectCategories)
        if(!category){
            return res.status(NOTFOUND_STATUS).json(new ErrorResponseDTO("Le produit n'existe pas.", {}, NOTFOUND_STATUS))
        }
        const sql = `DELETE FROM Categories WHERE id=${category.id}`
        const [data] = await connection.query(sql)
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Donnée supprimée", data, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
}