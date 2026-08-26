"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";

/**
 * Magic bento grid, adapted from the ReactBits component.
 *
 * Two deliberate departures from the original: the glow runs on the brand's
 * safety orange rather than the demo purple, and every card carries real copy
 * instead of placeholder feature names.
 */

export type BentoCard = {
  label: string;
  stat: string;
  title: string;
  description: string;
};

const GLOW = "249, 115, 22";
const SPOTLIGHT_RADIUS = 400;
const PARTICLE_COUNT = 12;

function createParticle(x: number, y: number) {
  const el = document.createElement("div");
  el.className = "bento-particle";
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${GLOW}, 1);
    box-shadow: 0 0 6px rgba(${GLOW}, 0.6);
    pointer-events: none;
    z-index: 3;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
}

function setGlow(
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  intensity: number,
) {
  const rect = card.getBoundingClientRect();
  card.style.setProperty(
    "--glow-x",
    `${((mouseX - rect.left) / rect.width) * 100}%`,
  );
  card.style.setProperty(
    "--glow-y",
    `${((mouseY - rect.top) / rect.height) * 100}%`,
  );
  card.style.setProperty("--glow-intensity", intensity.toString());
  card.style.setProperty("--glow-radius", `${SPOTLIGHT_RADIUS}px`);
}

/** A single card: sparks on hover, ripples on click. */
function ParticleCard({
  children,
  className = "",
  still,
}: {
  children: ReactNode;
  className?: string;
  still: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hoveredRef = useRef(false);
  const seedsRef = useRef<HTMLDivElement[]>([]);

  const clearParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    liveRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => particle.parentNode?.removeChild(particle),
      });
    });
    liveRef.current = [];
  }, []);

  const spawnParticles = useCallback(() => {
    const host = cardRef.current;
    if (!host || !hoveredRef.current) return;

    if (seedsRef.current.length === 0) {
      const { width, height } = host.getBoundingClientRect();
      seedsRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(Math.random() * width, Math.random() * height),
      );
    }

    seedsRef.current.forEach((seed, index) => {
      const timeoutId = setTimeout(() => {
        if (!hoveredRef.current || !cardRef.current) return;

        const clone = seed.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        liveRef.current.push(clone);

        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
        );
        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });
        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, []);

  useEffect(() => {
    const element = cardRef.current;
    if (!element || still) return;

    function onEnter() {
      hoveredRef.current = true;
      spawnParticles();
    }

    function onLeave() {
      hoveredRef.current = false;
      clearParticles();
    }

    function onClick(event: MouseEvent) {
      const host = cardRef.current;
      if (!host) return;

      const rect = host.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const reach = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      );

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        width: ${reach * 2}px;
        height: ${reach * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${GLOW}, 0.32) 0%, rgba(${GLOW}, 0.16) 30%, transparent 70%);
        left: ${x - reach}px;
        top: ${y - reach}px;
        pointer-events: none;
        z-index: 4;
      `;
      host.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        },
      );
    }

    element.addEventListener("mouseenter", onEnter);
    element.addEventListener("mouseleave", onLeave);
    element.addEventListener("click", onClick);

    return () => {
      hoveredRef.current = false;
      element.removeEventListener("mouseenter", onEnter);
      element.removeEventListener("mouseleave", onLeave);
      element.removeEventListener("click", onClick);
      clearParticles();
    };
  }, [spawnParticles, clearParticles, still]);

  return (
    <div ref={cardRef} className={className}>
      {children}
    </div>
  );
}

/** One cursor-following pool of light shared by the whole grid. */
function GlobalSpotlight({
  gridRef,
  still,
}: {
  gridRef: React.RefObject<HTMLDivElement | null>;
  still: boolean;
}) {
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || still) return;

    const spotlight = document.createElement("div");
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${GLOW}, 0.14) 0%,
        rgba(${GLOW}, 0.07) 15%,
        rgba(${GLOW}, 0.035) 25%,
        rgba(${GLOW}, 0.018) 40%,
        rgba(${GLOW}, 0.008) 65%,
        transparent 70%
      );
      z-index: 3;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);

    const proximity = SPOTLIGHT_RADIUS * 0.5;
    const fadeDistance = SPOTLIGHT_RADIUS * 0.75;

    function onMove(event: MouseEvent) {
      const section = grid?.closest(".bento-section");
      const rect = section?.getBoundingClientRect();
      const cards = grid?.querySelectorAll<HTMLElement>(".bento-card") ?? [];

      const inside =
        rect &&
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!inside) {
        gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: "power2.out" });
        cards.forEach((card) => card.style.setProperty("--glow-intensity", "0"));
        return;
      }

      let nearest = Infinity;

      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const distance = Math.max(
          0,
          Math.hypot(
            event.clientX - (cardRect.left + cardRect.width / 2),
            event.clientY - (cardRect.top + cardRect.height / 2),
          ) - Math.max(cardRect.width, cardRect.height) / 2,
        );

        nearest = Math.min(nearest, distance);

        let intensity = 0;
        if (distance <= proximity) {
          intensity = 1;
        } else if (distance <= fadeDistance) {
          intensity = (fadeDistance - distance) / (fadeDistance - proximity);
        }

        setGlow(card, event.clientX, event.clientY, intensity);
      });

      gsap.to(spotlight, {
        left: event.clientX,
        top: event.clientY,
        duration: 0.1,
        ease: "power2.out",
      });

      const targetOpacity =
        nearest <= proximity
          ? 0.8
          : nearest <= fadeDistance
            ? ((fadeDistance - nearest) / (fadeDistance - proximity)) * 0.8
            : 0;

      gsap.to(spotlight, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: "power2.out",
      });
    }

    function onLeave() {
      grid
        ?.querySelectorAll<HTMLElement>(".bento-card")
        .forEach((card) => card.style.setProperty("--glow-intensity", "0"));
      gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: "power2.out" });
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      spotlight.parentNode?.removeChild(spotlight);
    };
  }, [gridRef, still]);

  return null;
}

export function MagicBento({
  cards,
  still = false,
}: {
  cards: BentoCard[];
  still?: boolean;
}) {
  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bento-section relative">
      <GlobalSpotlight gridRef={gridRef} still={still} />

      <div ref={gridRef} className="bento-grid">
        {cards.map((card) => (
          <ParticleCard
            key={card.title}
            still={still}
            className="bento-card group relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-[20px] border border-carbon bg-asphalt-2 p-6 transition-transform duration-300 ease-out hover:-translate-y-1 md:p-7"
          >
            <span className="relative z-[2] font-mono text-[11px] tracking-[0.22em] text-hazard uppercase">
              {card.label}
            </span>

            <div className="relative z-[2]">
              <p className="font-display text-[clamp(2.4rem,4.4vw,3.6rem)] leading-none font-extrabold tracking-[-0.04em] text-chalk">
                {card.stat}
              </p>
              <h3 className="mt-4 font-display text-lg font-extrabold tracking-tight text-chalk">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-soft">
                {card.description}
              </p>
            </div>
          </ParticleCard>
        ))}
      </div>
    </div>
  );
}
