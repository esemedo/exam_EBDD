const { SUCCESS_STATUS, NETWORK_ERROR_STATUS, NOTFOUND_STATUS, BADREQUEST_STATUS } = require("../constants")
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
        const [data] = await connection.query(sql)
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
        const body = req.body
        const connection = await getConnectionDb()
        await connection.beginTransaction();
        const sqlCategory = `SELECT id FROM Categories WHERE name_category= '${body.category}'`
        const [[category]] = await connection.query(sqlCategory)
        if(!category){
            return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO("La catégorie n'existe pas !", {}, BADREQUEST_STATUS))
        }
        if(!body.provider){
            return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO("Veuillez indiquer un fournisseur", {}, BADREQUEST_STATUS))
        }
        const sqlProvider = `SELECT id FROM Providers WHERE name_provider= '${body.provider}'`
        const [[provider]] = await connection.query(sqlProvider)
        if(!provider){
            return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO("Le fournisseur n'existe pas !", {}, BADREQUEST_STATUS))
        }
        const sqlProducts = `INSERT INTO Products (name_product, references_product, stock, price, id_category) VALUES ('${body.nameProduct}', '${body.referenceProduct}', ${body.stock}, ${body.price}, ${category.id})`
        const [data] = await connection.query(sqlProducts)
        const sqlProductsProviders = `INSERT INTO Providers_Products (id_provider, id_product) VALUES (${provider.id}, ${data.insertId})`
        await connection.query(sqlProductsProviders)
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
        const sqlSelectProducts = `SELECT * FROM Products WHERE references_product='${references_product}'`
        const [[products]] = await connection.query(sqlSelectProducts)
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
        
        const productInfo = products
        await connection.beginTransaction();
        if(category){
            const sqlCategory = `SELECT id FROM Categories WHERE name_category= '${category}'`
            const [[result_category]] = await connection.query(sqlCategory)
            if(!result_category){
                throw new Error("Il y a eu une erreur lors de la mise à jour des données.")
            }
            updates += `${updates.length >0? ",": ""}id_category=${result_category.id}`
        }
        if(provider){
            const sqlProvider = `SELECT id FROM Providers WHERE name_provider= '${provider}'`
            const [[providerInfo]] = await connection.query(sqlProvider)
            if(!providerInfo){
                return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO("Le fournisseur n'existe pas !", {}, BADREQUEST_STATUS))
            }
            const sqlProductsProvidersSELECT = `SELECT * FROM Providers_Products WHERE id_product=${productInfo.id} AND id_provider=${providerInfo.id}`
            const [[result]] = await connection.query(sqlProductsProvidersSELECT)
            if(result){
                return res.status(BADREQUEST_STATUS).json(new ResponseDTO("Le fournisseur est déjà associé à ce produit.", result, BADREQUEST_STATUS))
            }
            const sqlProductsProvidersINSERT = `INSERT INTO Providers_Products (id_product, id_provider) VALUES(${productInfo.id},${providerInfo.id})`
            await connection.query(sqlProductsProvidersINSERT)
        }
        const sqlProducts = `UPDATE Products SET ${updates} WHERE id=${productInfo.id}`
        const [result] = await connection.query(sqlProducts)
        await connection.commit();
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Données mis à jour.", result, SUCCESS_STATUS))
    } catch (error) {
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