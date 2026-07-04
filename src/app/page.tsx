import { Backdrop } from '@/components/marketing/Backdrop';
import { IntroSplash } from '@/components/marketing/IntroSplash';
import { LandingNav } from '@/components/marketing/LandingNav';
import { Hero } from '@/components/marketing/Hero';
import { TrustBadges } from '@/components/marketing/TrustBadges';
import { GlobeSection } from '@/components/marketing/GlobeSection';
import { Features } from '@/components/marketing/Features';
import { ServicesShowcase } from '@/components/marketing/ServicesShowcase';
import { IntegrationConstellation } from '@/components/marketing/IntegrationConstellation';
import { DemoConfigurator } from '@/components/marketing/DemoConfigurator';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { Stats } from '@/components/marketing/Stats';
import { Testimonial } from '@/components/marketing/Testimonial';
import { CTA } from '@/components/marketing/CTA';
import { LandingFooter } from '@/components/marketing/LandingFooter';

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-ink selection:bg-brand-200">
      <IntroSplash />
      <Backdrop />
      <LandingNav />
      <main>
        <Hero />
        <TrustBadges />
        <GlobeSection />
        <Features />
        <ServicesShowcase />
        <IntegrationConstellation />
        <DemoConfigurator />
        <HowItWorks />
        <Stats />
        <Testimonial />
        <CTA />
      </main>
      <LandingFooter />
    </div>
  );
}
