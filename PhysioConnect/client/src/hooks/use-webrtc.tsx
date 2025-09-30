import { useState, useEffect, useRef, useCallback } from "react";
import { WebRTCManager } from "@/lib/webrtc";

export function useWebRTC(socket: WebSocket | null, sessionId: string) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const webrtcManager = useRef<WebRTCManager | null>(null);

  useEffect(() => {
    if (sessionId) {
      webrtcManager.current = new WebRTCManager(sessionId);
      
      webrtcManager.current.onLocalStream((stream) => {
        setLocalStream(stream);
      });
      
      webrtcManager.current.onRemoteStream((stream) => {
        setRemoteStream(stream);
      });

      // Initialize local stream
      webrtcManager.current.startLocalStream().catch(console.error);

      return () => {
        webrtcManager.current?.cleanup();
      };
    }
  }, [sessionId]);

  useEffect(() => {
    if (socket && webrtcManager.current) {
      webrtcManager.current.setSocket(socket);
    }
  }, [socket]);

  const toggleAudio = () => {
    if (webrtcManager.current) {
      const enabled = webrtcManager.current.toggleAudio();
      setIsAudioMuted(!enabled);
    }
  };

  const toggleVideo = () => {
    if (webrtcManager.current) {
      const enabled = webrtcManager.current.toggleVideo();
      setIsVideoMuted(!enabled);
    }
  };

  const initiateCall = useCallback(() => {
    webrtcManager.current?.createOffer();
  }, []);

  return {
    localStream,
    remoteStream,
    isAudioMuted,
    isVideoMuted,
    toggleAudio,
    toggleVideo,
    initiateCall
  };
}
