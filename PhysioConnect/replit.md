# Overview

This is a telehealth platform that enables virtual physiotherapy sessions with real-time video conferencing, posture analysis using MediaPipe, and live chat functionality. The application facilitates remote consultations between doctors and patients with advanced motion tracking capabilities for physical therapy assessment.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Component-based UI using functional components and hooks
- **Vite**: Fast development server and build tool with hot module replacement
- **Tailwind CSS + shadcn/ui**: Utility-first styling with pre-built accessible components
- **Wouter**: Lightweight client-side routing for navigation
- **TanStack Query**: Server state management for API data fetching and caching

## Backend Architecture
- **Express.js**: RESTful API server with middleware for JSON parsing and logging
- **WebSocket Server**: Real-time bidirectional communication for chat and video signaling
- **Modular Storage**: Interface-based storage abstraction (currently in-memory, designed for database expansion)
- **Development Integration**: Vite middleware integration for seamless development experience

## Real-time Communication
- **WebRTC**: Peer-to-peer video/audio streaming with STUN server configuration
- **WebSocket Protocol**: Custom message types for session management, chat, and WebRTC signaling
- **MediaPipe Integration**: Real-time pose detection and posture analysis overlay on video streams

## Data Management
- **Drizzle ORM**: Type-safe database toolkit configured for PostgreSQL
- **Schema-first Design**: Shared TypeScript schemas between client and server
- **Session Management**: Structured session lifecycle with doctor/patient roles
- **Message System**: Real-time chat with sender identification and timestamps

## External Dependencies

- **Neon Database**: Serverless PostgreSQL database hosting
- **MediaPipe Libraries**: Google's pose detection and analysis framework
- **Radix UI Primitives**: Headless UI components for accessibility and styling
- **WebRTC STUN Servers**: Google's public STUN servers for NAT traversal
- **Replit Development Tools**: Cartographer plugin and runtime error overlay for development environment