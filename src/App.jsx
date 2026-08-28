import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import AuthInitializer from "./components/auth/AuthInitializer";
import router from "./routes/App.route";

function App() {
  return (
    <main>
      <Toaster />
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
    </main>
  );
}

export default App;
