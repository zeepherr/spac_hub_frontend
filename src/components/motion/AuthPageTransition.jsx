import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocation, useOutlet } from "react-router";

function AuthPageTransition() {
  const location = useLocation();
  const outlet = useOutlet();
  const shouldReduceMotion = useReducedMotion();

  const initial = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, x: 12 };
  const animate = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, x: 0 };
  const exit = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, x: -8 };
  const ease = [0.16, 1, 0.3, 1];

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={initial}
        animate={{ ...animate, transition: { duration: 0.22, ease } }}
        exit={{ ...exit, transition: { duration: 0.12, ease } }}
        className="flex min-h-full w-full items-center justify-center"
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}

export default AuthPageTransition;
