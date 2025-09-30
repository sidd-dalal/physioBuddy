import { useState, useEffect, useRef } from "react";
import { MediapipeManager, type PostureData } from "@/lib/mediapipe";

export function useMediapipe(videoStream: MediaStream | null) {
  const [postureData, setPostureData] = useState<PostureData | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const mediapipeManager = useRef<MediapipeManager | null>(null);

  useEffect(() => {
    mediapipeManager.current = new MediapipeManager();
    
    mediapipeManager.current.onResults((results) => {
      setPostureData(results);
    });

    return () => {
      mediapipeManager.current?.cleanup();
    };
  }, []);

  const startPoseDetection = async () => {
    if (videoStream && mediapipeManager.current && !isDetecting) {
      try {
        await mediapipeManager.current.startDetection(videoStream);
        setIsDetecting(true);
      } catch (error) {
        console.error('Failed to start pose detection:', error);
      }
    }
  };

  const stopPoseDetection = () => {
    if (mediapipeManager.current && isDetecting) {
      mediapipeManager.current.stopDetection();
      setIsDetecting(false);
      setPostureData(null);
    }
  };

  // Auto-start detection when video stream is available
  useEffect(() => {
    if (videoStream && !isDetecting) {
      startPoseDetection();
    }
  }, [videoStream, isDetecting]);

  return {
    postureData,
    isDetecting,
    startPoseDetection,
    stopPoseDetection
  };
}
