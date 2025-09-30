import { Mic, MicOff, Video, VideoOff, Monitor } from "lucide-react";

interface VideoControlsProps {
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onShareScreen?: () => void;
}

export default function VideoControls({ 
  isAudioMuted, 
  isVideoMuted, 
  onToggleAudio, 
  onToggleVideo,
  onShareScreen 
}: VideoControlsProps) {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 bg-black bg-opacity-50 rounded-full px-4 py-2">
      <button
        onClick={onToggleAudio}
        className="text-white hover:text-medical-teal transition-colors"
        title={isAudioMuted ? "Unmute" : "Mute"}
      >
        {isAudioMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </button>
      
      <button
        onClick={onToggleVideo}
        className="text-white hover:text-medical-teal transition-colors"
        title={isVideoMuted ? "Turn on camera" : "Turn off camera"}
      >
        {isVideoMuted ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
      </button>
      
      {onShareScreen && (
        <button
          onClick={onShareScreen}
          className="text-white hover:text-medical-teal transition-colors"
          title="Share Screen"
        >
          <Monitor className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
