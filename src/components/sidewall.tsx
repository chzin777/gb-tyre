"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { CaretDown, WhatsappLogo } from "@phosphor-icons/react";
import { sizeOptions, whatsappLink } from "@/lib/site";
import { Reveal } from "./reveal";

/**
 * The 3D tyre is roughly 1.4 MB of geometry plus the WebGL runtime, so it is
 * split out of the main bundle and only requested once the section is close to
 * the viewport.
 */
const Tyre3D = dynamic(() => import("./tyre-3d"), { ssr: false });

type Axis = "width" | "profile" | "rim";

/** Loads the model only when the reader is within a screen of the section. */
function useNearViewport<T extends HTMLElement>() {
  const stageRef = useRef<T>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = stageRef.current;
    if (!node || near) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [near]);

  return { stageRef, near };
}

const AXIS_COPY: Record<Axis, { label: string; means: string }> = {
  width: { label: "Width", means: "Tread width in millimetres" },
  profile: { label: "Profile", means: "Sidewall height as a % of the width" },
  rim: { label: "Rim", means: "Wheel diameter in inches" },
};

/**
 * One number of the sidewall code, as a control. The three of them sit in a row
 * with the real separators between, so the panel reads as the code stamped on
 * the tyre rather than as a form.
 */
function Picker({
  axis,
  value,
  options,
  onChange,
}: {
  axis: Axis;
  value: number;
  options: number[];
  onChange: (next: number) => void;
}) {
  const copy = AXIS_COPY[axis];
  const id = `tyre-${axis}`;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-mono text-[10px] tracking-[0.2em] text-slate-dim uppercase"
      >
        {copy.label}
      </label>

      <div className="group relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          title={copy.means}
          className="tyre-select w-full cursor-pointer appearance-none rounded-[14px] border border-carbon bg-asphalt py-2.5 pr-7 pl-3 font-mono text-[clamp(1.25rem,3.8vw,2.2rem)] leading-none font-medium text-hazard transition-colors duration-200 hover:border-carbon-2 hover:bg-rubber focus-visible:border-hazard sm:pr-9 sm:pl-4"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <CaretDown
          size={13}
          weight="bold"
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-dim transition-colors group-hover:text-hazard sm:right-3.5"
        />
      </div>
    </div>
  );
}

/** The `/` and `R` that sit between the three numbers on a real sidewall. */
function Separator({ children }: { children: string }) {
  return (
    <span
      aria-hidden
      className="shrink-0 self-end pb-2.5 font-mono text-[clamp(1.25rem,3.8vw,2.2rem)] leading-none text-slate-dim"
    >
      {children}
    </span>
  );
}

/**
 * Tyre size decoder. Everybody with a flat tyre is asked "what size is it?" and
 * most people have never read the code on their sidewall. This draws it to scale
 * from the real numbers, then hands the size straight to the booking message.
 */
export function Sidewall() {
  const [width, setWidth] = useState(205);
  const [profile, setProfile] = useState(55);
  const [rim, setRim] = useState(16);
  const reduce = useReducedMotion();

  const { stageRef, near: stageReady } = useNearViewport<HTMLDivElement>();

  const geometry = useMemo(() => {
    const sidewallMm = (width * profile) / 100;
    const rimMm = rim * 25.4;
    const overallMm = rimMm + sidewallMm * 2;
    return {
      sidewallMm: Math.round(sidewallMm),
      rimMm: Math.round(rimMm),
      overallMm: Math.round(overallMm),
      rollingCm: Math.round((Math.PI * overallMm) / 10),
    };
  }, [width, profile, rim]);

  const sizeCode = `${width}/${profile} R${rim}`;

  return (
    <section
      id="size"
      className="relative overflow-hidden border-b border-carbon py-24 md:py-32"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(80%_60%_at_78%_50%,rgba(249,115,22,0.09),transparent_65%)]"
      />

      <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-14 px-4 md:px-6 lg:grid-cols-[1fr_minmax(0,520px)] lg:gap-20">
        <div>
          <Reveal>
            <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] leading-[0.98] font-extrabold tracking-[-0.03em] text-chalk">
              Read your tyre,
              <br />
              then send us the size
            </h2>
            <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-slate-soft">
              The three numbers are printed on the side of every tyre you own.
              Set them here to see what you are running, then send it over.
            </p>
          </Reveal>

          <Reveal index={1}>
            <div className="mt-8 rounded-[20px] border border-carbon bg-asphalt-2 p-5 sm:mt-9 sm:p-7">
              <p className="font-mono text-[11px] tracking-[0.22em] text-hazard uppercase">
                Your tyre size
              </p>

              <div className="mt-4 flex items-end gap-1.5 sm:mt-5 sm:gap-3">
                <div className="min-w-0 flex-1">
                  <Picker
                    axis="width"
                    value={width}
                    options={sizeOptions.width}
                    onChange={setWidth}
                  />
                </div>
                <Separator>/</Separator>
                <div className="min-w-0 flex-1">
                  <Picker
                    axis="profile"
                    value={profile}
                    options={sizeOptions.profile}
                    onChange={setProfile}
                  />
                </div>
                <Separator>R</Separator>
                <div className="min-w-0 flex-1">
                  <Picker
                    axis="rim"
                    value={rim}
                    options={sizeOptions.rim}
                    onChange={setRim}
                  />
                </div>
              </div>

              <a
                href={whatsappLink(
                  `Hi GB Tyre Services, I need tyres in ${sizeCode}. What do you have in stock?`,
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-hazard px-6 text-base font-bold whitespace-nowrap text-asphalt transition-all duration-300 hover:bg-hazard-soft hover:shadow-[0_16px_38px_-16px_rgba(249,115,22,0.9)] active:scale-[0.97] sm:mt-7 sm:w-auto"
              >
                <WhatsappLogo size={21} weight="fill" />
                Send {sizeCode}
              </a>
            </div>
          </Reveal>
        </div>

        <figure
          ref={stageRef}
          className="relative flex flex-col"
          aria-label={`A ${sizeCode} tyre, ${geometry.overallMm} millimetres across`}
        >
          <div className="relative h-[340px] w-full sm:h-[420px]">
            {stageReady ? (
              <Tyre3D diameterMm={geometry.overallMm} reduced={Boolean(reduce)} />
            ) : (
              <div
                aria-hidden
                className="absolute top-1/2 left-1/2 size-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-carbon bg-[radial-gradient(circle_at_40%_32%,#2b3340,#12161d)]"
              />
            )}
          </div>

          <p className="mt-1 text-center text-xs text-slate-dim">
            Drag the tyre to turn it
          </p>

          <figcaption className="mt-6 grid grid-cols-3 gap-4 border-t border-carbon pt-6">
            <div>
              <p className="font-mono text-xl text-chalk">
                {geometry.sidewallMm}
                <span className="text-sm text-slate-dim"> mm</span>
              </p>
              <p className="mt-1 text-xs text-slate-dim">Sidewall height</p>
            </div>
            <div>
              <p className="font-mono text-xl text-chalk">
                {geometry.overallMm}
                <span className="text-sm text-slate-dim"> mm</span>
              </p>
              <p className="mt-1 text-xs text-slate-dim">Overall diameter</p>
            </div>
            <div>
              <p className="font-mono text-xl text-chalk">
                {geometry.rollingCm}
                <span className="text-sm text-slate-dim"> cm</span>
              </p>
              <p className="mt-1 text-xs text-slate-dim">One full turn</p>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
