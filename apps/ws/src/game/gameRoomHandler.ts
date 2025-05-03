import { Socket } from "socket.io";

interface GameRooms {
  [key: string]: string[];
}

export class GameRoomManager {
  private gameRooms: GameRooms;

  constructor() {
    this.gameRooms = {};
  }

  // Try to join an existing room or create a new one
  public joinRoom(socket: Socket): string {
    let assignedRoom = this.findAvailableRoom();

    if (assignedRoom) {
      this.addPlayerToRoom(assignedRoom, socket);
      return assignedRoom;
    } else {
      const newRoomId = this.createNewRoom(socket);
      return newRoomId;
    }
  }

  private findAvailableRoom(): string | null {
    for (let roomId in this.gameRooms) {
      if (this.gameRooms[roomId].length < 2) {
        return roomId;
      }
    }
    return null;
  }

  // Add a player to a specific room
  private addPlayerToRoom(roomId: string, socket: Socket): void {
    this.gameRooms[roomId].push(socket.id);
    socket.join(roomId);
  }

  // Create a new room and add the player
  private createNewRoom(socket: Socket): string {
    const newRoomId = `room_${Date.now()}`;
    this.gameRooms[newRoomId] = [socket.id];
    socket.join(newRoomId);
    return newRoomId;
  }

  // Remove a player from a room when they disconnect
  public removePlayer(socket: Socket): void {
    for (let roomId in this.gameRooms) {
      const roomPlayers = this.gameRooms[roomId];
      const index = roomPlayers.indexOf(socket.id);

      if (index !== -1) {
        roomPlayers.splice(index, 1);
        if (roomPlayers.length === 0) {
          delete this.gameRooms[roomId];
        }
        break;
      }
    }
  }
}
