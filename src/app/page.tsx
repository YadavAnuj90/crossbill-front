import { LandingNav } from '@/components/marketing/LandingNav';
import { Hero } from '@/components/marketing/Hero';
import { LogoCloud } from '@/components/marketing/LogoCloud';
import { Features } from '@/components/marketing/Features';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { Stats } from '@/components/marketing/Stats';
import { Pricing } from '@/components/marketing/Pricing';
import { Testimonial } from '@/components/marketing/Testimonial';
import { CTA } from '@/components/marketing/CTA';
import { LandingFooter } from '@/components/marketing/LandingFooter';

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <LandingNav />
      <main>
        <Hero />
        <LogoCloud />
        <Features />
        <HowItWorks />
        <Stats />
        <Pricing />
        <Testimonial />
        <CTA />
      </main>
      <LandingFooter />
    </div>
  );
}
