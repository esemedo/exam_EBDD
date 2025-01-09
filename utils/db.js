const mysql = require("mysql2/promise"); 

const getConnectionDb = async ()=>{
    console.log("Connected to db");
    return await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,
        multipleStatements: true
    });
}

module.exports = {getConnectionDb}