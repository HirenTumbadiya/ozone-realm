type Player = {
  id: string;
  socket: any;
  userId: string;
};

export class GameRoomManager {
  private gameRooms: { [key: string]: Player[] } = {};

  createRoom(roomId: string, socket: any) {
    if (!this.gameRooms[roomId]) {
      this.gameRooms[roomId] = [];
    }
    const player: Player = {
      id: socket.id,
      socket,
      userId: socket.user?.userId || `user_${Math.floor(Math.random() * 1000)}`,
    };
    this.gameRooms[roomId].push(player);
    socket.join(roomId);
  }

  joinRoom(socket: any, roomId: string): Player[] | null {
    console.log(socket?.user, roomId);
    if (!this.gameRooms[roomId]) {
        this.gameRooms[roomId] = [];
        console.log(`Room ${roomId} auto-created on join`);
      }

      
    const room = this.gameRooms[roomId];
    console.log("room", room)
    if (room && room.length < 2) {
      const player: Player = {
        id: socket.id,
        socket,
        userId:
          socket.user?.userId || `user_${Math.floor(Math.random() * 1000)}`,
      };
      console.log(player, "roomplayer")
      room.push(player);
      socket.join(roomId);
      socket.emit("message", `Joined room: ${roomId}`);

      if (room.length === 2) {
        return room;
      }
    } else {
      socket.emit("message", "Room is full or does not exist");
    }
    return null;
  }

  removePlayer(socket: any) {
    for (const roomId in this.gameRooms) {
      const room = this.gameRooms[roomId];
      const index = room.findIndex((p) => p.id === socket.id);
      if (index !== -1) {
        room.splice(index, 1);
        if (room.length === 0) {
          delete this.gameRooms[roomId];
        }
        break;
      }
    }
  }
}
