import { useId } from "react";
import { useMotionOk } from "@/lib/use-motion-ok";

/**
 * A looping line-drawing laid over each process swatch, one per stage:
 * fibres drift, loops form, dye rises, finish catches the light, a stitch runs, the pack is
 * tied, the route is travelled. Pure SVG + CSS; the global reduced-motion rule stops the CSS
 * loops, and the one SMIL animation is only rendered when motion is allowed.
 */
export function StageMotion({ index }: { index: number }) {
  const motionOk = useMotionOk();
  const uid = useId().replace(/:/g, "");
  const line = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    vectorEffect: "non-scaling-stroke" as const,
  };

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full text-indigo/70"
    >
      {index === 0 &&
        // Responsible fibres: strands drifting
        [18, 30, 42, 54, 66, 78].map((y, i) => (
          <path
            key={y}
            {...line}
            strokeWidth={1.4}
            style={{
              animation: `stage-drift ${6 + i * 1.3}s ease-in-out ${i * -0.9}s infinite`,
              opacity: 0.55 + (i % 3) * 0.15,
            }}
            d={`M-8 ${y} C 14 ${y - 9}, 34 ${y + 9}, 54 ${y - 3} S 90 ${y + 7}, 108 ${y}`}
          />
        ))}

      {index === 1 &&
        // Knitting: rows of loops forming one stitch after another
        [0, 1, 2].flatMap((row) =>
          Array.from({ length: 8 }, (_, col) => {
            const x = 10 + col * 11.5 + (row % 2) * 5.75;
            const y = 34 + row * 16;
            return (
              <path
                key={`${row}-${col}`}
                {...line}
                strokeWidth={2.4}
                pathLength={1}
                strokeDasharray={1}
                style={{
                  animation: `stage-stitch 6s ease-in-out ${(row * 8 + col) * 0.16}s infinite`,
                  strokeDashoffset: 1,
                }}
                d={`M${x - 4} ${y - 7} L${x} ${y + 2} L${x + 4} ${y - 7}`}
              />
            );
          }),
        )}

      {index === 2 && (
        // Green dyeing: colour rising through the cloth
        <g className="text-vat">
          <defs>
            <linearGradient id={`dye${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity="0" />
              <stop offset="0.5" stopColor="currentColor" stopOpacity="0.55" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill={`url(#dye${uid})`}
            style={{
              transformBox: "fill-box",
              animation: "stage-wash 7s cubic-bezier(0.45, 0, 0.55, 1) infinite",
            }}
          />
        </g>
      )}

      {index === 3 && (
        // Functional finishing: light catching the finished cloth
        <g className="text-bleach">
          <defs>
            <linearGradient id={`sheen${uid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="currentColor" stopOpacity="0" />
              <stop offset="0.5" stopColor="currentColor" stopOpacity="0.6" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect
            x="0"
            y="-10"
            width="32"
            height="120"
            fill={`url(#sheen${uid})`}
            style={{
              transformBox: "fill-box",
              animation: "stage-sweep 5.5s cubic-bezier(0.45, 0, 0.55, 1) infinite",
            }}
          />
        </g>
      )}

      {index === 4 && (
        // Cut and sew: a running stitch and the needle that makes it
        <g className="text-indigo">
          <path
            {...line}
            strokeWidth={2.2}
            strokeDasharray="5 4"
            style={{ animation: "stage-dash 1.4s linear infinite" }}
            d="M-4 50 L104 50"
          />
          <path {...line} strokeWidth={1.2} strokeDasharray="1 3" opacity={0.6} d="M-4 62 L104 62" />
          <g style={{ animation: "stage-needle 6s linear infinite" }}>
            <path {...line} strokeWidth={2} d="M0 41 L0 50" />
            <circle cx="0" cy="40" r="1.7" fill="currentColor" />
          </g>
        </g>
      )}

      {index === 5 && (
        // Responsible packaging: the pack being tied
        <g>
          {[
            "M-4 38 L104 38",
            "M-4 62 L104 62",
            "M38 -4 L38 104",
            "M62 -4 L62 104",
          ].map((d, i) => (
            <path
              key={d}
              {...line}
              strokeWidth={2}
              pathLength={1}
              strokeDasharray={1}
              style={{
                animation: `stage-stitch 6.5s ease-in-out ${i * 0.5}s infinite`,
                strokeDashoffset: 1,
              }}
              d={d}
            />
          ))}
        </g>
      )}

      {index === 6 && (
        // Global delivery: the route, travelled
        <g>
          <path
            {...line}
            strokeWidth={1.6}
            strokeDasharray="2 4"
            d="M6 74 C 26 30, 52 86, 70 44 S 92 24, 96 22"
          />
          <circle cx="6" cy="74" r="2.2" fill="currentColor" />
          <circle cx="96" cy="22" r="2.2" fill="none" stroke="currentColor" strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
          {motionOk ? (
            <circle r="3" className="fill-cochineal">
              <animateMotion
                dur="7s"
                repeatCount="indefinite"
                keyTimes="0;1"
                calcMode="spline"
                keySplines="0.45 0 0.55 1"
                path="M6 74 C 26 30, 52 86, 70 44 S 92 24, 96 22"
              />
            </circle>
          ) : (
            <circle cx="52" cy="58" r="3" className="fill-cochineal" />
          )}
        </g>
      )}
    </svg>
  );
}
