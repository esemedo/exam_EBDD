const { SUCCESS_STATUS, NETWORK_ERROR_STATUS, NOTFOUND_STATUS, BADREQUEST_STATUS } = require("../constants/constants")
const ErrorResponseDTO = require("../dto/ErrorReponseDTO")
const ResponseDTO = require("../dto/ResponseDTO")
const { getConnectionDb } = require("../utils/db")

const updateProductOfOrders = async (productBody, connection,res, isPut = false, oldProducts = [])=>{
    let productsWhereString = ""
    let productsWhereTab = []

    const stockUpdates = [];

    productBody.map((product)=>{
        productsWhereString += `${productsWhereString.length >0? " OR ": ""}references_product=?`
        productsWhereTab.push(product.name)
    })
    const sqlGetProductsId = `SELECT id,references_product, name_product ,price, stock FROM Products WHERE ${productsWhereString}`
    const [productsInfo] = await connection.execute(sqlGetProductsId, productsWhereTab)
    if(productBody.length !== productsInfo.length){
        return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO("La liste de produits est incorrecte !", {}, BADREQUEST_STATUS))
    }
    
    const removedProducts = oldProducts.filter(
        (oldProduct) => !productsInfo.some((newProduct) => newProduct.id === oldProduct.id_product)
    );

    await Promise.all(
        removedProducts.map(async (removedProduct) => {
            const sqlGetProduct = `SELECT stock FROM Products WHERE id=?`;
            const [[productInfo]] = await connection.execute(sqlGetProduct, [removedProduct.id_product]);

            const newStock = productInfo.stock + removedProduct.quantity;
            stockUpdates.push({ id: removedProduct.id_product, newStock });
        })
    );

    let total_price = 0
    const mergedProducts=await Promise.all(productsInfo.map(async (item) => {
        const match = productBody.find((product) => product.name === item.references_product);
        let stock = item.stock;
        if (isPut) {
            const oldMatch = oldProducts.find((product) => product.id_product === item.id);
            if (oldMatch) {
                stock += oldMatch.quantity; 
            }
        }
        if (!match) {
            throw new Error(`Produit non trouvé : ${item.name_product} (${item.references_product}).`, {
                cause: { status: BADREQUEST_STATUS },
            });
        }
        const newStock = stock - match.quantity;

        if (newStock < 0) {
            throw new Error(
                `La quantité demandée pour le produit ${item.name_product} (${item.references_product}) dépasse le stock disponible.`,
                { cause: { status: BADREQUEST_STATUS } }
            );
        }
        stockUpdates.push({ id: item.id, newStock });
        total_price += item.price * match.quantity;
        return {
            ...item,
            quantity: match.quantity,
        };
      }));
        return {mergedProducts, total_price , stockUpdates}
    
}


