"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, Phone, WhatsappLogo } from "@phosphor-icons/react";
import { business, whatsappLink } from "@/lib/site";

/**
 * Hero. The workshop photo starts as a narrow slot and opens across the screen
 * as the section scrolls, while the two halves of the headline part to let it
 * through. The aperture is doing the storytelling: the bay door rolling open.
 *
 * Scroll is read through Motion's `useScroll` against a tall pinned track, so
 * nothing hijacks the wheel and the page still scrolls normally with a keyboard,
 * a trackpad or a screen reader. The CTAs sit below the aperture from the first
 * frame, so nobody has to scroll to find them.
 */
export function Hero() {
  const track = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });

  // 1 is the closed slot, 0 is wide open. Read by the `.aperture` clip in CSS.
  const aperture = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const photoScale = useTransform(scrollYProgress, [0, 0.7], [1.12, 1]);
  const leftShift = useTransform(scrollYProgress, [0, 0.7], ["0%", "-31%"]);
  const rightShift = useTransform(scrollYProgress, [0, 0.7], ["0%", "31%"]);
  const eyebrowFade = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
  const scrimOpacity = useTransform(scrollYProgress, [0.15, 0.7], [0.35, 0.95]);
  const treadShift = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  const still = Boolean(reduce);

  return (
    <section
      id="top"
      ref={track}
      className="relative h-[250vh]"
      aria-label={`${business.name}, tyre fitting in Edinburgh`}
    >
      <div className="sticky top-0 flex h-[100dvh] flex-col overflow-hidden bg-asphalt">
        {/*
          Background is built in three layers: a real tread photograph pushed
          right back, a warm pool of light where the aperture sits, then a heavy
          vignette so the edges of the screen fall away into the workshop.
        */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 -top-[12%] h-[124%]"
          style={{ y: still ? "0%" : treadShift }}
        >
          {/*
            The blur, grayscale and contrast are baked into this file. Running
            them as CSS filters on a full-screen image cost about half the frame
            budget while the hero was scrolling.
          */}
          <Image
            src="/img/tread-blur.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-125 object-cover opacity-[0.15]"
          />
        </motion.div>

        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(78%_56%_at_50%_42%,rgba(249,115,22,0.2),rgba(249,115,22,0.05)_45%,transparent_72%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(105%_88%_at_50%_44%,transparent_18%,rgba(16,19,25,0.6)_52%,rgba(16,19,25,0.98)_100%)]"
        />
        <div aria-hidden className="tread-field absolute inset-0 opacity-60" />

        {/*
          Aperture. It is the full hero from the start and a clip keeps it shut
          to a narrow slot, so opening it fills the screen rather than growing a
          card in the middle of the page.
        */}
        <motion.div
          className="aperture absolute inset-0 overflow-hidden bg-rubber shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)]"
          style={
            {
              "--aperture": still ? 0 : aperture,
            } as React.CSSProperties
          }
        >
          <motion.div
            className="absolute inset-0"
            style={{ scale: still ? 1 : photoScale }}
          >
            <Image
              src="/img/tyre-wall.jpg"
              alt="Racks of new car tyres stacked at the GB Tyre Services workshop"
              fill
              priority
              sizes="100vw"
              quality={92}
              className="object-cover"
            />
          </motion.div>
          <motion.div
            aria-hidden
            className="mv-opacity absolute inset-0 bg-[linear-gradient(180deg,rgba(16,19,25,0.82)_0%,rgba(16,19,25,0.42)_34%,rgba(16,19,25,0.72)_62%,rgba(16,19,25,0.94)_84%,rgba(16,19,25,0.99)_100%)]"
            style={
              {
                "--mv-opacity": still ? 0.95 : scrimOpacity,
              } as React.CSSProperties
            }
          />
        </motion.div>

        <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-4 pt-20 pb-6 sm:pt-24 md:px-6 md:pb-12">
          <motion.p
            className="mv-opacity text-center font-mono text-[11px] tracking-[0.28em] text-hazard uppercase md:text-xs"
            style={
              { "--mv-opacity": still ? 1 : eyebrowFade } as React.CSSProperties
            }
          >
            Tyre shop in Edinburgh since {business.since}
          </motion.p>

          {/* Headline parts as the aperture opens, letting the photo through. */}
          <h1 className="pointer-events-none my-auto flex flex-col items-center justify-center text-center">
            <motion.span
              className="font-display text-[clamp(2.5rem,8.2vw,6.4rem)] leading-[0.94] font-extrabold tracking-[-0.03em] text-chalk [text-shadow:0_6px_26px_rgba(16,19,25,0.95)]"
              style={{ x: still ? "-31%" : leftShift }}
            >
              Tyres fitted
            </motion.span>
            <motion.span
              className="font-display text-[clamp(2.5rem,8.2vw,6.4rem)] leading-[0.94] font-extrabold tracking-[-0.03em] text-hazard [text-shadow:0_6px_26px_rgba(16,19,25,0.95)]"
              style={{ x: still ? "31%" : rightShift }}
            >
              while you wait
            </motion.span>
          </h1>

          <div className="mx-auto flex w-full max-w-[1080px] flex-col items-center gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-[30ch] text-center text-sm leading-relaxed text-balance text-slate-soft sm:max-w-[38ch] md:text-left md:text-base">
              New tyres, punctures and balancing on Pennywell Road. Walk in, or
              send your size and we will have it ready.
            </p>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <a
                href={whatsappLink(
                  "Hi GB Tyre Services, I would like to book a slot.",
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-hazard px-7 text-base font-bold whitespace-nowrap text-asphalt transition-all duration-300 hover:bg-hazard-soft hover:shadow-[0_16px_38px_-16px_rgba(249,115,22,0.9)] active:scale-[0.97]"
              >
                <WhatsappLogo size={21} weight="fill" />
                Book on WhatsApp
              </a>
              <a
                href={business.phoneHref}
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full border border-carbon-2 bg-asphalt-2/70 px-7 text-base font-semibold whitespace-nowrap text-chalk backdrop-blur transition-colors duration-300 hover:border-hazard hover:text-hazard active:scale-[0.97]"
              >
                <Phone size={19} weight="bold" />
                {business.phone}
              </a>
            </div>
          </div>
        </div>

        <a
          href="#services"
          aria-label="Skip to services"
          className="mx-auto mb-6 hidden size-10 shrink-0 items-center justify-center rounded-full border border-carbon text-slate-dim transition-colors hover:border-hazard hover:text-hazard md:flex"
        >
          <ArrowDown size={16} weight="bold" />
        </a>
      </div>
    </section>
  );
}
