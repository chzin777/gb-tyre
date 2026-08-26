"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Star } from "@phosphor-icons/react";
import { testimonials } from "@/lib/site";

/**
 * Customer quotes. One at a time, because three short reviews side by side get
 * skimmed as a block and none of them get read.
 */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduce = useReducedMotion();

  function move(step: number) {
    setDirection(step);
    setIndex((current) => (current + step + testimonials.length) % testimonials.length);
  }

  const current = testimonials[index];
  const offset = reduce ? 0 : 44;

  return (
    <section
      aria-label="Customer reviews"
      className="relative overflow-hidden border-b border-carbon bg-asphalt-2 py-24 md:py-32"
    >
      <div
        aria-hidden
        className="tread-field absolute inset-0 opacity-60"
      />

      <div className="relative mx-auto w-full max-w-[900px] px-4 text-center md:px-6">
        <div
          className="flex items-center justify-center gap-1.5"
          aria-label="Rated five out of five on Google"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={19} weight="fill" className="text-hazard" />
          ))}
        </div>

        <div className="relative mt-9 min-h-[240px] md:min-h-[210px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.figure
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: direction * offset }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -offset }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <blockquote className="font-display text-[clamp(1.5rem,3.6vw,2.6rem)] leading-[1.24] font-bold tracking-[-0.02em] text-balance text-chalk">
                “{current.quote}”
              </blockquote>
              <figcaption className="mt-7 text-sm text-slate-soft">
                <span className="font-semibold text-chalk">{current.name}</span>
                <span className="mx-2 text-slate-dim">/</span>
                {current.place}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous review"
            className="inline-flex size-11 items-center justify-center rounded-full border border-carbon text-slate-soft transition-colors hover:border-hazard hover:text-hazard active:scale-95"
          >
            <ArrowLeft size={17} weight="bold" />
          </button>
          <span className="font-mono text-xs text-slate-dim">
            {index + 1} of {testimonials.length}
          </span>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next review"
            className="inline-flex size-11 items-center justify-center rounded-full border border-carbon text-slate-soft transition-colors hover:border-hazard hover:text-hazard active:scale-95"
          >
            <ArrowRight size={17} weight="bold" />
          </button>
        </div>
      </div>
    </section>
  );
}
