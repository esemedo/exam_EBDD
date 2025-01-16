const { SUCCESS_STATUS, NETWORK_ERROR_STATUS, NOTFOUND_STATUS } = require("../constants")
const ErrorResponseDTO = require("../dto/ErrorReponseDTO")
const ResponseDTO = require("../dto/ResponseDTO")
const { getConnectionDb } = require("../utils/db")

exports.getClients= async (req, res, next) =>{
    try {
        const connection = await getConnectionDb()
        const sql = `SELECT * FROM Clients ORDER BY id`
        const [data] = await connection.query(sql)
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Données récupérées", data, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
}



exports.postClients= async (req, res, next) =>{
    try {
        const {firstname, lastname, address , email} = req.body
        const connection = await getConnectionDb()
        const sqlClients= `INSERT INTO Clients (firstname, lastname, address, email) VALUES ('${firstname}', '${lastname}', '${address}', '${email}')`
        const data = await connection.query(sqlClients)
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Donnée insérée", data, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
}

exports.putClients= async (req, res, next) =>{
    try {
        const {firstname, lastname, address , email} = req.body
        const connection = await getConnectionDb()
        const sqlSelectClients= `SELECT * FROM Clients WHERE email='${email}'`
        const [category] = await connection.query(sqlSelectClients)
        if(!category){
            return res.status(NOTFOUND_STATUS).json(new ErrorResponseDTO("La catégorie n'existe pas.", {}, NOTFOUND_STATUS))
        }
        const categoryInfo = category[0]
        const sqlClients= `UPDATE Clients SET name_category='${new_name_category}' WHERE id=${categoryInfo.id} `
        const [result] = await connection.query(sqlClients)
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Données mis à jour.", result, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.", error, NETWORK_ERROR_STATUS))
    }
}

exports.deleteClients= async (req,res, next) => {
    try {
        const {name_category} = req.params
        const connection = await getConnectionDb()
        const sqlSelectClients= `SELECT id FROM Clients WHERE name_category='${name_category}'`
        const [[category]] = await connection.query(sqlSelectClients)
        if(!category){
            return res.status(NOTFOUND_STATUS).json(new ErrorResponseDTO("La catégorie n'existe pas.", {}, NOTFOUND_STATUS))
        }
        const sql = `DELETE FROM Clients WHERE id=${category.id}`
        const [data] = await connection.query(sql)
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Donnée supprimée", data, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
}