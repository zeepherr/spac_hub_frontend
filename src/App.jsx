import { Toaster } from "@/components/ui/sonner";
import { RouterProvider } from "react-router";
import { CartFlyAnimationProvider } from "./components/animation/CartFlyAnimationProvider";
import AuthInitializer from "./components/auth/AuthInitializer";
import BrandIntro from "./components/branding/BrandIntro";
import router from "./routes/App.route";

function App() {
  return (
    <main>
      <BrandIntro>
        <Toaster />
        <CartFlyAnimationProvider>
          <AuthInitializer>
            <RouterProvider router={router} />
          </AuthInitializer>
        </CartFlyAnimationProvider>
      </BrandIntro>
    </main>
  );
}

export default App;
