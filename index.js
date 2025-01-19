require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require("node:fs");
const { checkApiKey } = require("./middleware/checkApiKey");
const swaggerFile = fs.readFileSync('./swagger/swagger.yaml', 'utf8'); 
const swaggerDocument = YAML.parse(swaggerFile);

 
app.use(cors({
    origin: "*",
    methods: ['GET', 'PUT', 'POST', 'DELETE']
}))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json())
app.use("/api/products", checkApiKey, require("./routes/products"))
app.use("/api/categories", checkApiKey, require("./routes/categories"))
app.use("/api/providers",checkApiKey, require("./routes/providers"))
app.use("/api/orders",checkApiKey, require("./routes/orders"))
app.use("/api/clients", checkApiKey, require("./routes/clients"))
app.use("/api/stats", checkApiKey, require("./routes/statistics"))
app.listen(3001, ()=>{
    console.log("Listen on port 3001");
    }
)