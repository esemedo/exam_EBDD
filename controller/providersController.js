const { SUCCESS_STATUS, NETWORK_ERROR_STATUS, NOTFOUND_STATUS } = require("../constants/constants")
const ErrorResponseDTO = require("../dto/ErrorReponseDTO")
const ResponseDTO = require("../dto/ResponseDTO")
const { getConnectionDb } = require("../utils/db")

exports.getProviders= async (req, res, next) =>{
    try {
        let sqlQuery = ""
        const tabSql = []
        const connection = await getConnectionDb()
        const {provider}= req.query
        if(provider){
            sqlQuery += " WHERE name_provider LIKE ?"
            tabSql.push(`%${provider}%`); 
        }
        let sql = `WITH all_keys AS (
                SELECT id FROM Providers
                UNION
                SELECT id_provider AS id FROM Providers_Products
            )
            SELECT 
                pro.name_provider AS provider,
                p.name_product AS product
            FROM all_keys keyss
            LEFT JOIN Providers pro ON keyss.id = pro.id
            LEFT JOIN Providers_Products pro_p ON keyss.id = pro_p.id_provider
            LEFT JOIN Products p ON p.id = pro_p.id_product`
        sql +=sqlQuery 
        const [data] = await connection.execute(sql, tabSql)
        const groupedData = Object.values(
            data.reduce((acc, item) => {
              const providerKey = item.provider; 
              if (!acc[providerKey]) {
                acc[providerKey] = { 
                  provider: item.provider, 
                  product: [] 
                };
              }
              if(item.product){
                acc[providerKey].product.push(item.product);
              }
          
              return acc;
            }, {})
        )
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Données récupérées", groupedData, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
}

exports.postProviders= async (req, res, next) =>{
    try {
        const {name_provider} = req.body
        const connection = await getConnectionDb()
        const sqlProviders= `INSERT INTO Providers (name_provider) VALUES (?)`
        const data = await connection.execute(sqlProviders,[name_provider])
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Donnée insérée", data, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
}

exports.putProviders= async (req, res, next) =>{
    try {
        const {name_provider, new_name_provider} = req.body
        const connection = await getConnectionDb()
        await connection.beginTransaction()
        const sqlSelectProviders= `SELECT * FROM Providers WHERE name_provider=?`
        const [[provider]] = await connection.execute(sqlSelectProviders, [name_provider])
        if(!provider){
            return res.status(NOTFOUND_STATUS).json(new ErrorResponseDTO("Le fournisseur n'existe pas.", {}, NOTFOUND_STATUS))
        }
        const sqlProviders= `UPDATE Providers SET name_provider=? WHERE id=? `
        const [result] = await connection.execute(sqlProviders, [new_name_provider, provider.id])
        await connection.commit()
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Données mis à jour.", result, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.", error, NETWORK_ERROR_STATUS))
    }
}

exports.deleteProviders= async (req,res, next) => {
    try {
        const {name_provider} = req.params
        const connection = await getConnectionDb()
        await connection.beginTransaction()
        const sqlSelectProviders= `SELECT id FROM Providers WHERE name_provider=?`
        const [[provider]] = await connection.execute(sqlSelectProviders, [name_provider])
        if(!provider){
            return res.status(NOTFOUND_STATUS).json(new ErrorResponseDTO("Le fournisseur n'existe pas.", {}, NOTFOUND_STATUS))
        }
        const sql = `DELETE FROM Providers WHERE id=?`
        const [data] = await connection.execute(sql, [provider.id])
        await connection.commit()
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Donnée supprimée", data, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
}