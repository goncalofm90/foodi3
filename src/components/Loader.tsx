// CocktailLoader.tsx
export default function CocktailLoader() {
  return (
    <div className="flex flex-col items-center">
      <svg
        className="w-20 h-28"
        viewBox="0 0 64 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stem 1/3 taller (y2 increased) */}
        <line
          x1="32"
          y1="40"
          x2="32"
          y2="60"
          stroke="#78716c"
          strokeWidth="2"
        />
        <line
          x1="24"
          y1="60"
          x2="40"
          y2="60"
          stroke="#78716c"
          strokeWidth="2"
        />

        {/* Glass bowl outline */}
        <path
          d="M12 12 L32 40 L52 12 Z"
          stroke="#78716c"
          strokeWidth="2"
          fill="none"
        />

        {/* ClipPath for liquid */}
        <clipPath id="glass-clip">
          <path d="M12 12 L32 40 L52 12 Z" />
        </clipPath>

        {/* Liquid with sloshy wave */}
        <path fill="#bfa094" clipPath="url(#glass-clip)">
          <animate
            attributeName="d"
            dur="2s"
            repeatCount="indefinite"
            values="
              M12,40 Q20,21 32,23 Q44,21 52,22 L52,40 L12,40 Z;
              M12,40 Q20,19 32,22 Q44,20 52,23 L52,40 L12,40 Z;
              M12,40 Q20,22 32,20 Q44,22 52,21 L52,40 L12,40 Z;
              M12,40 Q20,21 32,23 Q44,21 52,22 L52,40 L12,40 Z
            "
          />
        </path>
      </svg>

      <span className="text-sm text-neutral-500 font-medium">Loading...</span>
    </div>
  );
}
