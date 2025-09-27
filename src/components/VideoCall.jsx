import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import io from "socket.io-client";

const VideoCall = ({ roomId, userName = "User", profilePic = "https://via.placeholder.com/40" ,onClose}) => {
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const [callStatus, setCallStatus] = useState("initiating"); 

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    const initializeConnection = async () => {
      try {
        socketRef.current = io(import.meta.env.VITE_VIDEO_CALL_BACKEND_URL);
        setCallStatus("ringing");

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        localVideoRef.current.srcObject = stream;

        pcRef.current = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        stream.getTracks().forEach((track) => {
          pcRef.current.addTrack(track, stream);
        });

        pcRef.current.ontrack = (event) => {
          remoteVideoRef.current.srcObject = event.streams[0];
          setCallStatus("connected");
        };

        pcRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current.emit("candidate", {
              candidate: event.candidate,
              roomId,
            });
          }
        };

        socketRef.current.emit("join", roomId);

        socketRef.current.on("offer", async (offer) => {
          await pcRef.current.setRemoteDescription(offer);
          const answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);
          socketRef.current.emit("answer", { answer, roomId });
        });

        socketRef.current.on("answer", async (answer) => {
          await pcRef.current.setRemoteDescription(answer);
        });

        socketRef.current.on("candidate", async (candidate) => {
          try {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (e) {
            console.error("Error adding ICE candidate:", e);
          }
        });

        socketRef.current.on("offerNeeded", async () => {
          const offer = await pcRef.current.createOffer();
          await pcRef.current.setLocalDescription(offer);
          socketRef.current.emit("offer", { offer, roomId });
        });
      } catch (error) {
        console.error("Error initializing connection:", error);
        setCallStatus("ended");
      }
    };

    initializeConnection();

    return () => {
      if (pcRef.current) pcRef.current.close();
      if (socketRef.current) socketRef.current.disconnect();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [roomId]);

  const toggleMute = () => {
    const audioTracks = localVideoRef.current.srcObject.getAudioTracks();
    audioTracks.forEach((track) => (track.enabled = !track.enabled));
    setMuted(!muted);
  };

  const toggleVideo = () => {
    const videoTracks = localVideoRef.current.srcObject.getVideoTracks();
    videoTracks.forEach((track) => (track.enabled = !track.enabled));
    setVideoOn(!videoOn);
  };

  const handleEndCall = () => {
    if (pcRef.current) pcRef.current.close();
    if (socketRef.current) socketRef.current.disconnect();
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setCallStatus("ended");
    onClose();
  };

  const handleAcceptCall = () => {
    setCallStatus("connected");
  };

  return (
    <AnimatePresence>
      {!isHidden && (
        <motion.div
          className="fixed top-4 right-4 w-80 bg-gray-800 rounded-xl shadow-2xl pointer-events-auto overflow-hidden"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
         
          <div className="p-4 bg-gray-900 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="text-white font-semibold">{userName}</h3>
                <p className="text-gray-400 text-sm">
                  {callStatus === "ringing" ? "Calling..." : 
                   callStatus === "connected" ? "Connected" : 
                   callStatus === "ended" ? "Call Ended" : "Connecting..."}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsHidden(true)}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div className="relative bg-black">
            <motion.video
              ref={remoteVideoRef}
              autoPlay
              className="w-full h-48 object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.video
              ref={localVideoRef}
              autoPlay
              muted
              className="absolute bottom-2 right-2 w-24 h-16 bg-black rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="p-4 flex justify-between items-center bg-gray-900">
            {callStatus === "ringing" ? (
              <div className="flex space-x-2">
                <button
                  onClick={handleAcceptCall}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Accept
                </button>
                <button
                  onClick={handleEndCall}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Decline
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={toggleMute}
                  className={`px-4 py-2 rounded-lg ${muted ? "bg-red-500" : "bg-green-500"} text-white hover:opacity-90 transition`}
                >
                  {muted ? "Unmute" : "Mute"}
                </button>
                <button
                  onClick={toggleVideo}
                  className={`px-4 py-2 rounded-lg ${videoOn ? "bg-green-500" : "bg-red-500"} text-white hover:opacity-90 transition`}
                >
                  {videoOn ? "Stop Video" : "Start Video"}
                </button>
                <button
                  onClick={handleEndCall}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  End Call
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
      {isHidden && (
        <motion.div
          className="fixed top-4 right-4 bg-gray-800 rounded-full p-2 pointer-events-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={() => setIsHidden(false)}
            className="text-white flex items-center space-x-2"
          >
            <img src={profilePic} alt="Profile" className="w-8 h-8 rounded-full" />
            <span>{userName}</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoCall;