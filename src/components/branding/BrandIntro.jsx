import { motion, useReducedMotion } from "motion/react";

const ease = [0.16, 1, 0.3, 1];
const logoPath = "/spechub-logo.png";

export default function BrandIntro() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed inset-0 z-9999 flex items-center justify-center overflow-hidden bg-white"
      role="img"
      aria-label="SPEC HUB"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: {
          duration: shouldReduceMotion ? 0.15 : 0.35,
          ease,
        },
      }}
    >
      <motion.div
        className="relative w-[min(88vw,760px)]"
        style={{
          aspectRatio: "1959 / 803",
        }}
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                scale: 0.97,
              }
        }
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: shouldReduceMotion ? 0.15 : 0.7,
          ease,
        }}
      >
        {/* Logo reveal */}
        <motion.div
          className="absolute inset-0"
          initial={
            shouldReduceMotion
              ? false
              : {
                  clipPath: "inset(0 100% 0 0)",
                }
          }
          animate={{
            clipPath: "inset(0 0% 0 0)",
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.8,
            delay: shouldReduceMotion ? 0 : 0.12,
            ease,
          }}
        >
          <img
            src={logoPath}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className="size-full object-contain"
          />
        </motion.div>

        {/* Orange sweep */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute inset-x-[5%] bottom-[10%] h-0.5 bg-orange-500"
            initial={{
              scaleX: 0,
              opacity: 0,
            }}
            animate={{
              scaleX: [0, 1, 1],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 0.9,
              delay: 0.2,
              times: [0, 0.65, 1],
              ease,
            }}
            style={{
              transformOrigin: "left center",
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
