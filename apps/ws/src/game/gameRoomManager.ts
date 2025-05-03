import { Socket } from "socket.io";

interface MoveData {
  [key: string]: any;
}

export class GameMoveHandler {
  // Handle a player's move and broadcast to other players
  public handleMove(socket: Socket, roomId: string, moveData: MoveData): void {
    console.log(`Move received in room ${roomId}:`, moveData);
    socket.to(roomId).emit("game_move", moveData);  // Broadcast to other players
  }
}
