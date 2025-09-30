import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      
      // Store the submission
      const submission = await storage.createContactSubmission(validatedData);
      
      // Here you would typically send an email notification
      // For now, we'll just log it and return success
      console.log("New contact submission:", submission);
      
      // In a real implementation, you would use nodemailer here:
      // const transporter = nodemailer.createTransporter({...});
      // await transporter.sendMail({
      //   from: process.env.SMTP_FROM,
      //   to: process.env.CONTACT_EMAIL || 'info@yourphysiobuddy.com',
      //   subject: `New Contact Form Submission from ${validatedData.name}`,
      //   html: `
      //     <h2>New Contact Form Submission</h2>
      //     <p><strong>Name:</strong> ${validatedData.name}</p>
      //     <p><strong>Email:</strong> ${validatedData.email}</p>
      //     <p><strong>Phone:</strong> ${validatedData.phone || 'Not provided'}</p>
      //     <p><strong>Message:</strong></p>
      //     <p>${validatedData.message}</p>
      //   `
      // });
      
      res.status(201).json({ 
        success: true, 
        message: "Thank you for your message! We'll get back to you soon.",
        id: submission.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Please check your form data", 
          errors: error.errors 
        });
      } else {
        console.error("Contact form submission error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Sorry, something went wrong. Please try again later." 
        });
      }
    }
  });

  // Get all contact submissions (for admin purposes)
  app.get("/api/contact", async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
