import { Server, Socket } from "socket.io";

interface GameState {
  board: string[];
  currentPlayer: string;
  players: string[];
  isGameOver: boolean;
}

export class GameMoveHandler {
  private gameStates: Record<string, GameState> = {};

  initializeGame(roomId: string, players: string[]) {
    this.gameStates[roomId] = {
      board: Array(9).fill(""),
      currentPlayer: players[0],
      players,
      isGameOver: false,
    };
  }

  handleMove(io: Server, socket: Socket, roomId: string, cellIndex: number) {
    const game = this.gameStates[roomId];
    if (!game || game.isGameOver) return;

    const playerSymbol = this.getPlayerSymbol(game, socket.id);
    if (!playerSymbol) return;

    if (socket.id !== game.currentPlayer) {
      socket.emit("error", "Not your turn");
      return;
    }

    if (game.board[cellIndex] !== "") {
      socket.emit("error", "Cell already occupied");
      return;
    }

    // Apply move
    game.board[cellIndex] = playerSymbol;

    // Check for win or draw
    const winner = this.checkWinner(game.board);
    if (winner) {
      game.isGameOver = true;
      io.to(roomId).emit("game_over", { winner: playerSymbol });
    } else if (game.board.every((cell) => cell !== "")) {
      game.isGameOver = true;
      io.to(roomId).emit("game_over", { winner: null }); // Draw
    } else {
      // Switch turn
      game.currentPlayer = game.players.find((id) => id !== socket.id)!;
    }

    // Emit updated state
    io.to(roomId).emit("game_update", {
      board: game.board,
      currentPlayer: game.currentPlayer,
    });
  }

  private getPlayerSymbol(game: GameState, socketId: string): string | null {
    const index = game.players.indexOf(socketId);
    return index === 0 ? "X" : index === 1 ? "O" : null;
  }

  private checkWinner(board: string[]): string | null {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    for (const [a, b, c] of winPatterns) {
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        return board[a];
      }
    }

    return null;
  }

  cleanupRoom(roomId: string) {
    delete this.gameStates[roomId];
  }

  cleanupRoomOfPlayer(socketId: string) {
    for (const roomId in this.gameStates) {
      const game = this.gameStates[roomId];

      if (game.players.includes(socketId)) {
        delete this.gameStates[roomId];
        console.log(
          `Cleaned up game state for room: ${roomId} due to disconnect`
        );
        break;
      }
    }
  }
}
