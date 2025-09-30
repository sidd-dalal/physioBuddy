import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { UserRound, Video, Plus, LogIn, Info, Copy, Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createdSessionId, setCreatedSessionId] = useState("");
  const [showSessionLink, setShowSessionLink] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const createSessionMutation = useMutation({
    mutationFn: async (data: { sessionId: string; doctorName: string; patientName?: string }) => {
      const response = await apiRequest("POST", "/api/sessions", data);
      return response.json();
    },
    onSuccess: (session) => {
      // Mark this user as the session creator
      sessionStorage.setItem(`session_creator_${session.sessionId}`, 'true');
      
      setCreatedSessionId(session.sessionId);
      setShowSessionLink(true);
      setShowCreateForm(false);
      toast({
        title: "Session Created",
        description: `Session ${session.sessionId} has been created successfully.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateSession = () => {
    if (!doctorName.trim()) {
      toast({
        title: "Error",
        description: "Doctor name is required to create a session.",
        variant: "destructive",
      });
      return;
    }

    const newSessionId = `PHY-${Date.now()}`;
    createSessionMutation.mutate({
      sessionId: newSessionId,
      doctorName: doctorName.trim(),
      patientName: patientName.trim() || undefined,
    });
  };

  const handleJoinSession = () => {
    if (!sessionId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid session ID.",
        variant: "destructive",
      });
      return;
    }

    setLocation(`/session/${sessionId.trim()}`);
  };

  const copySessionLink = async () => {
    const sessionLink = `${window.location.origin}/session/${createdSessionId}`;
    try {
      await navigator.clipboard.writeText(sessionLink);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Session link has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = sessionLink;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Session link has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const joinCreatedSession = () => {
    setLocation(`/session/${createdSessionId}`);
  };

  return (
    <div className="min-h-screen bg-medical-gray font-inter">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-medical-blue text-white p-2 rounded-lg">
                <UserRound className="text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-medical-dark">YourPhysioBuddy</h1>
                <p className="text-sm text-gray-500">Online Consultations with Dr. Unnati Lodha</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full shadow-2xl">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="bg-medical-blue text-white p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Video className="text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-medical-dark mb-2">Start Your Session</h2>
              <p className="text-gray-600">Create or join a physiotherapy consultation</p>
            </div>

            <div className="space-y-4">
              {showSessionLink ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <h3 className="font-semibold text-green-800 mb-2">Session Created Successfully!</h3>
                      <p className="text-sm text-green-700 mb-3">Session ID: <code className="bg-green-100 px-2 py-1 rounded font-mono">{createdSessionId}</code></p>
                      <div className="bg-white border rounded-lg p-3 mb-3">
                        <p className="text-xs text-gray-500 mb-1">Share this link:</p>
                        <p className="text-sm font-mono text-gray-700 break-all">{`${window.location.origin}/session/${createdSessionId}`}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={copySessionLink}
                      className="flex-1 bg-medical-teal hover:bg-teal-600 text-white"
                    >
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Link
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={joinCreatedSession}
                      className="flex-1 bg-medical-blue hover:bg-blue-700 text-white"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Join Session
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={() => {
                      setShowSessionLink(false);
                      setCreatedSessionId("");
                      setDoctorName("");
                      setPatientName("");
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Create Another Session
                  </Button>
                </div>
              ) : !showCreateForm ? (
                <>
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    className="w-full bg-medical-blue hover:bg-blue-700 text-white py-3 px-4 font-medium"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Session
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Input
                      type="text"
                      placeholder="Enter session ID..."
                      value={sessionId}
                      onChange={(e) => setSessionId(e.target.value)}
                      className="w-full"
                    />
                    <Button 
                      onClick={handleJoinSession}
                      className="w-full bg-medical-teal hover:bg-teal-600 text-white py-3 px-4 font-medium"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Join Session
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Doctor name (required)"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full"
                  />
                  <Input
                    type="text"
                    placeholder="Patient name (optional)"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full"
                  />
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleCreateSession}
                      disabled={createSessionMutation.isPending}
                      className="flex-1 bg-medical-blue hover:bg-blue-700 text-white"
                    >
                      {createSessionMutation.isPending ? "Creating..." : "Create"}
                    </Button>
                    <Button 
                      onClick={() => setShowCreateForm(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex">
                <Info className="text-blue-500 mt-0.5 mr-3 h-4 w-4" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium">Before you start:</p>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>Ensure good lighting and stable internet</li>
                    <li>Position camera to show upper body clearly</li>
                    <li>Have a quiet, private space ready</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
