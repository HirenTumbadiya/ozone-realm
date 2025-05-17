"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import GameBoard from "@/components/Games/GameBoard";
import io from "socket.io-client";

import { Socket } from "socket.io-client";

let socket: Socket;

enum CellState {
  EMPTY = "",
  X = "X",
  O = "O",
}

export default function Page() {
  const { roomId } = useParams();
  const [opponentConnected, setOpponentConnected] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [incomingOffer, setIncomingOffer] =
    useState<RTCSessionDescriptionInit | null>(null);

  interface GameState {
    playerTurn: string;
    board: CellState[][];
    winner?: string;
    players: {
      [socketId: string]: "X" | "O";
    };
  }

  const [gameState, setGameState] = useState<GameState>({
    board: Array.from({ length: 3 }, () => Array(3).fill(CellState.EMPTY)),
    playerTurn: "X",
    winner: undefined,
    players: {},
  });

  useEffect(() => {
    if (roomId) {
      socket = io("http://localhost:8080");

      socket.on("connect", () => {
        socket.emit("join_room", roomId);
      });

      socket.on("opponent_connected", () => {
        setOpponentConnected(true);
      });

      socket.on("start_game", (initialGameState) => {
        setGameState(initialGameState);
        setGameStarted(true);
      });

      socket.on("game_update", (newGameState) => {
        setGameState(newGameState);
      });

      socket.on("game_over", (data) => {
        console.log("Game Over:", data);
        setGameStarted(false);
      });

      socket.on("offer", handleOffer);
      socket.on("answer", handleAnswer);
      socket.on("ice-candidate", handleIceCandidate);

      socket.on("offer", (offer: RTCSessionDescriptionInit) => {
        setIncomingOffer(offer);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [roomId]);

  const handleStartGame = () => {
    if (socket && opponentConnected) {
      socket.emit("start_game", { roomId });
    }
  };

  const handlePlayerMove = (row: number, col: number) => {
    const index = row * 3 + col; // Convert to 1D index
    socket.emit("game_move", roomId, index);
  };

  console.log(gameState, socket?.id);

  useEffect(() => {
    // Access media devices (camera and microphone)
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    getMedia();
  }, []);

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    const peerConnection = new RTCPeerConnection();
    peerConnectionRef.current = peerConnection;

    setIsCalling(true); // ✅ Add this to update buttons on receiver side

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", event.candidate, roomId);
      }
    };

    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setRemoteStream(event.streams[0]);
      }
    };

    localStream?.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream!);
    });

    await peerConnection.setRemoteDescription(offer);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit("answer", answer, roomId);
  };

  const handleAnswer = (answer: RTCSessionDescriptionInit) => {
    const peerConnection = peerConnectionRef.current;
    if (peerConnection) {
      peerConnection.setRemoteDescription(answer);
    }
  };

  const handleIceCandidate = (candidate: RTCIceCandidate) => {
    const peerConnection = peerConnectionRef.current;
    if (peerConnection) {
      peerConnection.addIceCandidate(candidate);
    }
  };

  const startCall = () => {
    const peerConnection = new RTCPeerConnection();
    peerConnectionRef.current = peerConnection;

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", event.candidate, roomId);
      }
    };

    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setRemoteStream(event.streams[0]);
      }
    };

    localStream?.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream!);
    });

    peerConnection.createOffer().then((offer) => {
      peerConnection.setLocalDescription(offer);
      socket.emit("offer", offer, roomId);
    });

    setIsCalling(true);
  };

  const endCall = () => {
    peerConnectionRef.current?.close();
    setRemoteStream(null);
    setLocalStream(null);
    setIsCalling(false);

    localStream?.getTracks().forEach((track) => track.stop());
    socket.emit("end_call", roomId); // Notify peer to cleanup
  };
  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  };

  const handleReceiveCall = async (offer: RTCSessionDescriptionInit) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    const peerConnection = new RTCPeerConnection();
    peerConnectionRef.current = peerConnection;

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", event.candidate, roomId);
      }
    };

    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setRemoteStream(event.streams[0]);
      }
    };

    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });

    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit("answer", answer, roomId);

    setIncomingOffer(null); // clear the offer
  };

  return (
    <section className="h-screen w-full grid grid-rows-[auto_1fr_auto] px-4 py-2">
      <header className="text-center">
        <h1 className="text-xl md:text-3xl font-bold text-indigo-800">
          OZONE-REALM
        </h1>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-items-center h-full">
        <div
          className={`w-full max-w-[200px] aspect-video bg-black rounded-md relative shadow-md ${gameStarted && socket?.id && socket?.id != gameState?.playerTurn ? `border-2 border-pink-700 animate-pulse` : ``}`}
        >
          <span className="absolute bottom-1 left-2 text-white text-xs">
            <video ref={remoteVideoRef} autoPlay playsInline />
          </span>
          <span className="absolute bottom-1 left-2 text-white text-xs flex justify-between">
            {" "}
            {opponentConnected ? "Opponent Connected" : "Waiting..."}
          </span>
        </div>
        <div className="w-full max-w-[250px] aspect-square flex items-center justify-center">
          {gameState && (
            <GameBoard
              gameState={gameState}
              gameStarted={gameStarted}
              onMove={handlePlayerMove}
              socketId={socket?.id}
            />
          )}
        </div>
        <div
          className={`w-full max-w-[200px] aspect-video bg-gray-800 rounded-md relative shadow-md ${gameStarted && socket?.id && socket?.id == gameState?.playerTurn ? `border-2 border-pink-700 animate-pulse` : ``}`}
        >
          <span className="absolute bottom-1 left-2 text-white text-xs">
            <video ref={localVideoRef} autoPlay muted playsInline />
          </span>
          <span className="absolute bottom-1 left-2 text-white text-xs flex justify-between">
            You
          </span>
        </div>
      </main>
      {gameState.winner && (
        <div className="flex justify-center gap-4 py-2 text-xl font-semibold text-indigo-700">
          <span>{gameState.winner} Wins!</span>
        </div>
      )}
      <footer className="flex justify-center gap-4 py-2">
        {!gameStarted && (
          <button
            onClick={handleStartGame}
            disabled={!opponentConnected}
            className={`px-4 py-2 rounded text-white transition ${
              opponentConnected
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Start Game
          </button>
        )}
        {gameStarted && (
          <button className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition">
            End
          </button>
        )}
        <div>
          {!isCalling ? (
            <button
              onClick={startCall}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl shadow-lg transition duration-300 ease-in-out"
            >
              📞 Start Call
            </button>
          ) : (
            <button
              onClick={endCall}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl shadow-lg transition duration-300 ease-in-out"
            >
              🔴 End Call
            </button>
          )}
        </div>
        {isCalling && (
          <button
            onClick={toggleMute}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-700 text-white font-semibold rounded-2xl shadow-lg transition duration-300 ease-in-out"
          >
            {localStream?.getAudioTracks()[0]?.enabled ? "Mute" : "Unmute"}
          </button>
        )}
        {incomingOffer && (
          <button onClick={() => handleReceiveCall(incomingOffer)}>
            Receive Call
          </button>
        )}
      </footer>
    </section>
  );
}
