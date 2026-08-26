"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger position when several Reveals sit in the same group. */
  index?: number;
  /** Distance travelled on entry, in pixels. */
  distance?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
};

/**
 * Entry animation used across the page: content arrives from below as it enters
 * the viewport, once. It communicates reading order, so a reader's eye lands on
 * the first item of a group before the last one has settled.
 */
export function Reveal({
  children,
  index = 0,
  distance = 26,
  className,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.7,
        delay: reduce ? 0 : index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </Tag>
  );
}
