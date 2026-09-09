import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import AuthInitializer from "./components/auth/AuthInitializer";
import { CartFlyAnimationProvider } from "./components/animation/CartFlyAnimationProvider";
import router from "./routes/App.route";

function App() {
  return (
    <main>
      <Toaster />
      <CartFlyAnimationProvider>
        <AuthInitializer>
          <RouterProvider router={router} />
        </AuthInitializer>
      </CartFlyAnimationProvider>
    </main>
  );
}

export default App;
