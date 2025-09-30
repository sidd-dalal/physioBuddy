import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { UserRound, LogOut, Copy, Check } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Session } from "@shared/schema";

interface SessionHeaderProps {
  session: Session;
  isConnected: boolean;
  sessionId: string;
}

export default function SessionHeader({ session, isConnected, sessionId }: SessionHeaderProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);

  const endSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/sessions/${sessionId}/end`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Session Ended",
        description: "The session has been ended successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/sessions", sessionId] });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to end session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session?")) {
      endSessionMutation.mutate();
    }
  };

  const copySessionLink = async () => {
    const sessionLink = `${window.location.origin}/session/${sessionId}`;
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

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-medical-blue text-white p-2 rounded-lg">
              <UserRound className="text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-medical-dark">YourPhysioBuddy</h1>
              <p className="text-sm text-gray-500">Online Consultations with {session.doctorName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Connection status indicator */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <Button 
              onClick={copySessionLink}
              variant="outline"
              className="text-medical-blue border-medical-blue hover:bg-medical-blue hover:text-white"
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
              onClick={handleEndSession}
              disabled={endSessionMutation.isPending}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {endSessionMutation.isPending ? 'Ending...' : 'End Session'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
