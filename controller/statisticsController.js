const { SUCCESS_STATUS, NETWORK_ERROR_STATUS } = require("../constants/constants");
const ErrorResponseDTO = require("../dto/ErrorReponseDTO");
const ResponseDTO = require("../dto/ResponseDTO");
const { getConnectionDb } = require("../utils/db")

exports.getTopProducts =  async (req, res, next) => {
    try {
        const connection = await getConnectionDb();
        const sql = `
        WITH all_keys AS (
            SELECT id FROM Products
            UNION
            SELECT id_product AS id FROM Providers_Products
        )

        SELECT
            pro.name_provider AS provider,
            p.name_product AS product, p.references_product, p.stock, p.price, c.name_category AS category ,
             SUM(op.quantity) AS total_sales
        FROM all_keys keyss
        LEFT JOIN Products p ON p.id = keyss.id
        LEFT JOIN Categories c ON c.id = p.id_category 
        LEFT JOIN Providers_Products pro_p ON keyss.id = pro_p.id_product
        LEFT JOIN Providers pro ON pro_p.id_provider = pro.id 
        LEFT JOIN Orders_Products op ON op.id_product = p.id
        GROUP BY name_product, pro.name_provider, p.references_product, p.stock, p.price, c.name_category
        ORDER BY 
                total_sales DESC
        LIMIT 10
        `;
        const [data] = await connection.execute(sql);
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
        await connection.end();
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Données récupérées", groupedData, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
};

exports.getTotalSalesByRange = async (req, res, next) => {
    const { start_date, end_date } = req.query;
    try {
        const connection = await getConnectionDb();
        const sql = `
            SELECT SUM(o.total_price) AS total_sales FROM Orders o WHERE o.date_order BETWEEN ? AND ?;
        `;
        const [data] = await connection.execute(sql, [start_date, `${end_date}T23:59:59.000Z`]);
        await connection.end();
        res.status(SUCCESS_STATUS).json(new ResponseDTO(`Total des ventes entre ${start_date} et ${end_date} : `, data, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
};

