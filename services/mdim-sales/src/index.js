// mdim-sales entry point
const express=require("express")
const dotenv=require("dotenv").config()
const connectDB = require("./config/db");
const logger = require("./config/logger");
const salesRoutes = require("./routes/salesRoutes");
const app = express();
app.use(express.json());
connectDB(process.env.MONGO_URI);

app.use("/api/sales", salesRoutes);
const port=4003
app.listen(port,()=>{
    console.log(`sevice is running on port ${port}`)
})