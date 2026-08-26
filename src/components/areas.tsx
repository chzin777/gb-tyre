"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Clock, MapPin, NavigationArrow } from "@phosphor-icons/react";
import { areas, business, fullAddress, openingHours } from "@/lib/site";
import { Reveal } from "./reveal";

/**
 * Where we cover. The area names drift at a slightly different rate to the panel
 * beside them, so the two columns read as separate planes rather than one block.
 */
export function Areas() {
  const track = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start end", "end start"],
  });

  const namesShift = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  const panelShift = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  const still = Boolean(reduce);

  return (
    <section
      id="areas"
      ref={track}
      className="relative overflow-hidden border-b border-carbon py-24 md:py-32"
    >
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-14 px-4 md:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-16">
        <motion.div style={{ y: still ? 0 : namesShift }}>
          <Reveal>
            <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] leading-[0.98] font-extrabold tracking-[-0.03em] text-chalk">
              Edinburgh
              <br />
              and the Lothians
            </h2>
            <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-slate-soft">
              The workshop is easy to reach from every part of the city, with
              parking outside. Fleet rates available.
            </p>
          </Reveal>

          <ul className="mt-9 flex flex-wrap gap-2.5">
            {areas.map((area, i) => (
              <Reveal key={area} index={i} as="li" distance={14}>
                <span className="inline-flex items-center gap-2 rounded-full border border-carbon bg-asphalt-2 px-4 py-2.5 text-sm text-slate-soft transition-colors hover:border-hazard hover:text-chalk">
                  <MapPin size={15} weight="fill" className="text-hazard" />
                  {area}
                </span>
              </Reveal>
            ))}
          </ul>
        </motion.div>

        <motion.div style={{ y: still ? 0 : panelShift }}>
          <Reveal index={1} distance={30}>
            <div className="overflow-hidden rounded-[20px] border border-carbon bg-asphalt-2">
              <div className="border-b border-carbon p-7 md:p-8">
                <p className="font-mono text-[11px] tracking-[0.22em] text-hazard uppercase">
                  The workshop
                </p>
                <p className="mt-4 font-display text-2xl leading-tight font-extrabold tracking-tight text-chalk">
                  {business.street}
                  <br />
                  {business.city} {business.postcode}
                </p>
                <a
                  href={business.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-hazard transition-colors hover:text-hazard-soft"
                >
                  <NavigationArrow size={16} weight="fill" />
                  Open in Maps
                </a>
              </div>

              <div className="p-7 md:p-8">
                <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-slate-dim uppercase">
                  <Clock size={14} weight="bold" />
                  Opening hours
                </p>
                <dl className="mt-5 flex flex-col gap-3.5">
                  {openingHours.map((slot) => (
                    <div
                      key={slot.days}
                      className="flex items-baseline justify-between gap-4"
                    >
                      <dt className="text-sm text-slate-soft">{slot.days}</dt>
                      <dd className="font-mono text-sm text-chalk">
                        {slot.opens
                          ? `${slot.opens} to ${slot.closes}`
                          : "Closed"}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 border-t border-carbon pt-5 text-sm text-slate-dim">
                  Walk-ins welcome throughout. Address for satnav:{" "}
                  <span className="text-slate-soft">{fullAddress}</span>
                </p>
              </div>
            </div>
          </Reveal>
        </motion.div>
      </div>
    </section>
  );
}
