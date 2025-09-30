import { Video, VideoOff, Mic, MicOff, User, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoFeedProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  title: string;
  userType: 'doctor' | 'patient';
  isLocal: boolean;
  isMuted?: boolean;
  isCameraOn?: boolean;
  showPostureAnalysis?: boolean;
  socket?: WebSocket | null;
  onToggleMute?: () => void;
  onToggleCamera?: () => void;
}

export default function VideoFeed({
  videoRef,
  title,
  userType,
  isLocal,
  isMuted = false,
  isCameraOn = true,
  showPostureAnalysis = false,
  socket,
  onToggleMute,
  onToggleCamera
}: VideoFeedProps) {
  const handlePoseData = (data: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'posture-data',
        data
      }));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`px-4 py-2 flex items-center justify-between text-white ${
        userType === 'doctor' ? 'bg-medical-blue' : 'bg-medical-teal'
      }`}>
        <div className="flex items-center space-x-2">
          {userType === 'doctor' ? (
            <UserCheck className="h-5 w-5" />
          ) : (
            <User className="h-5 w-5" />
          )}
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-sm">
            {isLocal ? 'You' : 'Online'}
          </span>
          {showPostureAnalysis && userType === 'patient' && (
            <span className="text-sm bg-black bg-opacity-20 px-2 py-1 rounded">
              Analyzing Posture
            </span>
          )}
        </div>
      </div>

      {/* Video Container */}
      <div className="relative aspect-video bg-gray-900">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted={isLocal}
          playsInline
        />

        {/* Pose Analysis Overlay - Placeholder for now */}
        {showPostureAnalysis && userType === 'patient' && !isLocal && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded-lg text-sm">
            <div className="space-y-1">
              <div>Posture Analysis Active</div>
              <div className="text-green-400">Tracking pose...</div>
            </div>
          </div>
        )}

        {/* Camera Off Overlay */}
        {!isCameraOn && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <div className="text-center text-white">
              <VideoOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm opacity-75">Camera is off</p>
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        {isLocal && (onToggleMute || onToggleCamera) && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 bg-black bg-opacity-50 rounded-full px-4 py-2">
            {onToggleMute && (
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:text-medical-teal transition-colors p-2"
                onClick={onToggleMute}
              >
                {isMuted ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
            )}
            {onToggleCamera && (
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:text-medical-teal transition-colors p-2"
                onClick={onToggleCamera}
              >
                {isCameraOn ? (
                  <Video className="h-5 w-5" />
                ) : (
                  <VideoOff className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
