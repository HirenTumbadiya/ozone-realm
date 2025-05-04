import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import { GameMoveHandler } from "./game/gameRoomHandler";
import { GameRoomManager } from "./game/gameRoomManager";

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

io.use((socket: any, next) => {
  const mockUserId = `user_${Math.floor(Math.random() * 10000)}`;
  socket.user = { userId: mockUserId };
  next();
});

io.on("connection", (socket: any) => {
  socket.on("create_room", (roomId: string) => {
    gameRoomManager.createRoom(roomId, socket);
  });

  socket.on("join_room", (roomId: string) => {
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

  // socket.on("start_game", ({ roomId }: { roomId: string }) => {
  //   io.to(roomId).emit("start_game");
  // });
  // below code is to update the initial state wtih empty boxes

  socket.on("start_game", ({ roomId }: { roomId: string }) => {
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

  socket.on("game_move", (roomId: string, cellIndex: number) => {
    console.log(roomId, cellIndex);
    gameMoveHandler.handleMove(io, socket, roomId, cellIndex);
  });

  socket.on("disconnect", () => {
    gameRoomManager.removePlayer(socket);
    gameMoveHandler.cleanupRoomOfPlayer(socket.id); // Optional: implement this
  });
});

// Start the server
server.listen(8080, () => {
  console.log("WebSocket server running on http://localhost:8080");
});
