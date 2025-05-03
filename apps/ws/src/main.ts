import { Server } from "socket.io";
import http from "http";
import { verifyToken } from "@clerk/express";
import dotenv from "dotenv";
import { GameRoomManager } from "./game/gameRoomHandler";
import { GameMoveHandler } from "./game/gameRoomManager";
import { authenticateUser } from "./auth/authMiddleware";

// Load env variables
dotenv.config();

// Create HTTP server
const server = http.createServer();

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const gameRoomManager = new GameRoomManager();
const gameMoveHandler = new GameMoveHandler();

io.use(authenticateUser);

io.on("connection", (socket: any) => {
  console.log("A client connected!", socket.user?.userId);

  // Send a welcome message to the connected user
  socket.emit("message", "Welcome to the game server!");

  // Handle the user joining a game
  socket.on("join_game", () => {
    const roomId = gameRoomManager.joinRoom(socket);
    console.log(`${socket.user?.userId} joined room: ${roomId}`);
  });

  // Handle a player's move
  socket.on("game_move", (roomId: any, moveData: any) => {
    gameMoveHandler.handleMove(socket, roomId, moveData);
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log(`User ${socket.user?.userId} disconnected`);
    gameRoomManager.removePlayer(socket);
  });
});

// Start the server
server.listen(8080, () => {
  console.log("WebSocket server running on http://localhost:8080");
});
