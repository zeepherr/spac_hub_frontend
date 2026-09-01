import HomeStore from "@/components/auth/HomeStore";
import { LogoutButton } from "@/components/auth/LogoutButton";
import useAuthStore from "@/stores/auth.store";

function HomePage() {
  const user = useAuthStore((store) => store.user);
  console.log(user);
  // let isOpne = true;
  // if (isOpne) return <GlobalLoading />;

  return (
    <div>
      HomePage
      {user && <LogoutButton />}
      <HomeStore />
    </div>
  );
}

export default HomePage;
