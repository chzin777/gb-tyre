"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { services, whatsappLink } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function ServiceCard({ service }: { service: (typeof services)[number] }) {
  return (
    <article className="rail-card group relative flex h-full w-[80vw] shrink-0 snap-center flex-col overflow-hidden rounded-[20px] border border-carbon bg-asphalt-2 sm:w-[400px] lg:w-[440px]">
      <div className="relative h-[42%] min-h-[170px] overflow-hidden">
        <Image
          src={service.photo}
          alt=""
          fill
          sizes="(max-width: 640px) 85vw, 500px"
          quality={92}
          className="object-cover object-center contrast-[1.05] saturate-[0.8] transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,19,25,0.25),rgba(22,26,34,0.95))]"
        />
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="font-display text-2xl leading-tight font-extrabold tracking-tight text-chalk md:text-[28px]">
          {service.title}
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-soft">
          {service.blurb}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-dim">
          {service.detail}
        </p>

        <a
          href={whatsappLink(service.message)}
          target="_blank"
          rel="noreferrer"
          className="mt-auto inline-flex items-center gap-2 self-start pt-6 text-sm font-bold text-hazard transition-colors hover:text-hazard-soft"
        >
          {service.cta}
          <ArrowUpRight
            size={16}
            weight="bold"
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </article>
  );
}

function Heading() {
  return (
    <>
      <h2 className="font-display text-[clamp(2.2rem,5.5vw,4.6rem)] leading-[0.95] font-extrabold tracking-[-0.03em] text-chalk">
        Five things
        <br />
        we do all day
      </h2>
      <p className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-slate-soft md:mt-6 md:text-base">
        Fitting, repairs, balancing, sensors and checks. Same-day work on cars,
        vans and 4x4.
      </p>
    </>
  );
}

/**
 * Services. On desktop the section pins and the row of bays pans sideways, which
 * mirrors walking the length of the workshop. On touch it degrades to a normal
 * snap rail, because hijacking a phone's scroll to move a carousel is hostile.
 */
export function ServicesRail() {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useGSAP(
    () => {
      if (reduce) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const trackEl = track.current;
        const wrapEl = wrap.current;
        if (!trackEl || !wrapEl) return;

        const distance = () =>
          Math.max(0, trackEl.scrollWidth - window.innerWidth + 48);

        gsap.to(trackEl, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrapEl,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: wrap, dependencies: [reduce] },
  );

  return (
    <section
      id="services"
      ref={wrap}
      className="relative overflow-hidden border-b border-carbon py-20 lg:h-[100dvh] lg:py-0"
    >
      <div className="mb-8 px-4 md:px-6 lg:hidden">
        <Heading />
      </div>

      <div
        ref={track}
        className="rail flex h-full snap-x snap-mandatory items-stretch gap-5 overflow-x-auto px-4 md:gap-6 md:px-6 lg:w-max lg:snap-none lg:gap-7 lg:overflow-visible lg:px-12"
      >
        <header className="hidden shrink-0 snap-center flex-col justify-center lg:flex lg:h-[100dvh] lg:w-[min(38vw,460px)] lg:pr-4">
          <Heading />
          <span
            aria-hidden
            className="tread-band mt-8 h-4 w-40 opacity-70"
          />
        </header>

        {services.map((service) => (
          <div key={service.slug} className="h-[470px] sm:h-[540px] lg:h-[68vh] lg:self-center">
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
    </section>
  );
}