exports.getOrders = async (req, res, next) =>{
    try {
        const {start, end} = req.query
        const tabSql = []
        const connection = await getConnectionDb()
        let querySql = ""
        let sql = `WITH all_keys AS (
            SELECT id FROM Orders
            UNION
            SELECT id_product AS id FROM Orders_Products
        )

        SELECT
            CONCAT(c.firstname,' ', c.lastname) AS name_client,
            o.number_order, o.date_order, o.total_price,
            op.quantity, p.name_product AS product
        FROM all_keys k
        LEFT JOIN Orders o ON o.id = k.id
        LEFT JOIN Clients c ON c.id = o.id_client
        LEFT JOIN Orders_Products op ON k.id = op.id_order
        LEFT JOIN Products p ON op.id_product = p.id`

        if(start){
            querySql += " WHERE o.date_order >= ?"
            tabSql.push(start)
        }
        if(end){
            querySql += `${querySql.length >0? " AND ": " WHERE "}o.date_order <=?`
            tabSql.push(`${end}T23:59:59.000Z`)
        }
        sql+=querySql

        const [data] = await connection.execute(sql, tabSql)
        const groupedData = Object.values(
            data.reduce((acc, item) => {
              const orderKey = item.number_order; 
              if (!acc[orderKey]) {
                acc[orderKey] = { 
                    name_client : item.name_client,
                    number_order : item.number_order,
                    date_order : item.date_order,
                    number_order : item.number_order,
                    total_price : item.total_price,
                    products: [], 
                };
              }
              if(item.product){
                acc[orderKey].products.push({name:item.product, quantity: item.quantity});
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


exports.postOrders = async (req, res, next) =>{
    try {
        const {email, products} = req.body
        let nb_order;
        const connection = await getConnectionDb()
        await connection.beginTransaction();
        const sqlClient = `SELECT id FROM Clients WHERE email=?`
        const [[client]] = await connection.execute(sqlClient, [email])
        if(!client){
            return res.status(NOTFOUND_STATUS).json(new ErrorResponseDTO("Le client n'existe pas !", {}, NOTFOUND_STATUS))
        }
        try {
            const {mergedProducts, total_price, stockUpdates}= await updateProductOfOrders(products, connection,res)
            const sqlGetnbOrders = `SELECT * FROM Orders ORDER BY ID DESC LIMIT 1`
            const [[last_order]] = await connection.execute(sqlGetnbOrders)
            if(!last_order.number_order){
                nb_order = "0000000001"
            }else{
                let parsedString = parseInt(last_order.number_order) + 1
                nb_order = parsedString.toString().padStart(10, "0")
            }
            
            const sqlOrders = `INSERT INTO Orders (number_order, total_price, id_client) VALUES (?,?,?)`
            const [data] = await connection.execute(sqlOrders, [nb_order,total_price,client.id])
            
            const result = await Promise.all(mergedProducts.map(async (product)=>{
                const sqlOrdersProviders = `INSERT INTO Orders_Products (id_order, id_product, quantity) VALUES ( ?, ?, ?)`
                const [insertRelation] = await connection.execute(sqlOrdersProviders, [data.insertId, product.id, product.quantity])
                return insertRelation
                })
            )
            await Promise.all(
                stockUpdates.map(async ({ id, newStock }) => {
                    const sqlUpdateProduct = `UPDATE Products SET stock=? WHERE id=?`;
                    await connection.execute(sqlUpdateProduct, [newStock, id]);
                })
            );
            const response = {orders_products : result, orders:data}
            await connection.commit();
            await connection.end()
            res.status(SUCCESS_STATUS).json(new ResponseDTO("Donnée insérée",response , SUCCESS_STATUS))
        }  catch (error) {
            return res.status(NOTFOUND_STATUS).json(new ErrorResponseDTO(error.message, error, NOTFOUND_STATUS))
        }
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
}

exports.putOrders = async (req, res, next) =>{
    try {
        const {products, number_order} = req.body
        const connection = await getConnectionDb()
        await connection.beginTransaction();
        const sqlSelectOrders = `SELECT id FROM Orders WHERE number_order=?`
        const [[orderInfo]] = await connection.execute(sqlSelectOrders, [number_order])
        if(!orderInfo) {
            return res.status(NOTFOUND_STATUS).json(new ResponseDTO("La commande n'existe pas.", {}, NOTFOUND_STATUS))
        }
        const sqlProductsOrderSelect = `SELECT quantity, id_product FROM Orders_Products WHERE id_order=?`
        const [quantityOldProducts] =  await connection.execute(sqlProductsOrderSelect, [orderInfo.id])
            
        const sqlProductsOrdersDELETE = `DELETE FROM Orders_Products WHERE id_order=?`
        await connection.execute(sqlProductsOrdersDELETE, [orderInfo.id])

        try {
            const {mergedProducts, total_price, stockUpdates}= await updateProductOfOrders(products, connection,res, true, quantityOldProducts)
            const result = await Promise.all(mergedProducts.map(async (product)=>{
                const sqlOrdersProviders = `INSERT INTO Orders_Products (id_order, id_product, quantity) VALUES (?, ?, ?)`
                const [insertRelation] = await connection.execute(sqlOrdersProviders, [orderInfo.id, product.id, product.quantity])
                return insertRelation
                })
            )
            const sqlOrders = `UPDATE Orders SET total_price=? WHERE id=?`
            const [orderUpdated] = await connection.execute(sqlOrders, [total_price,orderInfo.id])
            const response = {orders_products : result, orders:orderUpdated}
            await Promise.all(
                stockUpdates.map(async ({ id, newStock }) => {
                    const sqlUpdateProduct = `UPDATE Products SET stock=? WHERE id=?`;
                    await connection.execute(sqlUpdateProduct, [newStock, id]);
                })
            );

            await connection.commit();
            await connection.end()
            res.status(SUCCESS_STATUS).json(new ResponseDTO("Données mis à jour.", response, SUCCESS_STATUS))
        }  catch (error) {
        return res.status(NOTFOUND_STATUS).json(new ErrorResponseDTO(error.message, error, NOTFOUND_STATUS))
        }
    } catch (error) {
        
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.", error, NETWORK_ERROR_STATUS))
    }
}

exports.deleteOrders = async (req,res, next) => {
    try {
        const {number_order} = req.params
        const connection = await getConnectionDb()
        await connection.beginTransaction()
        const sqlSelectOrders = `SELECT id FROM Orders WHERE number_order=?`
        const [[order]] = await connection.execute(sqlSelectOrders, [number_order])
        if(!order){
            return res.status(NOTFOUND_STATUS).json(new ErrorResponseDTO("La commande n'existe pas.", {}, NOTFOUND_STATUS))
        }
        const sql = `DELETE FROM Orders WHERE id=?`
        const [data] = await connection.execute(sql,[order.id])
        await connection.commit()
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Donnée supprimée", data, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
}