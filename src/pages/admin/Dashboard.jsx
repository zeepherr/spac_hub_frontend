import { LogoutButton } from "@/components/auth/LogoutButton";
import useAuthStore from "@/stores/auth.store";

function Dashboard() {
  const user = useAuthStore((state) => state.user);
  return (
    <div>
      Dashboard
      {user && <LogoutButton />}
    </div>
  );
}

export default Dashboard;
