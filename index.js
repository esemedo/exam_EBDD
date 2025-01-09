require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")

app.use(cors({
    origin: "*",
    methods: ['GET', 'PUT', 'POST', 'DELETE']
}))
app.use(express.json())
app.use("/api/products", require("./routes/products"))
app.listen(3001, ()=>{
    console.log("Listen on port 3001");
    }
)