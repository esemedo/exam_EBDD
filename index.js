require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require("node:fs");
const swaggerFile = fs.readFileSync('./swagger/swagger.yaml', 'utf8'); 
const swaggerDocument = YAML.parse(swaggerFile);

 
app.use(cors({
    origin: "*",
    methods: ['GET', 'PUT', 'POST', 'DELETE']
}))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json())
app.use("/api/products", require("./routes/products"))
app.use("/api/categories", require("./routes/categories"))
app.use("/api/providers", require("./routes/providers"))
app.use("/api/orders", require("./routes/orders"))
app.use("/api/clients", require("./routes/clients"))
app.listen(3001, ()=>{
    console.log("Listen on port 3001");
    }
)