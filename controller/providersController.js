const { SUCCESS_STATUS, NETWORK_ERROR_STATUS, NOTFOUND_STATUS } = require("../constants")
const ErrorResponseDTO = require("../dto/ErrorReponseDTO")
const ResponseDTO = require("../dto/ResponseDTO")
const { getConnectionDb } = require("../utils/db")

exports.getProviders= async (req, res, next) =>{
    try {
        const connection = await getConnectionDb()
        const sql = `WITH all_keys AS (
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
            LEFT JOIN Products p ON p.id = pro_p.id_product;`
        const [data] = await connection.query(sql)
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
        const sqlProviders= `INSERT INTO Providers (name_provider) VALUES ('${name_provider}')`
        const data = await connection.query(sqlProviders)
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Donnée insérée", data, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
}

exports.putProviders= async (req, res, next) =>{
    try {
        const {name_provider, new_name_provider, products} = req.body
        const connection = await getConnectionDb()
        const sqlSelectProviders= `SELECT * FROM Providers WHERE name_provider='${name_provider}'`
        const [provider] = await connection.query(sqlSelectProviders)
        if(!provider){
            return res.status(NOTFOUND_STATUS).json(new ErrorResponseDTO("Le fournisseur n'existe pas.", {}, NOTFOUND_STATUS))
        }
      
        const providerInfo = provider[0]
        const sqlProviders= `UPDATE Providers SET name_provider='${new_name_provider}' WHERE id=${providerInfo.id} `
        const [result] = await connection.query(sqlProviders)
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
        const sqlSelectProviders= `SELECT id FROM Providers WHERE name_provider='${name_provider}'`
        const [[provider]] = await connection.query(sqlSelectProviders)
        if(!provider){
            return res.status(NOTFOUND_STATUS).json(new ErrorResponseDTO("Le fournisseur n'existe pas.", {}, NOTFOUND_STATUS))
        }
        const sql = `DELETE FROM Providers WHERE id=${provider.id}`
        const [data] = await connection.query(sql)
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Donnée supprimée", data, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
}