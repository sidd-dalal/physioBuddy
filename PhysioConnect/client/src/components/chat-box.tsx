import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, MessageSquare, UserRound, User } from "lucide-react";
import type { Message } from "@shared/schema";

interface ChatBoxProps {
  sessionId: string;
  socket: WebSocket | null;
  userName: string;
  userType: "doctor" | "patient";
}

export default function ChatBox({ sessionId, socket, userName, userType }: ChatBoxProps) {
  const [message, setMessage] = useState("");
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: initialMessages = [] } = useQuery<Message[]>({
    queryKey: ["/api/sessions", sessionId, "messages"],
    enabled: !!sessionId,
  });

  useEffect(() => {
    if (socket) {
      const handleMessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data.type === 'chat-message') {
          setLiveMessages(prev => [...prev, data]);
        }
      };

      socket.addEventListener('message', handleMessage);
      return () => socket.removeEventListener('message', handleMessage);
    }
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveMessages, initialMessages]);

  const allMessages = [...initialMessages, ...liveMessages];

  const sendMessage = () => {
    if (!message.trim() || !socket) return;

    socket.send(JSON.stringify({
      type: 'chat-message',
      sessionId,
      senderName: userName,
      senderType: userType,
      message: message.trim()
    }));

    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-96 flex flex-col">
      <div className="bg-gray-50 px-4 py-3 border-b rounded-t-xl">
        <h3 className="font-semibold text-medical-dark flex items-center">
          <MessageSquare className="mr-2 h-4 w-4 text-medical-blue" />
          Session Chat
        </h3>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {allMessages.map((msg, index) => (
          <div 
            key={msg.id || index} 
            className={`flex items-start space-x-3 ${msg.senderType === userType ? 'justify-end' : ''}`}
          >
            {msg.senderType !== userType && (
              <div className="bg-medical-blue text-white p-2 rounded-full text-xs">
                {msg.senderType === 'doctor' ? <UserRound className="h-3 w-3" /> : <User className="h-3 w-3" />}
              </div>
            )}
            
            <div className={`flex-1 ${msg.senderType === userType ? 'text-right' : ''}`}>
              <div className={`rounded-lg p-3 inline-block max-w-xs ${
                msg.senderType === userType 
                  ? 'bg-medical-teal text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="text-sm">{msg.message}</p>
              </div>
              <span className="text-xs text-gray-500 mt-1 block">
                {msg.senderName} • {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : 'Now'}
              </span>
            </div>
            
            {msg.senderType === userType && (
              <div className="bg-gray-300 text-gray-600 p-2 rounded-full text-xs">
                {msg.senderType === 'doctor' ? <UserRound className="h-3 w-3" /> : <User className="h-3 w-3" />}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage}
            disabled={!message.trim()}
            className="bg-medical-blue hover:bg-blue-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
