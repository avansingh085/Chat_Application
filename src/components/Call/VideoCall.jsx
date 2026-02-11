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
        muted={isLocal} 
        className="h-full w-full object-cover"
      />
      <div className="absolute bottom-0 left-0 rounded-tr-lg bg-white/50 px-2 py-1 text-xs font-medium text-white">
        {label}
      </div>
    </div>
  );
});

const GroupVideoCall = ({ initialRoomId,setIsInComming, onClose }) => {
  
  const [roomId, setRoomId] = useState(initialRoomId || "");
  const [inCall, setInCall] = useState(false);
  const [mySocketId, setMySocketId] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  
  const [streams, setStreams] = useState([]); 
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  
  const peerConnectionsRef = useRef(new Map());

  
  const closePeerConnection = useCallback((socketId) => {
    const pc = peerConnectionsRef.current.get(socketId);
    if (pc) {
      pc.close();
      peerConnectionsRef.current.delete(socketId);
    }
  }, []);

  
  const handleEndCall = useCallback(() => {
    console.log("Ending call...");
    
  
    peerConnectionsRef.current.forEach((pc) => pc.close());
    peerConnectionsRef.current.clear();

  
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    
    if (socketRef.current) {
      socketRef.current.emit("hang-up"); 
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    
    setStreams([]);
    setInCall(false);
    setMySocketId("");
    setIsMuted(false);
    setIsVideoOn(true);
    
    if (onClose) onClose();
  }, [onClose]);

  
  useEffect(() => {
    
    if (!inCall || !roomId) return;

    let isMounted = true; 

    const createPeerConnection = (targetSocketId, isOfferor) => {
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
     
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });

      pc.ontrack = (event) => {
        if (!isMounted) return;
        console.log(`Received track from ${targetSocketId}`);
       
        setStreams((prev) => [
          ...prev.filter((s) => s.id !== targetSocketId),
          { id: targetSocketId, stream: event.streams[0], isLocal: false },
        ]);
      };

    
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit("webrtc-candidate", {
            candidate: event.candidate,
            targetSocketId,
          });
        }
      };

      peerConnectionsRef.current.set(targetSocketId, pc);
      console.log(`Created PC for ${targetSocketId}`);
      return pc;
    };

 
    const startCall = async () => {
      try {
       
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!isMounted) return;
        localStreamRef.current = stream;
  
        setStreams([{ id: "local", stream, isLocal: true }]);

        socketRef.current = io(SERVER_URL);
        const socket = socketRef.current;
        console.log("Connecting to socket server...",socket);

        socket.on("connect", () => {
          if (isMounted) setMySocketId(socket.id);
        });

      
        socket.on("all-users", (allUserSocketIds) => {
          console.log("Got all users:", allUserSocketIds);
          allUserSocketIds.forEach((targetSocketId) => {
            const pc = createPeerConnection(targetSocketId, true); 
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

        socket.on("webrtc-offer", async ({ offer, senderSocketId }) => {
          console.log(`Receiving offer from ${senderSocketId}`);
          const pc = createPeerConnection(senderSocketId, false); 
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          
          socket.emit("webrtc-answer", {
            answer: pc.localDescription,
            targetSocketId: senderSocketId,
          });
        });

        socket.on("webrtc-answer", async ({ answer, senderSocketId }) => {
          console.log(`Receiving answer from ${senderSocketId}`);
          const pc = peerConnectionsRef.current.get(senderSocketId);
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
          }
        });

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

        socket.on("user-disconnected", (disconnectedSocketId) => {
          console.log("User disconnected:", disconnectedSocketId);
          closePeerConnection(disconnectedSocketId);
          if (isMounted) {
            setStreams((prev) => prev.filter((s) => s.id !== disconnectedSocketId));
          }
        });

        socket.emit("join-room", roomId);

      } catch (error) {
        console.error("Error starting call:", error);
        handleEndCall(); 
      }
    };

    startCall();

    return () => {
      isMounted = false;
      handleEndCall();
    };
  }, [inCall, roomId, handleEndCall, closePeerConnection]);

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