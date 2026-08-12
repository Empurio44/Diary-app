import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./PikeCorner.module.css";

/** idle, mouth agape (scrolling down), or dancing (scrolling up) */
type Mode = "idle" | "mouth" | "dance";

const EDGE = 8;
const MOBILE_MAX = 860;
/** on mobile the bottom tab bar owns the lower strip */
const MOBILE_BOTTOM = 78;

/**
 * The body, with the lower jaw cut away so the jaw can hinge separately.
 * Its front-bottom edge is the mouth line, which sits high on the head — a
 * pike's gape reaches back past the eye, and the height is what gives the
 * lower jaw enough mass to reveal a dark maw when it drops.
 */
const BODY_D = `M4,54
  C16,49 32,44 56,40
  C86,33 118,29 144,32
  C168,35 187,41 197,47
  L197,59
  C186,65 168,71 146,74
  C118,78 88,76 62,70
  C60,67 58,64 56,61
  C38,58 20,56 4,54 Z`;

/** the hinged lower jaw: mouth line on top, the pike's underside below */
const JAW_D = `M56,61
  C38,58 20,56 4,54
  C18,60 40,65 62,70
  C60,67 58,64 56,61 Z`;

/** Light bean-shaped flank markings in rows — the pike's giveaway pattern */
const SPOTS = [
  { cx: 92, cy: 41, rx: 10, ry: 3.6 },
  { cx: 114, cy: 37, rx: 11, ry: 3.8 },
  { cx: 137, cy: 36, rx: 10, ry: 3.8 },
  { cx: 158, cy: 39, rx: 9, ry: 3.4 },
  { cx: 176, cy: 43, rx: 7, ry: 3 },
  { cx: 82, cy: 52, rx: 9, ry: 3.6 },
  { cx: 104, cy: 50, rx: 11, ry: 4 },
  { cx: 127, cy: 49, rx: 11, ry: 4 },
  { cx: 149, cy: 50, rx: 10, ry: 3.8 },
  { cx: 169, cy: 52, rx: 8, ry: 3.2 },
  { cx: 184, cy: 54, rx: 6, ry: 2.6 },
  { cx: 92, cy: 62, rx: 9, ry: 3.4 },
  { cx: 114, cy: 63, rx: 10, ry: 3.6 },
  { cx: 137, cy: 63, rx: 10, ry: 3.6 },
  { cx: 158, cy: 61, rx: 8, ry: 3.2 },
  { cx: 176, cy: 59, rx: 6, ry: 2.6 },
];

/** teeth along the mouth line: upper point down, lower point up */
const UPPER_TEETH =
  "M14,55.3 L18,55.9 L15.5,59.2 Z M26,56.9 L30,57.5 L27.5,60.8 Z M38,58.5 L42,59.1 L39.5,62.4 Z";
const LOWER_TEETH =
  "M20,56.1 L24,56.7 L22.5,53 Z M32,57.7 L36,58.3 L34.5,54.6 Z M44,59.3 L48,59.9 L46.5,56.2 Z";

interface Point {
  x: number;
  y: number;
}

function isMobile(): boolean {
  return window.innerWidth <= MOBILE_MAX;
}

function bottomInset(): number {
  return isMobile() ? MOBILE_BOTTOM : 16;
}

function homePoint(w: number, h: number): Point {
  return {
    x: Math.max(EDGE, window.innerWidth - w - (isMobile() ? 10 : 20)),
    y: Math.max(EDGE, window.innerHeight - h - bottomInset()),
  };
}

function randomPoint(w: number, h: number): Point {
  const maxX = Math.max(EDGE, window.innerWidth - w - EDGE);
  const maxY = Math.max(EDGE, window.innerHeight - h - bottomInset());
  return {
    x: EDGE + Math.random() * (maxX - EDGE),
    y: EDGE + Math.random() * (maxY - EDGE),
  };
}

