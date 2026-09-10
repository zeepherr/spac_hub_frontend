import AuthAside from "../components/auth/AuthAside";
import Header from "../components/auth/AuthHeader";
import AuthPageTransition from "../components/motion/AuthPageTransition";

function AuthLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[linear-gradient(180deg,rgba(59,130,246,0.12)_0%,transparent_35%),linear-gradient(0deg,rgba(59,130,246,0.12)_0%,transparent_35%),linear-gradient(180deg,#fafafa_0%,#f0f0f0_100%)]">
      <Header />
      <div className="grid min-h-0 flex-1 lg:grid-cols-2">
        <AuthAside />
        <div className="flex items-center justify-center overflow-y-auto p-4">
          <AuthPageTransition />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
