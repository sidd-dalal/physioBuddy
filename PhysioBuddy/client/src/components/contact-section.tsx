import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import emailjs from '@emailjs/browser';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Basic validation
      if (!formData.name || !formData.email || !formData.message) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      if (formData.message.length < 10) {
        toast({
          title: "Validation Error", 
          description: "Message must be at least 10 characters long.",
          variant: "destructive",
        });
        return;
      }

      // For Firebase static hosting, we'll use EmailJS for contact form
      // You'll need to set up EmailJS account and replace these values
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key';

      // For now, we'll simulate success and provide setup instructions
      if (serviceId === 'your_service_id') {
        toast({
          title: "Setup Required",
          description: "EmailJS configuration needed. Check the deployment guide for setup instructions.",
          variant: "destructive",
        });
        return;
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          message: formData.message,
          to_email: 'lodha.unnati@gmail.com',
        },
        publicKey
      );

      toast({
        title: "Message Sent!",
        description: "Thank you for your message! Dr. Unnati will get back to you soon.",
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-16 lg:py-24 gradient-bg" data-testid="contact-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="contact-title">
            Get in <span className="text-sage-600">Touch</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="contact-subtitle">
            Ready to start your journey to better health? Book an online consultation or schedule a home visit in Hinghanghat area
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6" data-testid="contact-form-title">
              Send us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors duration-200"
                    placeholder="Enter your full name"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors duration-200"
                    placeholder="Enter your phone number"
                    data-testid="input-phone"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors duration-200"
                  placeholder="Enter your email address"
                  data-testid="input-email"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors duration-200 resize-none"
                  placeholder="Tell us about your condition or questions..."
                  data-testid="input-message"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-sage-500 text-white py-4 rounded-lg hover:bg-sage-600 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                data-testid="submit-button"
              >
                <Send className="mr-2 w-5 h-5" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6" data-testid="contact-info-title">
                Contact Information
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4" data-testid="contact-email">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-sage-600 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">lodha.unnati@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4" data-testid="contact-phone">
                  <div className="w-12 h-12 bg-sky-soft-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-sky-soft-600 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <p className="text-gray-600">+91 7755948858</p>
                    <p className="text-gray-600 text-sm">Available for consultations and home visits</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4" data-testid="contact-location">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-yellow-600 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Service Area</h4>
                    <p className="text-gray-600">Online Consultations Worldwide</p>
                    <p className="text-gray-600">Home Visits: Hinghanghat & Surrounding Areas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4" data-testid="service-area-title">
                Service Coverage
              </h3>
              <div className="bg-gradient-to-br from-sage-50 to-sky-soft-50 rounded-lg p-6 text-center" data-testid="service-area-info">
                <div className="text-center text-sage-700">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-sage-500" />
                  <h4 className="font-semibold text-lg mb-2">Online & Home Services</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Online Consultations:</strong> Available globally via video call
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Home Visits:</strong> Hinghanghat and surrounding areas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
