import styles from "./PikeCorner.module.css";

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

export default function PikeCorner() {
  return (
    <svg
      className={styles.pike}
      viewBox="0 0 240 100"
      role="img"
      aria-label="Illustration of a big pike"
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
          <path
            d="M4,54 C16,49 32,44 56,40 C86,33 118,29 144,32 C168,35 187,41 197,47
               L197,59 C186,65 168,71 146,74 C118,78 88,76 62,70 C40,65 18,60 4,54 Z"
          />
        </clipPath>
      </defs>

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

      {/* body */}
      <path
        d="M4,54
           C16,49 32,44 56,40
           C86,33 118,29 144,32
           C168,35 187,41 197,47
           L197,59
           C186,65 168,71 146,74
           C118,78 88,76 62,70
           C40,65 18,60 4,54 Z"
        fill="url(#pikeBody)"
        stroke="#253814"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* flank markings, clipped so none spill past the outline */}
      <g clipPath="url(#pikeBodyClip)" fill="#e8f0a8" opacity="0.6">
        {SPOTS.map((s) => (
          <ellipse key={`${s.cx}-${s.cy}`} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} />
        ))}
      </g>

      {/* long duck-billed jaw, the pike's signature profile */}
      <path
        d="M4,54 C18,56 34,59 50,62"
        fill="none"
        stroke="#253814"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

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
    </svg>
  );
}
