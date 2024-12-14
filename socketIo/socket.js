const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Driver = require("../Model/driver");
require("dotenv").config();

let io;

function initSocketIO(server) {
  io = new Server(server, { 
    path: "/socket", 
    addTrailingSlash: false,
    cors: {
      origin: "*", // Update to specific origin if needed
      credentials: true,
    },
  });

  // Middleware for Socket.IO authentication
  io.use(async (socket, next) => {
    try {
      const authHeader = socket.handshake.headers["authorization"];
      if (!authHeader) {
        throw new Error("Unauthorized: Token not provided");
      }

      const token = authHeader.split(" ")[1]; // Correct parsing
      if (!token) {
        throw new Error("Unauthorized: Token is invalid");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use env variable correctly
      socket.driverId = decoded.driverId; // Attach driverId to the socket
      next();
    } catch (error) {
      console.error("Authentication error:", error.message);
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", async (socket) => {
    console.log("A new driver connected:", socket.driverId);

    try {
      const driver = await Driver.findById(socket.driverId);
      if (!driver) {
        console.error("Driver not found:", socket.driverId);
        socket.disconnect(true);
        return;
      }

      driver.socket_id = socket.id;
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
