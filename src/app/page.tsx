import { Areas } from "@/components/areas";
import { BrandStrip } from "@/components/brand-strip";
import { Closing } from "@/components/closing";
import { Hero } from "@/components/hero";
import { ServicesRail } from "@/components/services-rail";
import { Sidewall } from "@/components/sidewall";
import { SiteNav } from "@/components/site-nav";
import { Testimonials } from "@/components/testimonials";
import { WhyUs } from "@/components/why-us";

export default function Page() {
  return (
    <>
      <SiteNav />
      <main className="w-full max-w-full overflow-x-clip">
        <Hero />
        <BrandStrip />
        <ServicesRail />
        <Sidewall />
        <WhyUs />
        <Testimonials />
        <Areas />
        <Closing />
      </main>
    </>
  );
}
