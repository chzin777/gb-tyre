"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { EnvelopeSimple, Phone, WhatsappLogo } from "@phosphor-icons/react";
import { business, fullAddress, nav, whatsappLink } from "@/lib/site";

const BOOKING_MESSAGE = "Hi GB Tyre Services, I would like to book a slot.";

/**
 * Magnetic primary CTA. The button leans toward the cursor, which makes the last
 * click on the page feel like it wants to be pressed. Pointer position lives in
 * motion values, so tracking it never re-renders React.
 */
function MagneticBook() {
  const host = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 190, damping: 16, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 190, damping: 16, mass: 0.4 });

  function follow(event: React.MouseEvent<HTMLAnchorElement>) {
    if (reduce) return;
    const box = host.current?.getBoundingClientRect();
    if (!box) return;
    x.set((event.clientX - (box.left + box.width / 2)) * 0.22);
    y.set((event.clientY - (box.top + box.height / 2)) * 0.32);
  }

  function release() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={host}
      href={whatsappLink(BOOKING_MESSAGE)}
      target="_blank"
      rel="noreferrer"
      onMouseMove={follow}
      onMouseLeave={release}
      style={{ x: reduce ? 0 : springX, y: reduce ? 0 : springY }}
      className="inline-flex h-16 items-center justify-center gap-3 rounded-full bg-hazard px-9 text-lg font-bold whitespace-nowrap text-asphalt transition-colors duration-300 hover:bg-hazard-soft active:scale-[0.97]"
    >
      <WhatsappLogo size={24} weight="fill" />
      Book on WhatsApp
    </motion.a>
  );
}

export function Closing() {
  const track = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start end", "end end"],
  });

  const photoShift = useTransform(scrollYProgress, [0, 1], ["-12%", "6%"]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.25, 1.05]);
  const still = Boolean(reduce);

  return (
    <section id="contact" ref={track} className="relative">
      <div className="relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ y: still ? 0 : photoShift, scale: still ? 1.05 : photoScale }}
        >
          <Image
            src="/img/tread-macro.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover contrast-[1.15] saturate-[0.4]"
          />
        </motion.div>
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,19,25,0.84),rgba(16,19,25,0.94))]"
        />
        <div aria-hidden className="tread-field absolute inset-0 opacity-70" />

        <div className="relative mx-auto flex w-full max-w-[1400px] flex-col items-center px-4 py-28 text-center md:px-6 md:py-40">
          <h2 className="max-w-[16ch] font-display text-[clamp(2.6rem,7.5vw,6rem)] leading-[0.94] font-extrabold tracking-[-0.035em] text-balance text-chalk">
            Flat tyre today? Come by.
          </h2>
          <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-slate-soft md:text-lg">
            Send your registration or your tyre size and we will tell you what we
            have, what it costs and when to come in.
          </p>

          <div className="mt-11 flex flex-col items-center gap-4 sm:flex-row">
            <MagneticBook />
            <a
              href={business.phoneHref}
              className="inline-flex h-16 items-center justify-center gap-3 rounded-full border border-carbon-2 px-8 text-lg font-semibold whitespace-nowrap text-chalk transition-colors duration-300 hover:border-hazard hover:text-hazard active:scale-[0.97]"
            >
              <Phone size={21} weight="bold" />
              {business.phone}
            </a>
          </div>
        </div>
      </div>

      <footer className="border-t border-carbon bg-asphalt-2">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-12 px-4 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:px-6 md:py-20">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/img/logo.png"
                alt=""
                width={48}
                height={48}
                className="h-11 w-11 object-contain"
              />
              <span className="font-display text-lg leading-tight font-extrabold tracking-tight text-chalk">
                {business.name}
              </span>
            </div>
            <p className="mt-5 max-w-[38ch] text-sm leading-relaxed text-slate-dim">
              Edinburgh&apos;s local tyre shop since {business.since}. New tyres,
              puncture repairs, balancing and TPMS on Pennywell Road.
            </p>
            <span aria-hidden className="tread-band mt-7 block h-3 w-28 opacity-60" />
          </div>

          <nav aria-label="Footer">
            <h2 className="font-mono text-[11px] tracking-[0.22em] text-slate-dim uppercase">
              On this page
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-slate-soft transition-colors hover:text-hazard"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-[11px] tracking-[0.22em] text-slate-dim uppercase">
              Get in touch
            </h2>
            <ul className="mt-5 flex flex-col gap-3.5 text-sm">
              <li>
                <a
                  href={business.phoneHref}
                  className="inline-flex items-center gap-2.5 text-slate-soft transition-colors hover:text-hazard"
                >
                  <Phone size={16} weight="bold" className="text-hazard" />
                  {business.phone}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink(BOOKING_MESSAGE)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 text-slate-soft transition-colors hover:text-hazard"
                >
                  <WhatsappLogo size={16} weight="fill" className="text-hazard" />
                  {business.mobile}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${business.email}`}
                  className="inline-flex items-center gap-2.5 break-all text-slate-soft transition-colors hover:text-hazard"
                >
                  <EnvelopeSimple size={16} weight="bold" className="text-hazard" />
                  {business.email}
                </a>
              </li>
              <li className="pt-1 text-slate-dim">{fullAddress}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-carbon">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-3 px-4 py-6 text-xs text-slate-dim sm:flex-row sm:items-center sm:justify-between md:px-6">
            <p>
              &copy; {new Date().getFullYear()} {business.name}. Professional
              tyre shop in Edinburgh. All rights reserved.
            </p>
            <a
              href="https://comply.website/"
              target="_blank"
              rel="noreferrer"
              className="shrink-0 underline decoration-slate-dim/60 underline-offset-4 transition-colors hover:text-hazard hover:decoration-hazard"
            >
              Made by Comply
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
}
