import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = ({ token }: { token: string }) => {
  if (!socket) {
    // socket = io(
    //   process.env.NEXT_PUBLIC_SOCKET_SERVER || "http://localhost:8080",
    //   {
    //     autoConnect: false,
    //   }
    // );

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

    if (!socketUrl) {
      console.error("Socket URL is not defined in the environment variables");
      return;
    }

    socket = io(socketUrl, {
      auth: { token },
      autoConnect: false,
    });
  }
  return socket;
};
