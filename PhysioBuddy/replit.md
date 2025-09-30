# Replit.md

## Overview

This is a single-page physiotherapy website built for YourPhysioBuddy, featuring Dr. Unnati Lodha. The application is designed as a modern, responsive landing page that showcases primarily online physiotherapy services with optional home visits available in Hinhanghat area. The site includes sections for hero content, doctor information, services offered (emphasizing online consultations), reasons to choose the practice, and a functional contact form for patient inquiries.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom color schemes (sage greens and soft blues)
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state and form handling
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Type Safety**: TypeScript throughout the entire stack
- **API Design**: RESTful endpoints with structured error handling
- **Data Storage**: In-memory storage implementation with interface for future database integration
- **Middleware**: Request logging, JSON parsing, and error handling

### Database Schema
- **ORM**: Drizzle ORM with PostgreSQL dialect configuration
- **Tables**: 
  - `users` - Basic user authentication structure
  - `contact_submissions` - Contact form data with validation
- **Validation**: Zod schemas for type-safe data validation

### Component Structure
- **Layout Components**: Navigation, Hero, About, Services, Why Choose, Contact, Footer
- **UI Components**: Comprehensive shadcn/ui component library
- **Custom Hooks**: Smooth scrolling navigation and mobile detection
- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts

### Development Setup
- **Build System**: Vite with React plugin and development error overlay
- **TypeScript**: Strict mode with path mapping for clean imports
- **Hot Reload**: Development server with HMR support
- **Asset Management**: Optimized bundling and static asset serving

## External Dependencies

### Core Framework Dependencies
- React 18 with TypeScript support
- Express.js for server-side API handling
- Vite for build tooling and development server

### UI and Styling
- Tailwind CSS for utility-first styling
- Radix UI primitives for accessible components
- shadcn/ui for pre-built component patterns
- Lucide React for consistent iconography

### Data Management
- TanStack Query for server state management
- React Hook Form for form state and validation
- Zod for runtime type validation and schema definition
- Drizzle ORM for database operations

### Database Integration
- PostgreSQL as the target database (configured but not implemented)
- Neon Database serverless driver for cloud database connectivity
- Drizzle Kit for database migrations and schema management

### Development Tools
- TypeScript for type safety across the stack
- PostCSS with Autoprefixer for CSS processing
- Replit-specific plugins for development environment integration