const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const locationController = require("../Controller/location");

let io; // Declare io globally
const cors = require("cors");

function initSocketIO(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Allow your React client to connect
      methods: ["GET", "POST"],  // Allowed HTTP methods
      allowedHeaders: ["my-custom-header"], // Optional: allow custom headers
      credentials: true // Optional: allow credentials like cookies or authorization headers
    }
  });

  // Middleware for JWT authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token; // Token passed during the handshake
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { // Use your secret key here (environment variable recommended)
        if (err) {
          console.error('JWT Verification failed:', err);
          return next(new Error('Authentication error'));
        }
        socket.user = decoded; // Store decoded user data on the socket
        next();
      });
    } else {
      next(new Error('Authentication error'));
    }
  });

  // Handle location updates and other events
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle location sending from clients
    socket.on('send-location', async (locationData) => {
      try {
        // Example validation (latitude and longitude)
        if (locationData.latitude < -90 || locationData.latitude > 90 || locationData.longitude < -180 || locationData.longitude > 180) {
          socket.emit('error', { message: 'Invalid latitude or longitude values' });
          return;
        }

        // Example of adding location data to a database
        const response = await locationController.addLocation(locationData);
        if (response.success) {
          io.emit("locationUpdate", response.data);  // Emit location update to all clients
        } else {
          socket.emit("error", { message: response.message });
        }
      } catch (error) {
        console.error('Error handling location:', error);
        socket.emit('error', { message: 'An error occurred while processing the location' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
}

module.exports = { initSocketIO, io };
