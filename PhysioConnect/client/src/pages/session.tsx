import { useEffect, useState, useCallback } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import SessionHeader from "@/components/session-header";
import VideoControls from "@/components/video-controls";
import ChatBox from "@/components/chat-box";
import PostureOverlay from "@/components/posture-overlay";
import { Card } from "@/components/ui/card";
import { useWebRTC } from "@/hooks/use-webrtc";
import { useSocket } from "@/hooks/use-socket";
import { useMediapipe } from "@/hooks/use-mediapipe";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Session } from "@shared/schema";

export default function Session() {
  const [, params] = useRoute("/session/:sessionId");
  const sessionId = params?.sessionId || "";
  const isMobile = useIsMobile();
  const [userRole, setUserRole] = useState<'doctor' | 'patient' | null>(null);
  const [userName, setUserName] = useState<string>("");

  const { data: session, isLoading } = useQuery<Session>({
    queryKey: ["/api/sessions", sessionId],
    enabled: !!sessionId,
  });

  const { socket, isConnected } = useSocket(sessionId);
  const { 
    localStream, 
    remoteStream, 
    isAudioMuted, 
    isVideoMuted, 
    toggleAudio, 
    toggleVideo,
    initiateCall
  } = useWebRTC(socket, sessionId);
  
  const { postureData, startPoseDetection, stopPoseDetection } = useMediapipe(localStream);

  // Determine user role when session loads
  useEffect(() => {
    if (session && !userRole) {
      // Simple role detection: if URL was just created vs joined
      const isCreator = sessionStorage.getItem(`session_creator_${sessionId}`) === 'true';
      
      if (isCreator) {
        setUserRole('doctor');
        setUserName(session.doctorName);
      } else {
        setUserRole('patient');
        setUserName(session.patientName || 'Patient');
      }

      // Join session via WebSocket
      if (socket) {
        socket.send(JSON.stringify({
          type: 'join-session',
          sessionId,
          userName: isCreator ? session.doctorName : (session.patientName || 'Patient'),
          userType: isCreator ? 'doctor' : 'patient'
        }));

        // Only doctor initiates WebRTC call when both socket and stream are ready
        if (isCreator) {
          // Wait for local stream to be ready, then initiate call
          const checkAndInitiate = () => {
            if (localStream) {
              console.log('Doctor initiating WebRTC call');
              setTimeout(() => {
                initiateCall();
              }, 2000); // Give patient time to connect
            } else {
              // Check again in 500ms
              setTimeout(checkAndInitiate, 500);
            }
          };
          checkAndInitiate();
        }
      }
    }
  }, [session, socket, sessionId, userRole, localStream, initiateCall]);

  useEffect(() => {
    if (localStream && postureData) {
      // Send posture data to other participants
      socket?.send(JSON.stringify({
        type: 'posture-data',
        sessionId,
        data: postureData
      }));
    }
  }, [postureData, socket, sessionId, localStream]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-medical-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-medical-gray flex items-center justify-center">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Session Not Found</h2>
          <p className="text-gray-600">The session you're looking for doesn't exist or has ended.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-medical-gray font-inter">
      <SessionHeader 
        session={session} 
        isConnected={isConnected} 
        sessionId={sessionId}
      />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Session Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <h2 className="font-semibold text-medical-dark">Active Session</h2>
                <p className="text-sm text-gray-600">
                  Session ID: <span className="font-mono bg-white px-2 py-1 rounded">{sessionId}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {/* Video Section */}
          <div className={`space-y-4 ${isMobile ? 'order-1' : 'lg:col-span-2'}`}>
            {/* Doctor Video */}
            <Card className="overflow-hidden shadow-lg">
              <div className="bg-medical-blue text-white px-4 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{session.doctorName}</span>
                  {userRole === 'doctor' && <span className="text-xs bg-blue-600 px-2 py-1 rounded">(You)</span>}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Online</span>
                </div>
              </div>
              <div className="relative aspect-video bg-gray-900">
                <video
                  ref={(el) => {
                    if (el) {
                      // Show doctor's video: if you're doctor show local, if patient show remote
                      const stream = userRole === 'doctor' ? localStream : remoteStream;
                      if (stream) {
                        el.srcObject = stream;
                      }
                    }
                  }}
                  autoPlay
                  playsInline
                  muted={userRole === 'doctor'} // Mute own video to prevent feedback
                  className="w-full h-full object-cover"
                />
                {userRole === 'doctor' && (
                  <VideoControls
                    isAudioMuted={isAudioMuted}
                    isVideoMuted={isVideoMuted}
                    onToggleAudio={toggleAudio}
                    onToggleVideo={toggleVideo}
                  />
                )}
                {!localStream && !remoteStream && (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-2xl">👨‍⚕️</span>
                      </div>
                      <p>Doctor camera off</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Patient Video with Posture Analysis */}
            <Card className="overflow-hidden shadow-lg">
              <div className="bg-medical-teal text-white px-4 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{session.patientName || "Patient"}</span>
                  {userRole === 'patient' && <span className="text-xs bg-teal-600 px-2 py-1 rounded">(You)</span>}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Recording Posture</span>
                  </div>
                  <button
                    onClick={() => {
                      if (postureData) {
                        stopPoseDetection();
                      } else {
                        startPoseDetection();
                      }
                    }}
                    className="text-white hover:text-yellow-300 transition-colors"
                    title="Toggle Posture Analysis"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="relative aspect-video bg-gray-900">
                <video
                  ref={(el) => {
                    if (el) {
                      // Show patient's video: if you're patient show local, if doctor show remote
                      const stream = userRole === 'patient' ? localStream : remoteStream;
                      if (stream) {
                        el.srcObject = stream;
                      }
                    }
                  }}
                  autoPlay
                  playsInline
                  muted={userRole === 'patient'} // Mute own video to prevent feedback
                  className="w-full h-full object-cover"
                />
                {userRole === 'patient' && (
                  <VideoControls
                    isAudioMuted={isAudioMuted}
                    isVideoMuted={isVideoMuted}
                    onToggleAudio={toggleAudio}
                    onToggleVideo={toggleVideo}
                  />
                )}
                {postureData && userRole === 'patient' && (
                  <PostureOverlay postureData={postureData} />
                )}
                {!localStream && !remoteStream && (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-2xl">👤</span>
                      </div>
                      <p>Patient camera off</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Exercise Instructions Panel */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-medical-dark mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-medical-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
                Current Exercise
              </h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-medical-dark mb-2">Shoulder Blade Squeeze</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Sit or stand with your arms at your sides. Squeeze your shoulder blades together, 
                  hold for 5 seconds, then relax. This helps improve posture and reduce forward head position.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Sets: <span className="font-medium">3</span></span>
                  <span className="text-gray-600">Reps: <span className="font-medium">15</span></span>
                  <span className="text-gray-600">Duration: <span className="font-medium">5 sec hold</span></span>
                </div>
              </div>
            </Card>
          </div>

          {/* Chat & Tools Section */}
          <div className={`space-y-6 ${isMobile ? 'order-2' : ''}`}>
            <ChatBox 
              sessionId={sessionId} 
              socket={socket}
              userName={session.doctorName}
              userType="doctor"
            />

            {/* Session Tools */}
            <Card className="p-6">
              <h3 className="font-semibold text-medical-dark mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-medical-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
                Session Tools
              </h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Record Session</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                </button>

                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H4zm5 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Capture Posture</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
