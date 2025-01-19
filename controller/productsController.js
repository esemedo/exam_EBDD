const { SUCCESS_STATUS, NETWORK_ERROR_STATUS, NOTFOUND_STATUS, BADREQUEST_STATUS } = require("../constants/constants")
const ErrorResponseDTO = require("../dto/ErrorReponseDTO")
const ResponseDTO = require("../dto/ResponseDTO")
const { getConnectionDb } = require("../utils/db")

exports.getProducts = async (req, res, next) =>{
    try {
        const connection = await getConnectionDb()
        const sql = `WITH all_keys AS (
            SELECT id FROM Products
            UNION
            SELECT id_product AS id FROM Providers_Products
        )

        SELECT
            pro.name_provider AS provider,
            p.name_product AS product, p.references_product, p.stock, p.price, c.name_category AS category 
        FROM all_keys keyss
        LEFT JOIN Products p ON p.id = keyss.id
        LEFT JOIN Categories c ON c.id = p.id_category 
        LEFT JOIN Providers_Products pro_p ON keyss.id = pro_p.id_product
        LEFT JOIN Providers pro ON pro_p.id_provider = pro.id;`
        const [data] = await connection.execute(sql)
        const groupedData = Object.values(
            data.reduce((acc, item) => {
              const productKey = item.product; 
              if (!acc[productKey]) {
                acc[productKey] = { 
                  ...item,
                  provider: [], 
                };
              }
              if(item.provider){
                acc[productKey].provider.push(item.provider);
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


exports.postProducts = async (req, res, next) =>{
    try {
        const {category, provider, name_product, references_product, stock, price} = req.body
        const connection = await getConnectionDb()
        await connection.beginTransaction();
        const sqlCategory = `SELECT id FROM Categories WHERE name_category= ?`
        const [[categoryInfo]] = await connection.execute(sqlCategory, [category])
        if(!categoryInfo){
            return res.status(NOTFOUND_STATUS).json(new ErrorResponseDTO("La catégorie n'existe pas !", {}, NOTFOUND_STATUS))
        }
        const sqlProvider = `SELECT id FROM Providers WHERE name_provider=?`
        const [[providerInfo]] = await connection.execute(sqlProvider, [provider])
        if(!providerInfo){
            return res.status(NOTFOUND_STATUS).json(new ErrorResponseDTO("Le fournisseur n'existe pas !", {}, NOTFOUND_STATUS))
        }
        const sqlProducts = `INSERT INTO Products (name_product, references_product, stock, price, id_category) VALUES (?, ?, ?, ?,?)`
        const [data] = await connection.execute(sqlProducts,[name_product, references_product, stock, price, categoryInfo.id])
        const sqlProductsProviders = `INSERT INTO Providers_Products (id_provider, id_product) VALUES (?, ?)`
        await connection.execute(sqlProductsProviders,[providerInfo.id, data.insertId])
        await connection.commit();
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Donnée insérée", data, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
}

exports.putProducts = async (req, res, next) =>{
    try {
        const {references_product,name_product, stock, price,category, provider} = req.body
        const connection = await getConnectionDb()
        await connection.beginTransaction()
        const sqlSelectProducts = `SELECT * FROM Products WHERE references_product=?`
        const [[products]] = await connection.execute(sqlSelectProducts, [references_product])
        if(!products){
            return res.status(NOTFOUND_STATUS).json(new ErrorResponseDTO("Le produit n'existe pas.", {}, NOTFOUND_STATUS))
        }
        let updates =""
        let updatesTab = []
        if(name_product){
            updates += `${updates.length >0? ",": ""}name_product=?`
            updatesTab.push(name_product)
        }
        if(stock){
            updates += `${updates.length >0? ",": ""}stock=?`
            updatesTab.push(stock)
        } 
        if(price){
            updates += `${updates.length >0? ",": ""}price=?`
            updatesTab.push(price)
        }
        
        const productInfo = products
        if(category){
            const sqlCategory = `SELECT id FROM Categories WHERE name_category=?`
            const [[result_category]] = await connection.execute(sqlCategory, [category])
            if(!result_category){
                throw new Error("Il y a eu une erreur lors de la mise à jour des données.")
            }
            updates += `${updates.length >0? ",": ""}id_category=?`
            updatesTab.push(result_category.id)
        }
        if(provider){
            const sqlProvider = `SELECT id FROM Providers WHERE name_provider=?`
            const [[providerInfo]] = await connection.execute(sqlProvider, [provider])
            if(!providerInfo){
                return res.status(NOTFOUND_STATUS).json(new ErrorResponseDTO("Le fournisseur n'existe pas !", {}, NOTFOUND_STATUS))
            }
            const sqlProductsProvidersSELECT = `SELECT * FROM Providers_Products WHERE id_product=? AND id_provider=?`
            const [[result]] = await connection.execute(sqlProductsProvidersSELECT, [productInfo.id,providerInfo.id])
            if(result){
                return res.status(BADREQUEST_STATUS).json(new ResponseDTO("Le fournisseur est déjà associé à ce produit.", result, BADREQUEST_STATUS))
            }
            const sqlProductsProvidersINSERT = `INSERT INTO Providers_Products (id_product, id_provider) VALUES(?,?)`
            await connection.execute(sqlProductsProvidersINSERT, [productInfo.id, providerInfo.id])
        }
        const sqlProducts = `UPDATE Products SET ${updates} WHERE id=?`
        const [result] = await connection.execute(sqlProducts, [...updatesTab, productInfo.id])
        await connection.commit();
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Données mis à jour.", result, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.", error, NETWORK_ERROR_STATUS))
    }
}

exports.deleteProducts = async (req,res, next) => {
    try {
        const {references_product} = req.params
        const connection = await getConnectionDb()
        await connection.beginTransaction()
        const sqlSelectProducts = `SELECT id FROM Products WHERE references_product=?`
        const [[products]] = await connection.execute(sqlSelectProducts, [references_product])
        if(!products){
            return res.status(NOTFOUND_STATUS).json(new ErrorResponseDTO("Le produit n'existe pas.", {}, NOTFOUND_STATUS))
        }
        const sql = `DELETE FROM Products WHERE id=?`
        const [data] = await connection.execute(sql, [products.id])
        await connection.commit()
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Donnée supprimée", data, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
}