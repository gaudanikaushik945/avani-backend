const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Driver = require("../Model/driver");
require("dotenv").config()

let io;

function initSocketIO(server) {
  io = new Server(server, { 
    path:"/socket",addTrailingSlash: false,
    cors:{
      origin:"*"
    }
  }); // Ensure CORS settings match your requirements

  // Middleware for Socket.IO authentication
  io.use(async (socket, next) => {
    try {
      console.log("Handshake Headers------------------->",socket.handshake.headers["authorization"].split("")[1])

      const authHeader = socket.handshake.headers["authorization"];
      console.log("Authorization Header ++++++++", authHeader)
  
     
      
      // if (!token) throw new Error("Unauthorized: Token not provided");
  
      const decoded = jwt.verify(authHeader, "process.env.JWT_SECRET");
      console.log("------------ decoded -----------------", decoded)
      
      socket.driverId = decoded.driverId;
      next();
    } catch (error) {
      console.error("Authentication error:", error.message);
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", async (socket) => {

    console.log("A new driver connected:", socket.driverId);

    const socketId = socket.id;
    try {
      // Find and update the driver's socket ID
      const driver = await Driver.findById(socket.driverId);
      if (!driver) {
        console.error("Driver not found:", socket.driverId);
        socket.disconnect(true);
        return;
      }

      driver.socket_id = socketId;
      await driver.save();
      console.log("Driver socket ID updated:", driver);

   

      // Handle update-location event
      socket.on("update-location", async (data) => {
        console.log("Received location update:", data);

        try {
          const updatedDriver = await Driver.findByIdAndUpdate(
            socket.driverId,
            { "location.latitude": data.latitude, "location.longitude": data.longitude },
            { new: true }
          );
          console.log("Driver location updated:", updatedDriver);
        } catch (error) {
          console.error("Error updating driver location:", error.message);
        }
      });
    } catch (error) {
      console.error("Connection setup error:", error.message);
      socket.disconnect(true);
    }

    socket.on("disconnect", () => {
      console.log("Driver disconnected:", socket.driverId);
    });
  });
}

module.exports = { initSocketIO, io };











   // Handle addLocation event
      // socket.on("addLocation", async (data) => {
      //   console.log("Received location data:", data);

      //   // Validate latitude and longitude
      //   if (!data || data.latitude < -90 || data.latitude > 90 || data.longitude < -180 || data.longitude > 180) {
      //     socket.emit("error", "Invalid latitude or longitude values");
      //     return;
      //   }

      //   try {
      //     const response = await Driver.findByIdAndUpdate(
      //       socket.driverId,
      //       { "location.latitude": data.latitude, "location.longitude": data.longitude },
      //       { new: true } // Return updated document
      //     );
      //     console.log("Location updated:", response);

      //     // Notify all connected clients of the location update
      //     io.emit("locationUpdate", response);
      //   } catch (error) {
      //     console.error("Error updating location:", error.message);
      //     socket.emit("error", "Failed to update location");
      //   }
      // });