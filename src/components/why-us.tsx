"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { reasons } from "@/lib/site";
import { MagicBento } from "./magic-bento";

const STATEMENT =
  "Ten years on Pennywell Road. We tell you what the tyre needs, quote it before we touch it, and have you moving again the same day.";

/**
 * Why choose us. The statement decodes word by word as the section scrolls,
 * which paces the claim instead of dropping it in one block. The proof sits
 * below in a bento grid that lights up under the cursor.
 */
export function WhyUs() {
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start 0.85", "end 0.55"],
  });

  const words = STATEMENT.split(" ");

  return (
    <section
      id="why"
      className="relative overflow-hidden border-b border-carbon py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        <div ref={track} className="max-w-[900px]">
          <p className="font-display text-[clamp(1.6rem,3.4vw,2.9rem)] leading-[1.2] font-extrabold tracking-[-0.02em]">
            {words.map((word, i) => {
              const start = i / words.length;
              const end = start + 1 / words.length;
              return (
                <Word
                  key={`${word}-${i}`}
                  progress={scrollYProgress}
                  range={[start, end]}
                  still={Boolean(reduce)}
                >
                  {word}
                </Word>
              );
            })}
          </p>
        </div>

        <div className="mt-16 md:mt-20">
          <MagicBento cards={reasons} still={Boolean(reduce)} />
        </div>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
  still,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
  still: boolean;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);

  return (
    <>
      <motion.span
        className="mv-opacity text-chalk"
        style={
          { "--mv-opacity": still ? 1 : opacity } as React.CSSProperties
        }
      >
        {children}
      </motion.span>{" "}
    </>
  );
}
