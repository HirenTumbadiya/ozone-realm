"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import GameBoard from "@/components/Games/GameBoard";
import io from "socket.io-client";
import { Socket } from "socket.io-client";
import { toast } from "react-toastify";

let socket: Socket;

enum CellState {
  EMPTY = "",
  X = "X",
  O = "O",
}

enum CallState {
  IDLE = "IDLE",
  RINGING = "RINGING",
  IN_CALL = "IN_CALL",
}

export default function Page() {
  const { roomId } = useParams();
  const [opponentConnected, setOpponentConnected] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callState, setCallState] = useState<CallState>(CallState.IDLE);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [incomingOffer, setIncomingOffer] =
    useState<RTCSessionDescriptionInit | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  interface GameState {
    playerTurn: string;
    board: CellState[][];
    winner?: string;
    players: { [socketId: string]: "X" | "O" };
  }

  const [gameState, setGameState] = useState<GameState>({
    board: Array.from({ length: 3 }, () => Array(3).fill(CellState.EMPTY)),
    playerTurn: "X",
    winner: undefined,
    players: {},
  });

  console.log(remoteStream)

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

      socket.on("game_over", () => {
        setGameStarted(false);
      });

      socket.on("offer", handleOffer);
      socket.on("answer", handleAnswer);
      socket.on("ice-candidate", handleIceCandidate);

      socket.on("end_call", () => {
        peerConnectionRef.current?.close();
        peerConnectionRef.current = null;

        if (localStream) {
          localStream.getTracks().forEach((track) => track.stop());
          setLocalStream(null);
        }

        setRemoteStream(null);
        setIsCalling(false);
        setCallState(CallState.IDLE);
        toast("Call ended by the other user");
      });

      // ⬇️ CLEANUP
      return () => {
        socket.off("opponent_connected");
        socket.off("start_game");
        socket.off("game_update");
        socket.off("game_over");
        socket.off("offer");
        socket.off("answer");
        socket.off("ice-candidate");
        socket.off("end_call");
        socket.disconnect();
      };
    }
  }, [roomId, localStream]);

  const handleStartGame = () => {
    if (socket && opponentConnected) {
      socket.emit("start_game", { roomId });
    }
  };

  const handlePlayerMove = (row: number, col: number) => {
    const index = row * 3 + col; // Convert to 1D index
    socket.emit("game_move", roomId, index);
  };

  useEffect(() => {
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

  const handleOffer = (offer: RTCSessionDescriptionInit) => {
    setIncomingOffer(offer);
    setCallState(CallState.RINGING); // Set the state to RINGING when an offer is received
  };

  const handleAnswer = (answer: RTCSessionDescriptionInit) => {
    const peerConnection = peerConnectionRef.current;
    if (peerConnection) {
      peerConnection.setRemoteDescription(answer);
      setCallState(CallState.IN_CALL); // Update the state to IN_CALL after answer
    }
  };

  const handleIceCandidate = (candidate: RTCIceCandidate) => {
    const peerConnection = peerConnectionRef.current;
    if (peerConnection) {
      peerConnection.addIceCandidate(candidate);
    }
  };

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
      toast.error(
        "Unable to access your camera or microphone. Please check permissions."
      );
    }
  };

  const startCall = async () => {
    if (!localStream) {
      await getMedia();
    }

    if (!localStream) {
      toast.error("No video stream available!, Please Try again.");
      return;
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

    // Add local tracks
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream!);
    });

    peerConnection.createOffer().then((offer) => {
      peerConnection.setLocalDescription(offer);
      socket.emit("offer", offer, roomId);
      setCallState(CallState.IN_CALL); // Set call state to IN_CALL
    });

    setIsCalling(true);
  };
  const endCall = () => {
    // Close the peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Stop local media tracks
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    // Clean up remote stream
    setRemoteStream(null);

    // Reset call states
    setIsCalling(false);
    setCallState(CallState.IDLE);

    // Notify the other peer
    socket.emit("end_call", roomId);

    toast("Call ended successfully");
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        const newMutedState = !audioTrack.enabled;
        audioTrack.enabled = newMutedState;
        setIsMuted(!newMutedState);
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
    setCallState(CallState.IN_CALL);
    setIsCalling(true);
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
          <span className="absolute w-full h-full text-white text-xs">
            <video
              className="w-full h-full object-cover rounded-md"
              ref={remoteVideoRef}
              autoPlay
              playsInline
            />
          </span>
          <span className="absolute bottom-1 left-2 text-white text-xs flex justify-between">
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
          <span className="absolute w-full h-full text-white text-xs">
            <video
              className="w-full h-full object-cover rounded-md"
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
            />
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
          {callState === CallState.IDLE && !isCalling && (
            <button
              onClick={startCall}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl shadow-lg transition duration-300 ease-in-out"
            >
              📞 Start Call
            </button>
          )}
          {callState === CallState.IN_CALL && (
            <button
              onClick={endCall}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl shadow-lg transition duration-300 ease-in-out"
            >
              🔴 End Call
            </button>
          )}
          {callState === CallState.RINGING && (
            <button
              onClick={() => handleReceiveCall(incomingOffer!)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg transition duration-300 ease-in-out"
            >
              📞 Receive Call
            </button>
          )}
        </div>
        {isCalling && (
          <button
            onClick={toggleMute}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-700 text-white font-semibold rounded-2xl shadow-lg transition duration-300 ease-in-out"
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>
        )}
      </footer>
    </section>
  );
}
