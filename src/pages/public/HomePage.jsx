import CategorySidebar from "@/components/auth/CatagorySidebar";
import HomeStore from "@/components/auth/HomeStore";
import { LogoutButton } from "@/components/auth/LogoutButton";
import useAuthStore from "@/stores/auth.store";

function HomePage() {
  const user = useAuthStore((store) => store.user);
  console.log(user);
  // let isOpne = true;
  // if (isOpne) return <GlobalLoading />;

  return (
    <div className="p-2">
      <div className="grid grid-cols-1 px-5 gap-6 lg:grid-cols-[280px_1fr]">
        <CategorySidebar />
        <HomeStore />
      </div>
    </div>
  );
}

export default HomePage;
