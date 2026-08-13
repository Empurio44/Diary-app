import styles from "./PikeCorner.module.css";

/** The little baitfish the pike goes after. Purely decorative — never tappable. */
export default function PreyFish() {
  return (
    <svg
      className={styles.prey}
      viewBox="0 0 120 60"
      role="img"
      aria-label="A smaller fish darting away"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="preyBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4b8cbe" />
          <stop offset="55%" stopColor="#8fbcdc" />
          <stop offset="100%" stopColor="#e9f2f8" />
        </linearGradient>
      </defs>

      <g fill="#9cc3dd" stroke="#2c5674" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M52,16 C60,6 70,4 77,7 C74,11 72,14 70,17 Z" />
        <path d="M50,45 C56,53 64,56 70,53 C68,49 66,46 64,44 Z" />
        <path d="M95,30 L119,12 C113,21 113,39 119,48 Z" />
      </g>

      <path
        d="M10,30 C18,18 38,11 62,14 C78,16 90,21 97,30
           C90,39 78,44 62,46 C38,49 18,42 10,30 Z"
        fill="url(#preyBody)"
        stroke="#2c5674"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <circle cx="25" cy="27" r="3.6" fill="#f6fbfe" stroke="#2c5674" strokeWidth="1.2" />
      <circle cx="25.6" cy="27" r="1.8" fill="#16283a" />
    </svg>
  );
}
