import { Server } from "socket.io";
import express from "express";
import http from "http";
import dotenv from "dotenv";
import { GameMoveHandler } from "./game/gameRoomHandler";
import { GameRoomManager } from "./game/gameRoomManager";

const cors = require('cors');

interface SignalData {
  sdp: RTCSessionDescriptionInit;
}

interface IceCandidateData {
  candidate: RTCIceCandidateInit;
}

type RoomId = string;
const allowedOrigins = [
  "http://localhost:3000",
  "https://ozone-realm-ui.vercel.app",
];

// Load env variables
dotenv.config();

const app = express();

// Enable CORS for your frontend's domain
app.use(
  cors({
    origin: "https://ozone-realm-ui.vercel.app",
    credentials: true,
  })
);

const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("WebSocket server running");
});

const PORT = process.env.PORT || 8080;

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  },
});

const gameRoomManager = new GameRoomManager();
const gameMoveHandler = new GameMoveHandler();

io.use((socket: any, next) => {
  const mockUserId = `user_${Math.floor(Math.random() * 10000)}`;
  socket.user = { userId: mockUserId };
  next();
});

io.on("connection", (socket: any) => {
  socket.on("create_room", (roomId: RoomId) => {
    gameRoomManager.createRoom(roomId, socket);
  });

  socket.on("join_room", (roomId: RoomId) => {
    const players = gameRoomManager.joinRoom(socket, roomId);

    if (players && players.length === 2) {
      io.to(roomId).emit("opponent_connected");
      gameMoveHandler.initializeGame(
        roomId,
        players.map((player) => player.id)
      );
      io.to(roomId).emit("message", "Game ready to start!");
    }
  });

  socket.on("start_game", ({ roomId }: { roomId: RoomId }) => {
    const room = gameRoomManager.getRoom(roomId);
    if (!room || room.length !== 2) return;
    const [player1, player2] = room;

    const startingPlayerSymbol = Math.random() < 0.5 ? "X" : "O";
    const otherPlayerSymbol = startingPlayerSymbol === "X" ? "O" : "X";

    const playerAssignments = {
      [player1.id]: startingPlayerSymbol,
      [player2.id]: otherPlayerSymbol,
    };
    const startingPlayerId =
      startingPlayerSymbol === "X" ? player1.id : player2.id;

    const initialGameState = {
      board: Array(3)
        .fill("")
        .map(() => Array(3).fill("")),
      playerTurn: startingPlayerId,
      winner: null,
      players: playerAssignments,
    };
    io.to(roomId).emit("start_game", initialGameState);
  });

  socket.on("game_move", (roomId: RoomId, cellIndex: number) => {
    gameMoveHandler.handleMove(io, socket, roomId, cellIndex);
  });

  socket.on("offer", (offer: SignalData, roomId: RoomId) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", (answer: SignalData, roomId: RoomId) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", (candidate: IceCandidateData, roomId: RoomId) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });

  socket.on("start-call", (roomId: RoomId, callerInfo: any) => {
    socket.to(roomId).emit("incoming-call", callerInfo);
  });

  socket.on("end_call", (roomId: RoomId) => {
    socket.to(roomId).emit("end_call");
  });

  socket.on("disconnect", () => {
    gameRoomManager.removePlayer(socket);
    gameMoveHandler.cleanupRoomOfPlayer(socket.id); // Optional: implement this
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`WebSocket server running on ${PORT}`);
});
