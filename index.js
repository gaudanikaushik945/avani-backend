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

const io =initSocketIO(server)
   




app.use(cors({ origin: 'https://kaushik-react-gps.vercel.app' }));
  app.use(bodyParser.json())
app.use(express.json())



app.use("/api", driverRoutes)
app.use("/api", locationRoutes)


app.get("/", (req, res) => {
    res.send(`------------ localhost serverside connected successfully ---------------- https://localhost:${process.env.PORT_NUMBER}`)
})


server.listen(process.env.PORT_NUMBER, () => {
    console.log(`------------ localhost connected successfully ---------------- https://localhost:${process.env.PORT_NUMBER}`)
})

// const express = require("express");
// const app = express();
// const mongoose = require("./Model/mongodb");
// const bodyParser = require("body-parser");
// const http = require('http');
// const cors = require("cors");
// require("dotenv").config();

// const driverRoutes = require("./Routes/driver.routes");
// const locationRoutes = require("./Routes/location.routes");

// const { initSocketIO } = require("./socketIo/socket"); // Ensure this is imported correctly

// // Create the server
// const server = http.createServer(app);

// // Initialize Socket.IO
// const io = initSocketIO(server);

// // CORS middleware to handle CORS for API requests
// app.use(cors({
//   origin: "http://localhost:3000", // Your React app's origin
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true, // If cookies or authorization tokens are used
// }));

// // Body parser middleware to handle JSON bodies
// app.use(bodyParser.json());
// app.use(express.json());

// // Routes for your API
// app.use("/api", driverRoutes);
// app.use("/api", locationRoutes);

// // Default route to test server connection
// app.get("/", (req, res) => {
//   res.send(`------------ localhost serverside connected successfully ---------------- https://localhost:${process.env.PORT_NUMBER}`);
// });

// // Start the server
// server.listen(process.env.PORT_NUMBER, () => {
//   console.log(`------------ localhost connected successfully ---------------- https://localhost:${process.env.PORT_NUMBER}`);
// });
