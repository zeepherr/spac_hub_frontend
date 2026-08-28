import { LogoutButton } from "@/components/auth/LogoutButton";
import useAuthStore from "@/stores/auth.store";
import { Navigate } from "react-router";

function HomePage() {
  const user = useAuthStore((store) => store.user);
  console.log(user);
  if (!user) return <Navigate to={"/login"} replace />;
  return (
    <div>
      HomePage
      <LogoutButton />
    </div>
  );
}

export default HomePage;
