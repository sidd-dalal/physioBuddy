import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull().unique(),
  doctorName: text("doctor_name").notNull(),
  patientName: text("patient_name"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  endedAt: timestamp("ended_at"),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  senderName: text("sender_name").notNull(),
  senderType: text("sender_type").notNull(), // 'doctor' | 'patient'
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertSessionSchema = createInsertSchema(sessions).pick({
  sessionId: true,
  doctorName: true,
  patientName: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  sessionId: true,
  senderName: true,
  senderType: true,
  message: true,
});

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
