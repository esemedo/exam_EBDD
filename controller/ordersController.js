const { SUCCESS_STATUS, NETWORK_ERROR_STATUS, NOTFOUND_STATUS, BADREQUEST_STATUS } = require("../constants")
const ErrorResponseDTO = require("../dto/ErrorReponseDTO")
const ResponseDTO = require("../dto/ResponseDTO")
const { getConnectionDb } = require("../utils/db")

exports.getOrders = async (req, res, next) =>{
    try {
        const connection = await getConnectionDb()
        const sql = `WITH all_keys AS (
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
        LEFT JOIN Products p ON op.id_product = p.id;`
        const [data] = await connection.query(sql)
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
        const sqlClient = `SELECT id FROM Clients WHERE email= '${email}'`
        const [[client]] = await connection.query(sqlClient)
        if(!client){
            return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO("Le client n'existe pas !", {}, BADREQUEST_STATUS))
        }
        let productsWhereString = ""
        products.map((product)=>{
            productsWhereString += `${productsWhereString.length >0? " OR ": ""}references_product=${product.name}`
        })
        const sqlGetProductsId = `SELECT id,references_product, price FROM Products WHERE ${productsWhereString}`
        const [productsId] = await connection.query(sqlGetProductsId)
        if(products.length !== productsId.length){
            return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO("La liste de produits est incorrecte !", {}, BADREQUEST_STATUS))
        }

        let total_price = 0

        const mergedProducts= productsId.map(item => {
            const match = products.find(product => product.name === item.references_product);
            total_price += item.price * match.quantity
            return {
              ...item, 
              quantity: match ? match.quantity : 1
            };
          });
        const sqlGetnbOrders = `SELECT * FROM Orders ORDER BY ID DESC LIMIT 1`
        const [[last_order]] = await connection.query(sqlGetnbOrders)
        if(!last_order.number_order){
            nb_order = "0000000001"
        }else{
            let parsedString = parseInt(last_order.number_order) + 1
            nb_order = parsedString.toString().padStart(10, "0")
        }
        
        const sqlOrders = `INSERT INTO Orders (number_order, total_price, id_client) VALUES ('${nb_order}', ${total_price}, ${client.id})`
        const [data] = await connection.query(sqlOrders)
        
        const result = await Promise.all(mergedProducts.map(async (product)=>{
            const sqlOrdersProviders = `INSERT INTO Orders_Products (id_order, id_product, quantity) VALUES ( ${data.insertId}, ${product.id}, ${product.quantity})`
            const [insertRelation] = await connection.query(sqlOrdersProviders)
            return insertRelation
            })
        )
        const response = {orders_products : result, orders:data}
        await connection.commit();
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Donnée insérée",response , SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
}

exports.putOrders = async (req, res, next) =>{
    try {
        const {products, number_order} = req.body
        const connection = await getConnectionDb()
        await connection.beginTransaction();
        const sqlSelectOrders = `SELECT id FROM Orders WHERE number_order='${number_order}'`
        const [[orderInfo]] = await connection.query(sqlSelectOrders)
        if(!orderInfo) {
            return res.status(BADREQUEST_STATUS).json(new ResponseDTO("La commande n'existe pas.", {}, BADREQUEST_STATUS))
        }
        const sqlProductsProvidersSELECT = `DELETE FROM Orders_Products WHERE id_order=${orderInfo.id}`
        await connection.query(sqlProductsProvidersSELECT)

        let productsWhereString = ""
        products.map((product)=>{
            productsWhereString += `${productsWhereString.length >0? " OR ": ""}references_product=${product.name}`
        })
        const sqlGetProductsId = `SELECT id,references_product, price FROM Products WHERE ${productsWhereString}`
        const [productsInfo] = await connection.query(sqlGetProductsId)
        if(products.length !== productsInfo.length){
            return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO("La liste de produits est incorrecte !", {}, BADREQUEST_STATUS))
        }
        let total_price = 0

        const mergedProducts= productsInfo.map(item => {
            const match = products.find(product => product.name === item.references_product);
            total_price += item.price * match.quantity
            return {
              ...item, 
              quantity: match ? match.quantity : 1
            };
          });
        const result = await Promise.all(mergedProducts.map(async (product)=>{
            const sqlOrdersProviders = `INSERT INTO Orders_Products (id_order, id_product, quantity) VALUES (${orderInfo.id}, ${product.id}, ${product.quantity})`
            const [insertRelation] = await connection.query(sqlOrdersProviders)
            return insertRelation
            })
        )
        const sqlOrders = `UPDATE Orders SET total_price=${total_price} WHERE id=${orderInfo.id}`
        const [orderUpdated] = await connection.query(sqlOrders)
        const response = {orders_products : result, orders:orderUpdated}

        await connection.commit();
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Données mis à jour.", response, SUCCESS_STATUS))
    } catch (error) {
        console.log(error);
        
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.", error, NETWORK_ERROR_STATUS))
    }
}

exports.deleteOrders = async (req,res, next) => {
    try {
        const {number_order} = req.params
        const connection = await getConnectionDb()
        const sqlSelectOrders = `SELECT id FROM Orders WHERE number_order='${number_order}'`
        const [[order]] = await connection.query(sqlSelectOrders)
        if(!order){
            return res.status(NOTFOUND_STATUS).json(new ErrorResponseDTO("La commande n'existe pas.", {}, NOTFOUND_STATUS))
        }
        const sql = `DELETE FROM Orders WHERE id=${order.id}`
        const [data] = await connection.query(sql)
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Donnée supprimée", data, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
}