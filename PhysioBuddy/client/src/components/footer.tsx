import { Heart, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';

export function Footer() {
  const { scrollToSection } = useSmoothScroll();

  return (
    <footer className="bg-gray-900 text-white py-12" data-testid="footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-sage-500 rounded-full flex items-center justify-center">
                <Heart className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-semibold" data-testid="footer-brand">
                YourPhysioBuddy
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed" data-testid="footer-description">
              Dedicated to helping you move better, recover faster, and live pain-free through personalized physiotherapy care.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4" data-testid="footer-quick-links-title">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-gray-400 hover:text-sage-400 transition-colors duration-200"
                  data-testid="footer-link-about"
                >
                  About Dr. Unnati
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-gray-400 hover:text-sage-400 transition-colors duration-200"
                  data-testid="footer-link-services"
                >
                  Our Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-400 hover:text-sage-400 transition-colors duration-200"
                  data-testid="footer-link-contact"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4" data-testid="footer-social-title">
              Connect With Us
            </h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-sage-500 transition-colors duration-200"
                data-testid="social-facebook"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-sage-500 transition-colors duration-200"
                data-testid="social-instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-sage-500 transition-colors duration-200"
                data-testid="social-linkedin"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400" data-testid="footer-copyright">
            © 2024 YourPhysioBuddy. All rights reserved. | Dr. Unnati Lodha, Licensed Physiotherapist
          </p>
        </div>
      </div>
    </footer>
  );
}
