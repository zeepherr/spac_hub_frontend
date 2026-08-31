import { LogoutButton } from "@/components/auth/LogoutButton";
import useAuthStore from "@/stores/auth.store";

function HomePage() {
  const user = useAuthStore((store) => store.user);
  // let isOpne = true;
  // if (isOpne) return <GlobalLoading />;

  return (
    <div>
      HomePage
      <LogoutButton />
    </div>
  );
}

export default HomePage;
