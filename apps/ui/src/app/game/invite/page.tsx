"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";

export default function InviteGame() {
  const router = useRouter();
  const [roomId, setRoomId] = useState<string | null>(null);

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const generatedRoomId = `room_${Date.now()}`;
    setRoomId(generatedRoomId);

    socket.emit("create_room", generatedRoomId);

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleCopyLink = () => {
    if (roomId) {
      navigator.clipboard.writeText(
        `${window.location.origin}/game/join/${roomId}`
      );
      alert("Invite link copied to clipboard!");
      router.push(`/game/invite/${roomId}`);
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col justify-center items-center max-w-md mx-auto p-6 text-center">
      <h2 className="text-2xl font-semibold mb-4">Invite a Friend</h2>
      <p className="text-sm mb-6">
        Share the link below with your friend to join the game.
      </p>
      {roomId && (
        <>
          <div className="mb-4">
            <p className="font-medium text-indigo-600 flex flex-wrap wrap-normal px-4" style={{overflowWrap: "anywhere"}}>
              {`${window.location.origin}/game/join/${roomId}`}
            </p>
          </div>
          <button
            onClick={handleCopyLink}
            className="px-6 py-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-500"
          >
            Copy Invite Link
          </button>
        </>
      )}
    </div>
  );
}
