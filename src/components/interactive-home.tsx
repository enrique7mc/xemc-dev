"use client";

import Link from "next/link";
import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "@/app/page.module.css";

type Position = {
  x: number;
  y: number;
};

type DragTarget = "terminal" | "notes";
type MotionVars = CSSProperties & Record<`--${string}`, string>;

const entryPoints = [
  {
    href: "/projects",
    index: "[01]",
    title: "Projects",
    description: "Selected products, experiments, and builds. Shipped or shipping.",
  },
  {
    href: "/blog",
    index: "[02]",
    title: "Blog",
    description: "What I'm learning about agents, shipping apps, and building with AI tools.",
  },
  {
    href: "/contact",
    index: "[03]",
    title: "Contact",
    description: "Let's build something. Open to collaborations and interesting problems.",
  },
];

const stack = ["AI agents / MCP / automation", "Next.js / TypeScript", "SwiftUI Native Apps", "--dangerously-skip-permissions"];

const buildNotes = [
  "Agent memory and tool orchestration",
  "Indie apps",
  "Build things you'd never have time for",
];

const dragLimits: Record<DragTarget, Position> = {
  terminal: { x: 150, y: 110 },
  notes: { x: 120, y: 95 },
};

const SPOTLIGHT_DEFAULT = {
  x: 50,
  y: 27,
  alpha: 0.16,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mediaQuery.matches);

    sync();
    mediaQuery.addEventListener("change", sync);

    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  return reduced;
}

