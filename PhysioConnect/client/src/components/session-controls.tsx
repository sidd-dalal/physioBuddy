import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  Camera, 
  Share, 
  StickyNote, 
  Settings, 
  Download,
  FileText,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SessionControlsProps {
  sessionId: string;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  onCapturePosture?: () => void;
  onShareExercise?: () => void;
  onOpenNotes?: () => void;
  isRecording?: boolean;
}

export default function SessionControls({
  sessionId,
  onStartRecording,
  onStopRecording,
  onCapturePosture,
  onShareExercise,
  onOpenNotes,
  isRecording = false
}: SessionControlsProps) {
  const [recordingDuration, setRecordingDuration] = useState(0);
  const { toast } = useToast();

  const handleRecordingToggle = () => {
    if (isRecording) {
      onStopRecording?.();
      toast({
        title: "Recording Stopped",
        description: `Session recording saved (${Math.floor(recordingDuration / 60)}:${(recordingDuration % 60).toString().padStart(2, '0')})`,
      });
      setRecordingDuration(0);
    } else {
      onStartRecording?.();
      toast({
        title: "Recording Started",
        description: "Session recording has begun",
      });
      // Start duration counter
      const interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      // Clean up interval when recording stops
      setTimeout(() => clearInterval(interval), 300000); // 5 min max for demo
    }
  };

  const handleCapturePosture = () => {
    onCapturePosture?.();
    toast({
      title: "Posture Captured",
      description: "Current posture analysis has been saved to session notes",
    });
  };

  const handleShareExercise = () => {
    onShareExercise?.();
    toast({
      title: "Exercise Shared",
      description: "Exercise instructions sent to patient",
    });
  };

  const handleOpenNotes = () => {
    onOpenNotes?.();
    toast({
      title: "Session Notes",
      description: "Opening session documentation",
    });
  };

  const handleDownloadReport = () => {
    toast({
      title: "Generating Report",
      description: "Session report is being prepared for download",
    });
  };

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-medical-dark mb-4 flex items-center">
        <Settings className="w-5 h-5 mr-2 text-medical-blue" />
        Session Tools
      </h3>
      
      <div className="space-y-3">
        {/* Recording Control */}
        <Button
          onClick={handleRecordingToggle}
          className={`w-full flex items-center justify-between p-3 border rounded-lg transition-colors ${
            isRecording 
              ? 'bg-red-50 border-red-200 hover:bg-red-100' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
          variant="ghost"
        >
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isRecording ? 'bg-red-100' : 'bg-red-100'
            }`}>
              <Video className={`w-4 h-4 ${isRecording ? 'text-red-600' : 'text-red-600'}`} />
            </div>
            <div className="text-left">
              <span className="text-sm font-medium block">
                {isRecording ? 'Stop Recording' : 'Record Session'}
              </span>
              {isRecording && (
                <span className="text-xs text-red-600">
                  {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isRecording && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
        </Button>

        {/* Capture Posture */}
        <Button
          onClick={handleCapturePosture}
          className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          variant="ghost"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Camera className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium">Capture Posture</span>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
          </svg>
        </Button>

        {/* Share Exercise */}
        <Button
          onClick={handleShareExercise}
          className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          variant="ghost"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Share className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm font-medium">Share Exercise</span>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
          </svg>
        </Button>

        {/* Session Notes */}
        <Button
          onClick={handleOpenNotes}
          className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          variant="ghost"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <StickyNote className="w-4 h-4 text-yellow-600" />
            </div>
            <span className="text-sm font-medium">Session Notes</span>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
          </svg>
        </Button>

        {/* Download Report */}
        <Button
          onClick={handleDownloadReport}
          className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          variant="ghost"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Download className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-sm font-medium">Download Report</span>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
          </svg>
        </Button>
      </div>

      {/* Session Progress */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-medical-dark mb-4 flex items-center">
          <Activity className="w-4 h-4 mr-2 text-medical-blue" />
          Session Progress
        </h4>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Exercises Completed</span>
              <span className="font-medium">3/5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-medical-teal h-2 rounded-full transition-all duration-300" style={{ width: '60%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Posture Score</span>
              <span className="font-medium text-green-600">8.2/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: '82%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Session Goals</span>
              <span className="font-medium">2/3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-medical-blue h-2 rounded-full transition-all duration-300" style={{ width: '67%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
