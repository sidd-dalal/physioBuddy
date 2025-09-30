import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertSessionSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session management routes
  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  app.get("/api/sessions/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  app.post("/api/sessions/:sessionId/end", async (req, res) => {
    try {
      const { sessionId } = req.params;
      await storage.endSession(sessionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to end session" });
    }
  });

  app.get("/api/sessions/:sessionId/messages", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getMessages(sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time communication
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const sessionConnections = new Map<string, Set<WebSocket>>();

  wss.on('connection', (ws: WebSocket) => {
    let currentSessionId: string | null = null;

    ws.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'join-session':
            currentSessionId = message.sessionId;
            
            if (currentSessionId && !sessionConnections.has(currentSessionId)) {
              sessionConnections.set(currentSessionId, new Set());
            }
            if (currentSessionId) {
              sessionConnections.get(currentSessionId)!.add(ws);
              
              // Notify other participants
              broadcast(currentSessionId, {
                type: 'user-joined',
                sessionId: currentSessionId,
                userName: message.userName,
                userType: message.userType
              }, ws);
            }
            break;

          case 'webrtc-offer':
          case 'webrtc-answer':
          case 'webrtc-ice-candidate':
            // Forward WebRTC signaling messages
            if (currentSessionId) {
              console.log(`[WebRTC] Forwarding ${message.type} in session ${currentSessionId}`);
              broadcast(currentSessionId, message, ws);
            }
            break;

          case 'chat-message':
            if (currentSessionId) {
              // Save message to storage
              const chatMessage = insertMessageSchema.parse({
                sessionId: currentSessionId,
                senderName: message.senderName,
                senderType: message.senderType,
                message: message.message
              });
              
              const savedMessage = await storage.addMessage(chatMessage);
              
              // Broadcast to all session participants
              broadcast(currentSessionId, {
                type: 'chat-message',
                ...savedMessage
              });
            }
            break;

          case 'posture-data':
            // Forward posture analysis data
            if (currentSessionId) {
              broadcast(currentSessionId, message, ws);
            }
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (currentSessionId && sessionConnections.has(currentSessionId)) {
        sessionConnections.get(currentSessionId)!.delete(ws);
        
        // Notify other participants
        broadcast(currentSessionId, {
          type: 'user-left',
          sessionId: currentSessionId
        }, ws);
        
        if (sessionConnections.get(currentSessionId)!.size === 0) {
          sessionConnections.delete(currentSessionId);
        }
      }
    });

    function broadcast(sessionId: string, message: any, exclude?: WebSocket) {
      const connections = sessionConnections.get(sessionId);
      if (connections) {
        connections.forEach(client => {
          if (client !== exclude && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
          }
        });
      }
    }
  });

  return httpServer;
}
