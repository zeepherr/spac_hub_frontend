import { useAnimate, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const EASE = [0.22, 1, 0.36, 1];
const STORAGE_KEY = "spechub-brand-intro-v1";

function hasPlayed(key) {
  try {
    return sessionStorage.getItem(key) === "played";
  } catch {
    return false;
  }
}

// Displays only the SH symbol from your original 1959 × 803 image.
// The image itself is not modified or redrawn.
function LogoMark({ src, style }) {
  return (
    <svg
      viewBox="60 95 540 630"
      aria-hidden="true"
      focusable="false"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        ...style,
      }}
    >
      <image href={src} width="1959" height="803" />
    </svg>
  );
}

const layerStyle = {
  position: "absolute",
  inset: 0,
};

export default function BrandIntro({
  children,
  logoSrc = "/spechub-logo.png",
  oncePerSession = true,
  storageKey = STORAGE_KEY,
  onComplete,
}) {
  const [scope, animate] = useAnimate();
  const reducedMotion = useReducedMotion();

  const [visible, setVisible] = useState(
    () => !oncePerSession || !hasPlayed(storageKey),
  );

  const callbackRef = useRef(onComplete);

  useEffect(() => {
    callbackRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!visible) return;

    let cancelled = false;
    let finished = false;
    let controls;
    let imageTimer;
    let watchdog;

    const image = new Image();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function complete() {
      if (cancelled || finished) return;

      finished = true;
      clearTimeout(watchdog);

      if (oncePerSession) {
        try {
          sessionStorage.setItem(storageKey, "played");
        } catch {
          // Storage is optional.
        }
      }

      setVisible(false);
      callbackRef.current?.();
    }

    async function play() {
      try {
        // Begin the timeline only after the real logo has loaded.
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = reject;

          imageTimer = window.setTimeout(reject, 4000);
          image.src = logoSrc;
        });

        clearTimeout(imageTimer);

        if (cancelled) return;

        if (reducedMotion) {
          controls = animate([
            [
              ".brand-color",
              { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" },
              { duration: 0 },
            ],
            [".brand-title", { opacity: 1, y: 0 }, { duration: 0 }],
            [".brand-overlay", { opacity: 0 }, { at: 0.5, duration: 0.2 }],
          ]);
        } else {
          controls = animate([
            // Four overlapping diagonal slices assemble softly.
            ...[0, 1, 2, 3].map((index) => [
              `.brand-piece-${index}`,
              { opacity: [0, 1], x: [8, 0], y: [18, 0] },
              {
                at: index * 0.4,
                duration: 0.95,
                ease: EASE,
              },
            ]),

            // A gentle settling movement, without a bouncing logo.
            [
              ".brand-mark",
              { scale: [0.96, 1], rotate: [-3, 0] },
              { at: 0, duration: 2.5, ease: EASE },
            ],

            // Shadow lengthens, travels, then contracts.
            [
              ".brand-shadow",
              {
                opacity: [0, 0.17, 0.11, 0],
                x: [0, 24, 12, 0],
                y: [0, 30, 15, 0],
              },
              {
                at: 0.25,
                duration: 3.1,
                times: [0, 0.45, 0.75, 1],
                ease: "easeInOut",
              },
            ],

            // Restore the original orange and black artwork.
            [
              ".brand-color",
              {
                opacity: [0, 1],
                clipPath: ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"],
              },
              { at: 2.55, duration: 1.25, ease: EASE },
            ],

            // A narrow highlight passes over the colored logo.
            [
              ".brand-shine",
              {
                opacity: [0, 0.7, 0.7, 0],
                clipPath: [
                  "inset(0% 100% 0% 0%)",
                  "inset(0% 65% 0% 15%)",
                  "inset(0% 15% 0% 65%)",
                  "inset(0% 0% 0% 100%)",
                ],
              },
              {
                at: 3.05,
                duration: 1.05,
                times: [0, 0.25, 0.75, 1],
                ease: "linear",
              },
            ],

            // Title enters after the logo becomes recognizable.
            [
              ".brand-title",
              { opacity: [0, 1], y: [9, 0] },
              { at: 3.55, duration: 0.65, ease: EASE },
            ],

            // Hold the finished brand until 5.25 seconds.
            [
              ".brand-stage",
              { scale: [1, 1.035], y: [0, -5] },
              { at: 5.25, duration: 0.65, ease: EASE },
            ],
            [
              ".brand-overlay",
              { opacity: [1, 0] },
              { at: 5.25, duration: 0.75, ease: "easeInOut" },
            ],
          ]);
        }

        await controls;

        complete();
      } catch {
        // A missing image must never block entry to the website.
        complete();
      }
    }

    // Fallback if an animation or image-loading operation stalls.
    watchdog = window.setTimeout(() => {
      controls?.stop();
      complete();
    }, 12000);

    void play();

    return () => {
      cancelled = true;

      controls?.stop();
      clearTimeout(imageTimer);
      clearTimeout(watchdog);

      image.onload = null;
      image.onerror = null;

      document.body.style.overflow = previousOverflow;
    };
  }, [animate, visible, logoSrc, oncePerSession, storageKey, reducedMotion]);

  return (
    <>
      {/* The website mounts behind the intro and can start loading. */}
      <div inert={visible ? true : undefined}>{children}</div>

      {visible && (
        <div ref={scope}>
          <div
            className="brand-overlay"
            role="status"
            aria-label="Welcome to Spec Hub"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 10000,
              display: "grid",
              placeItems: "center",
              overflow: "hidden",
              background: "#f6f3f2",
              opacity: 1,
            }}
          >
            <div
              className="brand-stage"
              aria-hidden="true"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 24,
              }}
            >
              <div
                className="brand-mark"
                style={{
                  position: "relative",
                  width: "clamp(112px, 22vw, 172px)",
                  aspectRatio: "540 / 630",
                }}
              >
                <div
                  className="brand-shadow"
                  style={{
                    ...layerStyle,
                    opacity: 0,
                    filter: [
                      "brightness(0)",
                      "blur(4px)",
                      "drop-shadow(12px 16px 5px #59514c)",
                      "drop-shadow(20px 24px 10px #59514c)",
                    ].join(" "),
                  }}
                >
                  <LogoMark src={logoSrc} />
                </div>

                {[0, 1, 2, 3].map((index) => {
                  const top = index * 25;
                  const bottom = Math.min(100, top + 26);

                  return (
                    <div
                      key={index}
                      className={`brand-piece-${index}`}
                      style={{
                        ...layerStyle,
                        opacity: 0,
                        clipPath: `polygon(
                          0% ${top}%,
                          100% ${Math.max(0, top - 10)}%,
                          100% ${bottom}%,
                          0% ${Math.min(100, bottom + 10)}%
                        )`,
                      }}
                    >
                      <LogoMark
                        src={logoSrc}
                        style={{
                          filter: [
                            "brightness(0)",
                            "invert(0.95)",
                            "drop-shadow(-1px -1px 0px #ffffff)",
                            "drop-shadow(1px 2px 1px #b9b2ad)",
                          ].join(" "),
                        }}
                      />
                    </div>
                  );
                })}

                <div
                  className="brand-color"
                  style={{
                    ...layerStyle,
                    opacity: 0,
                    clipPath: "inset(0% 100% 0% 0%)",
                  }}
                >
                  <LogoMark src={logoSrc} />
                </div>

                <div
                  className="brand-shine"
                  style={{
                    ...layerStyle,
                    opacity: 0,
                    clipPath: "inset(0% 100% 0% 0%)",
                  }}
                >
                  <LogoMark
                    src={logoSrc}
                    style={{
                      filter: "brightness(0) invert(1) sepia(0.45) saturate(2)",
                    }}
                  />
                </div>
              </div>

              <img
                className="brand-title"
                src="/spec-hub-wordmark.png"
                alt="Spec Hub"
                style={{
                  opacity: 0,
                  width: "clamp(150px, 28vw, 220px)",
                  height: "auto",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
