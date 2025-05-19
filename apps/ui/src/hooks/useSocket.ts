// useSocket.ts
import { useEffect, useState } from "react";
import { getSocket } from "@/libs/socket";
import { useAuth } from "@clerk/nextjs";

export function useSocket() {
  const { getToken } = useAuth();
  const [socket, setSocket] = useState<ReturnType<typeof getSocket> | null>(null);

  useEffect(() => {
    const setup = async () => {
      const token = await getToken();
      if (!token) return;

      const s = getSocket({token});
      if (!s) return;

      s.connect();

      s.on("message", (msg: string) => {
        console.log("Server says:", msg);
      });

      setSocket(s);

      return () => {
        s.disconnect();
      };
    };

    setup();
  }, [getToken]);

  return socket;
}
