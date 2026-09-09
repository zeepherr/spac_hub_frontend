import { AnimatePresence, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import AuthInitializer from "./components/auth/AuthInitializer";
import BrandIntro from "./components/branding/BrandIntro";
import router from "./routes/App.route";

function App() {
  const shouldReduceMotion = useReducedMotion();
  const [showIntro, setShowIntro] = useState(() => {
    return sessionStorage.getItem("spechub:intro-seen") !== "true";
  });

  useEffect(() => {
    if (!showIntro) return;

    const timer = setTimeout(() => {
      sessionStorage.setItem("spechub:intro-seen", "true");

      setShowIntro(false);
    }, shouldReduceMotion ? 600 : 1850);

    return () => clearTimeout(timer);
  }, [showIntro, shouldReduceMotion]);
  return (
    <main>
      <Toaster />
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
      <AnimatePresence>
        {showIntro && <BrandIntro key="brand-intro" />}
      </AnimatePresence>
    </main>
  );
}

export default App;
