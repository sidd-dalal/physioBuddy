import { type Session, type InsertSession, type Message, type InsertMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Session management
  createSession(session: InsertSession): Promise<Session>;
  getSession(sessionId: string): Promise<Session | undefined>;
  endSession(sessionId: string): Promise<void>;
  
  // Message management
  addMessage(message: InsertMessage): Promise<Message>;
  getMessages(sessionId: string): Promise<Message[]>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, Session>;
  private messages: Map<string, Message[]>;

  constructor() {
    this.sessions = new Map();
    this.messages = new Map();
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = randomUUID();
    const session: Session = { 
      ...insertSession, 
      id,
      patientName: insertSession.patientName || null,
      isActive: true,
      createdAt: new Date(),
      endedAt: null,
    };
    this.sessions.set(session.sessionId, session);
    this.messages.set(session.sessionId, []);
    return session;
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    return this.sessions.get(sessionId);
  }

  async endSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isActive = false;
      session.endedAt = new Date();
      this.sessions.set(sessionId, session);
    }
  }

  async addMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      timestamp: new Date(),
    };
    
    const messages = this.messages.get(insertMessage.sessionId) || [];
    messages.push(message);
    this.messages.set(insertMessage.sessionId, messages);
    
    return message;
  }

  async getMessages(sessionId: string): Promise<Message[]> {
    return this.messages.get(sessionId) || [];
  }
}

export const storage = new MemStorage();
