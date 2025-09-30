import { Calendar, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';

export function HeroSection() {
  const { scrollToSection } = useSmoothScroll();

  return (
    <section id="hero" className="pt-16 gradient-bg" data-testid="hero-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6" data-testid="hero-title">
              <span>Your Physio Buddy</span> –{' '}
              <span className="text-sage-600">Optimizing Your Recovery</span>{' '}
              with <span>Dr. Unnati Lodha</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed" data-testid="hero-subtitle">
              Online physiotherapy consultations with optional home visits in Hinghanghat area. Helping you move better, recover faster, and live pain-free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={() => scrollToSection('contact')}
                className="bg-sage-500 text-white px-8 py-4 rounded-full hover:bg-sage-600 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                data-testid="hero-cta-button"
              >
                <Calendar className="mr-2 w-5 h-5" />
                Get in Touch
              </Button>
              <Button
                variant="outline"
                onClick={() => scrollToSection('services')}
                className="border-2 border-sage-500 text-sage-600 px-8 py-4 rounded-full hover:bg-sage-50 transition-all duration-200 font-semibold text-lg"
                data-testid="hero-learn-more-button"
              >
                <Info className="mr-2 w-5 h-5" />
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <img
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
              alt="Friendly physiotherapist helping patient with exercises"
              className="rounded-2xl shadow-2xl w-full max-w-md lg:max-w-lg h-auto object-cover"
              data-testid="hero-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
