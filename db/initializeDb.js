require("dotenv").config()
const { getConnectionDb } = require("../utils/db");
const fs = require("node:fs")

async function initializeDatabase() {
    try {
        const connection = await getConnectionDb()

        const schema = fs.readFileSync("db/db.sql", "utf8")
        
        await connection.query(schema);
        console.log("Base de données initialisée avec succès !");
        await connection.end();
    } catch (error) {
        console.error("Erreur lors de l'initialisation de la base :", error);
    }
}

initializeDatabase();