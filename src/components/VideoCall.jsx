import React,{ useEffect, useRef, useState, useCallback } from "react";
import io from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_VIDEO_CALL_BACKEND_URL || "http://localhost:5000";

const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

const VideoPlayer = React.memo(({ stream, isLocal, socketId }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const label = isLocal ? `You (${socketId || 'local'})` : `User (${socketId})`;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-white shadow-lg">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal} // Mute local video to prevent feedback
        className="h-full w-full object-cover"
      />
      <div className="absolute bottom-0 left-0 rounded-tr-lg bg-white/50 px-2 py-1 text-xs font-medium text-white">
        {label}
      </div>
    </div>
  );
});

const GroupVideoCall = ({ initialRoomId,setIsInComming, onClose }) => {
  // --- State ---
  const [roomId, setRoomId] = useState(initialRoomId || "");
  const [inCall, setInCall] = useState(false);
  const [mySocketId, setMySocketId] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  
  const [streams, setStreams] = useState([]); 
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  
  const peerConnectionsRef = useRef(new Map());

  // --- Helper: Close a single peer connection ---
  const closePeerConnection = useCallback((socketId) => {
    const pc = peerConnectionsRef.current.get(socketId);
    if (pc) {
      pc.close();
      peerConnectionsRef.current.delete(socketId);
    }
  }, []);

  // --- Main Hang-up/Cleanup Function ---
  const handleEndCall = useCallback(() => {
    console.log("Ending call...");
    
    // 1. Close all peer connections
    peerConnectionsRef.current.forEach((pc) => pc.close());
    peerConnectionsRef.current.clear();

    // 2. Stop local media tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    // 3. Disconnect from socket
    if (socketRef.current) {
      socketRef.current.emit("hang-up"); // Tell server we are leaving
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // 4. Reset state
    setStreams([]);
    setInCall(false);
    setMySocketId("");
    setIsMuted(false);
    setIsVideoOn(true);
    
    if (onClose) onClose();
  }, [onClose]);

  // --- Main Call Logic ---
  useEffect(() => {
    // This effect runs when `inCall` becomes true
    if (!inCall || !roomId) return;

    let isMounted = true; // Flag to prevent state updates on unmounted component

    // Helper to create a new Peer Connection
    const createPeerConnection = (targetSocketId, isOfferor) => {
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      
      // Add local tracks to the connection
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });

      // Handle incoming tracks from the remote peer
      pc.ontrack = (event) => {
        if (!isMounted) return;
        console.log(`Received track from ${targetSocketId}`);
        // Add the remote stream to our state
        setStreams((prev) => [
          ...prev.filter((s) => s.id !== targetSocketId),
          { id: targetSocketId, stream: event.streams[0], isLocal: false },
        ]);
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit("webrtc-candidate", {
            candidate: event.candidate,
            targetSocketId,
          });
        }
      };

      // Store the connection
      peerConnectionsRef.current.set(targetSocketId, pc);
      console.log(`Created PC for ${targetSocketId}`);
      return pc;
    };

    // --- Main Async Function to Start Call ---
    const startCall = async () => {
      try {
        // 1. Get local media
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!isMounted) return;
        localStreamRef.current = stream;
        
        // Add local stream to state
        setStreams([{ id: "local", stream, isLocal: true }]);

        // 2. Connect to socket server
        socketRef.current = io(SERVER_URL);
        const socket = socketRef.current;
        console.log("Connecting to socket server...",socket);

        // 3. Set up all socket listeners
        socket.on("connect", () => {
          if (isMounted) setMySocketId(socket.id);
        });

        // Fired when we first join: gives us a list of *existing* users
        socket.on("all-users", (allUserSocketIds) => {
          console.log("Got all users:", allUserSocketIds);
          allUserSocketIds.forEach((targetSocketId) => {
            const pc = createPeerConnection(targetSocketId, true); // true = isOfferor
            pc.createOffer()
              .then((offer) => pc.setLocalDescription(offer))
              .then(() => {
                socket.emit("webrtc-offer", {
                  offer: pc.localDescription,
                  targetSocketId,
                });
              })
              .catch((e) => console.error("Error creating offer:", e));
          });
        });

        // Fired when we receive an offer from a *new* user
        socket.on("webrtc-offer", async ({ offer, senderSocketId }) => {
          console.log(`Receiving offer from ${senderSocketId}`);
          const pc = createPeerConnection(senderSocketId, false); // false = isReceiver
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          
          socket.emit("webrtc-answer", {
            answer: pc.localDescription,
            targetSocketId: senderSocketId,
          });
        });

        // Fired when we get an answer back from a user we sent an offer to
        socket.on("webrtc-answer", async ({ answer, senderSocketId }) => {
          console.log(`Receiving answer from ${senderSocketId}`);
          const pc = peerConnectionsRef.current.get(senderSocketId);
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
          }
        });

        // Fired when we get an ICE candidate from any user
        socket.on("webrtc-candidate", async ({ candidate, senderSocketId }) => {
          const pc = peerConnectionsRef.current.get(senderSocketId);
          if (pc) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
              console.error("Error adding ICE candidate:", e);
            }
          }
        });

        // Fired when any user disconnects
        socket.on("user-disconnected", (disconnectedSocketId) => {
          console.log("User disconnected:", disconnectedSocketId);
          closePeerConnection(disconnectedSocketId);
          if (isMounted) {
            setStreams((prev) => prev.filter((s) => s.id !== disconnectedSocketId));
          }
        });

        // 4. Join the room
        socket.emit("join-room", roomId);

      } catch (error) {
        console.error("Error starting call:", error);
        handleEndCall(); // Cleanup on failure
      }
    };

    startCall();

    // --- Effect Cleanup ---
    return () => {
      isMounted = false;
      handleEndCall();
    };
  }, [inCall, roomId, handleEndCall, closePeerConnection]);

  // --- Button Click Handlers ---
  const handleJoin = () => {
    if (roomId.trim()) {
      setIsInComming(false);
      setInCall(true);
    }
  };

  const toggleMute = () => {
    if (!localStreamRef.current) return;
    const enabled = !isMuted;
    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });
    setIsMuted(!enabled);
  };

  const toggleVideo = () => {
    if (!localStreamRef.current) return;
    const enabled = !isVideoOn;
    localStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = enabled;
    });
    setIsVideoOn(!enabled);
  };

  // --- Render ---
  if (!inCall) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 ">
        <div className="w-full max-w-sm rounded-xl bg-white-800 p-6 shadow-lg">
          <h1 className="mb-4 text-center text-2xl font-bold text-white">
            Join Group Call
          </h1>
          <div className="space-y-4">
            <input
              id="room-id"
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleJoin}
              className="w-full rounded-lg bg-green-500 px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-green-600"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex h-full w-full flex-col bg-gray-800 text-white">
      {/* Header */}
      <div className="flex-shrink-0 bg-gray-900 p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Room: <span className="font-mono">{roomId}</span>
          </h2>
          <h2 className="hidden text-sm font-semibold capitalize sm:block">
            My ID: <span className="font-mono">{mySocketId}</span>
          </h2>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {streams.map(({ id, stream, isLocal }) => (
            <VideoPlayer
              key={id}
              socketId={id}
              stream={stream}
              isLocal={isLocal}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex-shrink-0 justify-center space-x-3 bg-gray-900 p-4">
        <button
          onClick={toggleMute}
          className={`rounded-lg px-4 py-2 font-semibold text-white transition-all duration-200 ${
            isMuted ? "bg-red-500 hover:bg-red-600" : "bg-gray-600 hover:bg-gray-700"
          }`}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
        <button
          onClick={toggleVideo}
          className={`rounded-lg px-4 py-2 font-semibold text-white transition-all duration-200 ${
            !isVideoOn ? "bg-red-500 hover:bg-red-600" : "bg-gray-600 hover:bg-gray-700"
          }`}
        >
          {isVideoOn ? "Stop Video" : "Start Video"}
        </button>
        <button
          onClick={handleEndCall}
          className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-red-600"
        >
          End Call
        </button>
      </div>
    </div>
  );
};

export default GroupVideoCall;