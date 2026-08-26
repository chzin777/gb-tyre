"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { List, Phone, WhatsappLogo, X } from "@phosphor-icons/react";
import {
  business,
  fullAddress,
  hoursByDay,
  nav,
  openingHours,
  whatsappLink,
} from "@/lib/site";

const BOOKING_MESSAGE = "Hi GB Tyre Services, I would like to book a slot.";

/** Reads the workshop's real opening window against the visitor's clock. */
function useOpenNow() {
  const [state, setState] = useState<{ open: boolean; label: string } | null>(
    null,
  );

  useEffect(() => {
    function evaluate() {
      const now = new Date();
      const window = hoursByDay[now.getDay()];
      if (!window) {
        setState({ open: false, label: "Closed today" });
        return;
      }
      const hour = now.getHours() + now.getMinutes() / 60;
      const open = hour >= window.open && hour < window.close;
      setState({
        open,
        label: open ? `Open until ${window.close}:00` : "Closed right now",
      });
    }

    evaluate();
    const timer = setInterval(evaluate, 60_000);
    return () => clearInterval(timer);
  }, []);

  return state;
}

/**
 * Navigation. At the top of the page it runs edge to edge with no container at
 * all; once the reader moves it collapses into a compact island floating in the
 * middle, dropping everything except the links and the one action that matters.
 * The hairline across the very top is the page's own scroll position, drawn in
 * the same tread pattern used elsewhere.
 */
export function SiteNav() {
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const openNow = useOpenNow();

  const progress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.0008,
  });

  useMotionValueEvent(scrollY, "change", (value) => {
    setCondensed(value > 90);
  });

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <>
      <header
        className="pointer-events-none fixed inset-x-0 top-0"
        style={{ zIndex: "var(--z-nav)" }}
      >
        <motion.div
          aria-hidden
          className="tread-band h-[3px] origin-left"
          style={{ scaleX: reduce ? 0 : progress }}
        />

        <nav
          aria-label="Main"
          className={`pointer-events-auto mx-auto flex items-center transition-[max-width,padding,margin,gap,background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            condensed
              ? "mt-3 max-w-[min(94vw,790px)] gap-1 rounded-full border border-carbon bg-asphalt/80 px-2.5 py-2 shadow-[0_22px_50px_-28px_rgba(0,0,0,1)] backdrop-blur-xl md:px-3"
              : "mt-0 max-w-[1400px] gap-6 rounded-none border border-transparent bg-transparent px-4 py-5 md:px-6 md:py-7"
          }`}
        >
          <a
            href="#top"
            className="group flex shrink-0 items-center gap-2.5"
            aria-label={`${business.name}, back to top`}
          >
            <span className="relative grid size-10 place-items-center overflow-hidden rounded-full border border-carbon bg-asphalt-2">
              <Image
                src="/img/logo.png"
                alt=""
                width={40}
                height={40}
                priority
                className="size-8 object-contain"
              />
            </span>
            <span
              aria-hidden={condensed}
              className={`grid transition-[grid-template-columns,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                condensed
                  ? "grid-cols-[0fr] opacity-0"
                  : "grid-cols-[1fr] opacity-100"
              }`}
            >
              <span className="overflow-hidden font-display text-[15px] leading-none font-extrabold whitespace-nowrap text-chalk">
                GB Tyre Services
              </span>
            </span>
          </a>

          <ul
            className={`hidden items-center lg:flex ${
              condensed ? "mx-auto gap-0.5" : "mx-auto gap-2"
            }`}
          >
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative rounded-full px-3.5 py-2 text-sm font-medium text-slate-soft transition-colors hover:text-chalk"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
            <div
              aria-hidden={condensed}
              className={`hidden transition-[grid-template-columns,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:grid ${
                condensed
                  ? "pointer-events-none grid-cols-[0fr] opacity-0"
                  : "grid-cols-[1fr] opacity-100"
              }`}
            >
              <div className="flex items-center gap-4 overflow-hidden whitespace-nowrap">
                {openNow ? (
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className={`size-1.5 shrink-0 rounded-full ${
                        openNow.open ? "bg-hazard beacon" : "bg-slate-dim"
                      }`}
                    />
                    <span className="font-mono text-[11px] tracking-wide text-slate-soft">
                      {openNow.label}
                    </span>
                  </span>
                ) : null}

                <a
                  href={business.phoneHref}
                  tabIndex={condensed ? -1 : undefined}
                  className="pr-1 text-sm font-semibold text-chalk transition-colors hover:text-hazard"
                >
                  {business.phone}
                </a>
              </div>
            </div>

            <a
              href={whatsappLink(BOOKING_MESSAGE)}
              target="_blank"
              rel="noreferrer"
              aria-label="Book on WhatsApp"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-hazard px-4 text-sm font-bold whitespace-nowrap text-asphalt transition-colors duration-200 hover:bg-hazard-soft active:scale-[0.97] md:px-5"
            >
              <WhatsappLogo size={18} weight="fill" />
              <span className="hidden sm:inline">Book on WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="inline-flex size-11 items-center justify-center rounded-full border border-carbon text-chalk transition-colors hover:bg-rubber lg:hidden"
            >
              <List size={20} weight="bold" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="fixed inset-0 flex flex-col bg-asphalt/98 px-5 py-5 backdrop-blur-xl lg:hidden"
            style={{ zIndex: "var(--z-nav)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div aria-hidden className="tread-field absolute inset-0 opacity-70" />

            <div className="relative flex h-11 items-center justify-between">
              <span className="font-mono text-[11px] tracking-[0.22em] text-slate-dim uppercase">
                {business.city} {business.postcode}
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex size-11 items-center justify-center rounded-full border border-carbon text-chalk"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <ul className="relative mt-8 flex flex-col">
              {nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.4, ease }}
                  className="border-b border-carbon"
                >
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-4 font-display text-[2rem] leading-tight font-extrabold tracking-[-0.03em] text-chalk"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="relative mt-auto pt-8">
              <dl className="flex flex-col gap-2 border-b border-carbon pb-6">
                {openingHours.map((slot) => (
                  <div
                    key={slot.days}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <dt className="text-sm text-slate-dim">{slot.days}</dt>
                    <dd className="font-mono text-sm text-slate-soft">
                      {slot.opens ? `${slot.opens} to ${slot.closes}` : "Closed"}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-sm text-slate-dim">{fullAddress}</p>

              <a
                href={business.phoneHref}
                className="mt-5 flex h-14 items-center justify-center gap-2.5 rounded-full border border-carbon-2 text-base font-semibold text-chalk"
              >
                <Phone size={19} weight="bold" className="text-hazard" />
                {business.phone}
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