export default function PikeCorner() {
  const rootRef = useRef<HTMLDivElement>(null);
  const posRef = useRef<Point>({ x: 0, y: 0 });

  const [pos, setPos] = useState<Point>({ x: 0, y: 0 });
  const [travel, setTravel] = useState(0);
  const [facingRight, setFacingRight] = useState(false);
  const [floating, setFloating] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");

  const measure = useCallback(() => {
    const el = rootRef.current;
    return el ? { w: el.offsetWidth, h: el.offsetHeight } : { w: 220, h: 92 };
  }, []);

  const moveTo = useCallback((p: Point, ms: number) => {
    posRef.current = p;
    setTravel(ms);
    setPos(p);
  }, []);

  const goHome = useCallback(
    (ms: number) => {
      const { w, h } = measure();
      setFacingRight(false);
      moveTo(homePoint(w, h), ms);
    },
    [measure, moveTo]
  );

  // park in the corner before first paint
  useLayoutEffect(() => {
    goHome(0);
  }, [goHome]);

  // keep it on screen when the viewport changes
  useEffect(() => {
    const onResize = () => {
      if (floating) {
        const { w, h } = measure();
        moveTo(randomPoint(w, h), 900);
      } else {
        goHome(0);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [floating, goHome, measure, moveTo]);

  // while floating, hop to a new spot each time it arrives
  useEffect(() => {
    if (!floating) return;
    let timer: ReturnType<typeof setTimeout>;

    const hop = () => {
      const { w, h } = measure();
      const target = randomPoint(w, h);
      const from = posRef.current;
      const distance = Math.hypot(target.x - from.x, target.y - from.y);
      const ms = Math.min(4200, Math.max(1400, distance * 6));
      setFacingRight(target.x > from.x);
      moveTo(target, ms);
      timer = setTimeout(hop, ms + 200);
    };

    hop();
    return () => clearTimeout(timer);
  }, [floating, measure, moveTo]);

  // scroll down opens the mouth, scroll up starts the dance
  useEffect(() => {
    let lastY = window.scrollY;
    let reset: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      if (Math.abs(dy) < 2) return;
      lastY = y;
      setMode(dy > 0 ? "mouth" : "dance");
      clearTimeout(reset);
      reset = setTimeout(() => setMode("idle"), 450);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(reset);
    };
  }, []);

  const handleTap = () => {
    if (floating) {
      setFloating(false);
      goHome(1200);
    } else {
      setFloating(true);
    }
  };

  const motionClass = mode === "dance" ? styles.dancing : floating ? styles.swimming : "";

  return (
    <div
      ref={rootRef}
      className={styles.root}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        ["--travel" as string]: `${travel}ms`,
      }}
    >
      <div className={`${styles.facing} ${facingRight ? styles.facingRight : ""}`}>
        <div className={motionClass}>
          <svg
            className={styles.pike}
            viewBox="0 0 240 100"
            role="img"
            aria-label={
              floating ? "A big pike swimming around the screen. Tap to send it back." : "A big pike. Tap it to set it loose."
            }
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="pikeBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2e441b" />
                <stop offset="36%" stopColor="#5d7d31" />
                <stop offset="66%" stopColor="#a6a95a" />
                <stop offset="100%" stopColor="#e8e2b6" />
              </linearGradient>
              <linearGradient id="pikeFin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8a7233" />
                <stop offset="100%" stopColor="#c9b064" />
              </linearGradient>
              <clipPath id="pikeBodyClip">
                <path d={BODY_D} />
              </clipPath>
            </defs>

            {/* one group, so the hit area is the fish itself and not its bounding box */}
            <g className={styles.hit} onClick={handleTap}>
              {/* fins sit under the body so they read as emerging from it */}
              <g fill="url(#pikeFin)" stroke="#57471d" strokeWidth="1.5" strokeLinejoin="round">
                {/* dorsal — set far back, as on a real pike */}
                <path d="M134,31 C147,15 164,8 176,12 C179,25 183,36 188,44 Z" />
                {/* anal fin, mirroring the dorsal */}
                <path d="M142,73 C150,88 161,94 171,91 C174,79 179,67 185,61 Z" />
                {/* pelvic */}
                <path d="M100,72 C105,85 114,91 124,89 C124,81 127,75 130,70 Z" />
                {/* pectoral, just behind the gill */}
                <path d="M68,64 C72,79 82,85 92,83 C90,75 90,69 91,64 Z" />
                {/* deeply forked tail */}
                <path d="M196,46 L237,16 C229,35 229,68 237,86 L196,59 C203,55 203,50 196,46 Z" />
              </g>

              {/* the maw: a static dark copy of the jaw, revealed as the jaw swings open */}
              <path d={JAW_D} fill="#5e2119" />
              {/* upper teeth, hidden behind the closed jaw */}
              <path d={UPPER_TEETH} fill="#f6f1dc" />

              {/* hinged lower jaw (drawn under the body so its teeth tuck away when shut) */}
              <g className={`${styles.jaw} ${mode === "mouth" ? styles.jawOpen : ""}`}>
                <path d={JAW_D} fill="url(#pikeBody)" stroke="#253814" strokeWidth="1.6" strokeLinejoin="round" />
                <path d={LOWER_TEETH} fill="#f6f1dc" />
              </g>

              <path d={BODY_D} fill="url(#pikeBody)" stroke="#253814" strokeWidth="1.6" strokeLinejoin="round" />

              {/* flank markings, clipped so none spill past the outline */}
              <g clipPath="url(#pikeBodyClip)" fill="#e8f0a8" opacity="0.6">
                {SPOTS.map((s) => (
                  <ellipse key={`${s.cx}-${s.cy}`} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} />
                ))}
              </g>

              {/* gill cover — clipped so the arc never spills past the outline */}
              <path
                d="M64,34 C58,46 58,58 64,72"
                clipPath="url(#pikeBodyClip)"
                fill="none"
                stroke="#253814"
                strokeWidth="1.5"
              />

              {/* eye, set well back behind the long snout */}
              <circle cx="47" cy="47" r="4.4" fill="#f4e9bd" stroke="#253814" strokeWidth="1.3" />
              <circle cx="47.8" cy="47" r="2.1" fill="#18200e" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
