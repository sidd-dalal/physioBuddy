import { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollToSection } = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: 'hero' },
    { label: 'About', href: 'about' },
    { label: 'Services', href: 'services' },
    { label: 'Why Choose Us', href: 'why-choose' },
  ];

  const handleNavClick = (href: string) => {
    scrollToSection(href);
    setIsMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 transition-all duration-200 ${
        isScrolled ? 'shadow-lg' : 'shadow-sm'
      }`}
      data-testid="navigation"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sage-500 rounded-full flex items-center justify-center">
              <Heart className="text-white w-6 h-6" data-testid="logo-icon" />
            </div>
            <span className="text-xl font-semibold text-gray-800" data-testid="brand-name">
              YourPhysioBuddy
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-gray-600 hover:text-sage-600 transition-colors duration-200 font-medium"
                data-testid={`nav-link-${item.href}`}
              >
                {item.label}
              </button>
            ))}
            <Button
              onClick={() => handleNavClick('contact')}
              className="bg-sage-500 text-white px-4 py-2 rounded-full hover:bg-sage-600 transition-colors duration-200 font-medium"
              data-testid="nav-contact-button"
            >
              Contact
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-sage-600 focus:outline-none"
              data-testid="mobile-menu-button"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white" data-testid="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="block w-full text-left px-3 py-2 text-gray-600 hover:text-sage-600 transition-colors duration-200 font-medium"
                  data-testid={`mobile-nav-link-${item.href}`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => handleNavClick('contact')}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-sage-600 transition-colors duration-200 font-medium"
                data-testid="mobile-nav-contact"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
