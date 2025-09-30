import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';
import { AboutSection } from '@/components/about-section';
import { ServicesSection } from '@/components/services-section';
import { WhyChooseSection } from '@/components/why-choose-section';
import { ContactSection } from '@/components/contact-section';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="font-inter text-gray-700 bg-white" data-testid="home-page">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <WhyChooseSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
