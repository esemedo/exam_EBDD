const { SUCCESS_STATUS, NETWORK_ERROR_STATUS, NOTFOUND_STATUS } = require("../constants")
const ErrorResponseDTO = require("../dto/ErrorReponseDTO")
const ResponseDTO = require("../dto/ResponseDTO")
const { getConnectionDb } = require("../utils/db")

exports.getClients= async (req, res, next) =>{
    try {
        const connection = await getConnectionDb()
        const sql = `SELECT c.firstname , c.lastname, c.email, c.address, o.number_order, o.date_order, o.total_price FROM Clients c LEFT JOIN orders o ON  o.id_client = c.id ORDER BY c.id`
        const [data] = await connection.query(sql)
        const groupedData = Object.values(
            data.reduce((acc, item) => {
              const clientKey = item.email; 
              if (!acc[clientKey]) {
                acc[clientKey] = { 
                    firstname : item.firstname,
                    lastname : item.lastname,
                    address : item.address,
                    email : item.email,
                    orders: [], 
                };
              }
              if(item.number_order){
                acc[clientKey].orders.push({number_order : item.number_order, 
                    date_order: item.date_order,
                    total_price : item.total_price
                });
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
        const sqlSelectClients= `SELECT id FROM Clients WHERE email='${email}'`
        const [[client]] = await connection.query(sqlSelectClients)
        if(!client){
            return res.status(NOTFOUND_STATUS).json(new ErrorResponseDTO("Le client n'existe pas.", {}, NOTFOUND_STATUS))
        }
        let updates = ""
        if(firstname){
            updates += `${updates.length >0? ",": ""}firstname='${firstname}'`
        }
        if(lastname){
            updates += `${updates.length >0? ",": ""}lastname='${lastname}'`
        } 
        if(address){
            updates += `${updates.length >0? ",": ""}address='${address}'`
        }
        const sqlClients= `UPDATE Clients SET ${updates} WHERE id=${client.id} `
        const [result] = await connection.query(sqlClients)
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Données mis à jour.", result, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.", error, NETWORK_ERROR_STATUS))
    }
}

exports.deleteClients= async (req,res, next) => {
    try {
        const {email} = req.params
        const connection = await getConnectionDb()
        const sqlSelectClients= `SELECT id FROM Clients WHERE email='${email}'`
        const [[client]] = await connection.query(sqlSelectClients)
        if(!client){
            return res.status(NOTFOUND_STATUS).json(new ErrorResponseDTO("Le client n'existe pas.", {}, NOTFOUND_STATUS))
        }
        const sql = `DELETE FROM Clients WHERE id=${client.id}`
        const [data] = await connection.query(sql)
        await connection.end()
        res.status(SUCCESS_STATUS).json(new ResponseDTO("Donnée supprimée", data, SUCCESS_STATUS))
    } catch (error) {
        res.status(NETWORK_ERROR_STATUS).json(new ErrorResponseDTO("Problème serveur.",error, NETWORK_ERROR_STATUS))
    }
}