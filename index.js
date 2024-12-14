const express = require("express")
const app = express()
const mongoose = require("./Model/mongodb")
const bodyParser  = require("body-parser")
const http = require('http');
const path = require("path");
const { initSocketIO } = require("./socketIo/socket")
const cors = require("cors")
require("dotenv").config()


const driverRoutes = require("./Routes/driver.routes")
const locationRoutes = require("./Routes/location.routes")


const server = http.createServer(app);

initSocketIO(server)
   

// app.use(cors({ origin: 'https://kaushik-react-gps.vercel.app' }));
// const corsOptions = {
//   origin: "*", // Allow all origins
//   methods: ["GET", "POST", "PUT", "DELETE"], // Add the HTTP methods you want to allow
//   credentials: true, // For cookies/authorization headers
// };

app.use(cors());  
app.use(bodyParser.json())
app.use(express.json())



app.use("/api", driverRoutes)
app.use("/api", locationRoutes)






app.get("/", (req, res) => {
  res.send(`------------ localhost serverside connected successfully ---------------- https://localhost:${3000}`)
})




server.listen(3000, () => {
    console.log(`------------ localhost connected successfully ---------------- https://localhost:${3000}`)
})