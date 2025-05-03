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

    socket = io("http://localhost:8080", {
      auth: { token },
      autoConnect: false,
    });
  }
  return socket;
};
