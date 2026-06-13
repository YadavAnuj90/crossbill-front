import { Backdrop } from '@/components/marketing/Backdrop';
import { LandingNav } from '@/components/marketing/LandingNav';
import { Hero } from '@/components/marketing/Hero';
import { Features } from '@/components/marketing/Features';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { Stats } from '@/components/marketing/Stats';
import { Pricing } from '@/components/marketing/Pricing';
import { Testimonial } from '@/components/marketing/Testimonial';
import { CTA } from '@/components/marketing/CTA';
import { LandingFooter } from '@/components/marketing/LandingFooter';

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-ink selection:bg-brand-200">
      <Backdrop />
      <LandingNav />
      <main>
        <Hero />
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