function toTranslate(x: number, y: number): CSSProperties {
  return {
    transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`,
  };
}

function withDelay(delay: number): MotionVars {
  return {
    "--delay": `${delay}ms`,
  };
}

export default function InteractiveHome() {
  const containerRef = useRef<HTMLElement | null>(null);
  const dragRef = useRef<{
    target: DragTarget;
    pointerId: number;
    start: Position;
    origin: Position;
  } | null>(null);

  const reducedMotion = useReducedMotion();

  const [canInteract, setCanInteract] = useState(false);
  const [pointer, setPointer] = useState<Position>({ x: 0, y: 0 });
  const [terminalPosition, setTerminalPosition] = useState<Position>({ x: 0, y: 0 });
  const [notesPosition, setNotesPosition] = useState<Position>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 940px) and (pointer: fine)");
    const sync = () => setCanInteract(mediaQuery.matches && !reducedMotion);

    sync();
    mediaQuery.addEventListener("change", sync);

    return () => mediaQuery.removeEventListener("change", sync);
  }, [reducedMotion]);

  const markVisible = useCallback((id: string) => {
    setVisibleIds((previous) => {
      if (previous.has(id)) {
        return previous;
      }

      const next = new Set(previous);
      next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    const root = containerRef.current;

    if (!root) {
      return;
    }

    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal-id]"));

    if (targets.length === 0) {
      return;
    }

    if (reducedMotion) {
      const ids = targets
        .map((target) => target.dataset.revealId)
        .filter((id): id is string => Boolean(id));

      setVisibleIds(new Set(ids));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const id = entry.target.getAttribute("data-reveal-id");

          if (id) {
            markVisible(id);
          }

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [markVisible, reducedMotion]);

  useEffect(() => {
    if (!canInteract) {
      return;
    }

    let frame = 0;

    const handlePointerMove = (event: PointerEvent) => {
      if (dragRef.current || dragging) {
        return;
      }

      const width = Math.max(window.innerWidth, 1);
      const height = Math.max(window.innerHeight, 1);
      const x = (event.clientX / width - 0.5) * 2;
      const y = (event.clientY / height - 0.5) * 2;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setPointer({
          x: clamp(x, -1, 1),
          y: clamp(y, -1, 1),
        });
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [canInteract, dragging]);

  const startDrag = (target: DragTarget) => (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!canInteract) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    dragRef.current = {
      target,
      pointerId: event.pointerId,
      start: {
        x: event.clientX,
        y: event.clientY,
      },
      origin: target === "terminal" ? terminalPosition : notesPosition,
    };

    setDragging(true);
  };

  const moveDrag = (target: DragTarget) => (event: ReactPointerEvent<HTMLButtonElement>) => {
    const activeDrag = dragRef.current;

    if (!activeDrag || activeDrag.pointerId !== event.pointerId || activeDrag.target !== target) {
      return;
    }

    const bounds = dragLimits[target];
    const deltaX = event.clientX - activeDrag.start.x;
    const deltaY = event.clientY - activeDrag.start.y;

    const nextPosition = {
      x: clamp(activeDrag.origin.x + deltaX, -bounds.x, bounds.x),
      y: clamp(activeDrag.origin.y + deltaY, -bounds.y, bounds.y),
    };

    if (target === "terminal") {
      setTerminalPosition(nextPosition);
      return;
    }

    setNotesPosition(nextPosition);
  };

  const endDrag = (target: DragTarget) => (event: ReactPointerEvent<HTMLButtonElement>) => {
    const activeDrag = dragRef.current;

    if (!activeDrag || activeDrag.pointerId !== event.pointerId || activeDrag.target !== target) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragRef.current = null;
    setDragging(false);
  };

  const revealClass = (id: string) => `${styles.reveal} ${visibleIds.has(id) ? styles.revealVisible : ""}`;
  const activePointer = canInteract ? pointer : { x: 0, y: 0 };
  const isDragging = dragging && canInteract;
  const spotX = SPOTLIGHT_DEFAULT.x + activePointer.x * 48;
  const spotY = SPOTLIGHT_DEFAULT.y + activePointer.y * 36;

  useEffect(() => {
    const root = document.documentElement;
    const alpha = canInteract ? 0.18 : SPOTLIGHT_DEFAULT.alpha;

    root.style.setProperty("--spot-x", `${spotX}%`);
    root.style.setProperty("--spot-y", `${spotY}%`);
    root.style.setProperty("--spot-alpha", alpha.toString());
  }, [canInteract, spotX, spotY]);

  useEffect(() => {
    return () => {
      const root = document.documentElement;
      root.style.setProperty("--spot-x", `${SPOTLIGHT_DEFAULT.x}%`);
      root.style.setProperty("--spot-y", `${SPOTLIGHT_DEFAULT.y}%`);
      root.style.setProperty("--spot-alpha", SPOTLIGHT_DEFAULT.alpha.toString());
    };
  }, []);

  const heroStyle = toTranslate(activePointer.x * -10, activePointer.y * -8);

  const terminalStyle = toTranslate(
    (canInteract ? terminalPosition.x : 0) + activePointer.x * 16,
    (canInteract ? terminalPosition.y : 0) + activePointer.y * 10,
  );

  const notesStyle = toTranslate(
    (canInteract ? notesPosition.x : 0) + activePointer.x * -14,
    (canInteract ? notesPosition.y : 0) + activePointer.y * 7,
  );

  return (
    <article
      ref={containerRef}
      className={styles.home}
      data-dragging={isDragging}
    >
      <section data-reveal-id="hero" className={`${styles.heroWrap} ${revealClass("hero")}`} style={withDelay(60)}>
        <div className={styles.hero} style={heroStyle}>
          <p className={styles.eyebrow}>Software Engineer / Builder / Currently shipping</p>
          <h1 className={styles.headline}>
            <span>Software with a point of view.</span>
            <span>Built end to end,</span>
            <span>shipped for real.</span>
          </h1>
          <p className={styles.lede}>
            Full-stack engineer exploring the edge of what one person can build with modern AI tooling. Currently shipping apps and experimenting with agents & automation.
          </p>
          <div className={styles.heroLinks}>
            <Link href="/projects">Browse projects</Link>
            <Link href="/contact">Start a conversation</Link>
          </div>
        </div>
      </section>

      <aside
        data-reveal-id="terminal"
        className={`${styles.windowWrap} ${styles.terminalWrap} ${revealClass("terminal")}`}
        style={withDelay(140)}
      >
        <div className={styles.window} style={terminalStyle}>
          <div className={styles.windowBar}>
            <button
              type="button"
              className={styles.windowHandle}
              onPointerDown={startDrag("terminal")}
              onPointerMove={moveDrag("terminal")}
              onPointerUp={endDrag("terminal")}
              onPointerCancel={endDrag("terminal")}
              onLostPointerCapture={endDrag("terminal")}
              aria-label="Drag terminal panel"
            >
              <span className={styles.windowDots} aria-hidden>
                <span />
                <span />
                <span />
              </span>
              <span>terminal / now</span>
              <span className={styles.windowStatus}>{canInteract ? "drag" : "fixed"}</span>
            </button>
          </div>
          <div className={styles.windowBody}>
            <pre className={styles.codeBlock}>
              {`$ cat PHILOSOPHY.md
> ship before it's perfect
> build what you'd actually use
> AI is the multiplier, not the product`}
            </pre>
            <ul className={styles.stackList}>
              {stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      <aside
        data-reveal-id="notes"
        className={`${styles.windowWrap} ${styles.notesWrap} ${revealClass("notes")}`}
        style={withDelay(220)}
      >
        <div className={`${styles.window} ${styles.notesWindow}`} style={notesStyle}>
          <div className={styles.windowBar}>
            <button
              type="button"
              className={styles.windowHandle}
              onPointerDown={startDrag("notes")}
              onPointerMove={moveDrag("notes")}
              onPointerUp={endDrag("notes")}
              onPointerCancel={endDrag("notes")}
              onLostPointerCapture={endDrag("notes")}
              aria-label="Drag build notes panel"
            >
              <span className={styles.windowDots} aria-hidden>
                <span />
                <span />
                <span />
              </span>
              <span>interests / now</span>
              <span className={styles.windowStatus}>{canInteract ? "drag" : "fixed"}</span>
            </button>
          </div>
          <div className={styles.windowBody}>
            <ul className={styles.noteList}>
              {buildNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      <section className={styles.entries}>
        {entryPoints.map((entry, index) => {
          const revealId = `entry-${index + 1}`;
          const driftX = canInteract ? activePointer.x * (index - 1) * 4 : 0;
          const driftY = canInteract ? activePointer.y * (index === 1 ? 4 : 3) : 0;

          return (
            <div
              key={entry.href}
              data-reveal-id={revealId}
              className={`${styles.entrySlot} ${revealClass(revealId)}`}
              style={withDelay(280 + index * 80)}
            >
              <Link href={entry.href} className={styles.entryCard} style={toTranslate(driftX, driftY)}>
                <p className={styles.entryIndex}>{entry.index}</p>
                <h2>{entry.title}</h2>
                <p>{entry.description}</p>
                <span className={styles.entryArrow}>Open</span>
              </Link>
            </div>
          );
        })}
      </section>
    </article>
  );
}
