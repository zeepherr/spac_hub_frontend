import { useMyCart } from "@/hook/cart/useMyCart";
import { useDebounce } from "@/hook/listing/useBounce";
import { useListingSearch } from "@/hook/listing/useListingSearch";
import useAuthStore from "@/stores/auth.store";
import {
  Cpu,
  Heart,
  RefreshCw,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";

function Logo() {
  return (
    <Link to="/" className="flex shrink-0 flex-col items-start">
      <span className="flex items-center text-2xl font-black tracking-tight">
        <span className="matte mr-2 flex h-8 w-8 items-center justify-center rounded-lg">
          <Cpu className="h-5 w-5 text-[#f97316]" strokeWidth={2} />
        </span>
        SPEC<span className="text-[#f97316]">HUB</span>
      </span>
      <span className="hardware-label ml-10 -mt-1 text-[10px] normal-case text-secondary">
        Used Tech. Trusted Performance.
      </span>
    </Link>
  );
}

function getCoverImageUrl(listing) {
  const images = listing?.images ?? [];
  const cover = images.find((image) => image.isCover) ?? images[0];

  return cover?.imageUrl;
}

function SearchForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  const debouncedSearch = useDebounce(searchTerm, 300);

  const {
    data: results = [],
    isFetching,
    isError,
  } = useListingSearch(debouncedSearch);

  const canShowDropdown = isOpen && searchTerm.trim().length >= 2;

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;

    setSearchTerm(value);
    setIsOpen(value.trim().length >= 2);
  };

  const handleSelectListing = (listingId) => {
    setSearchTerm("");
    setIsOpen(false);

    navigate(`/products/${listingId}`);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (results.length > 0) {
      handleSelectListing(results[0].id);
    }
  };

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-2xl">
      <form
        onSubmit={handleSubmit}
        className="flex w-full overflow-hidden rounded-full border border-neutral-200 bg-neutral-50"
      >
        <div className="relative min-w-0 flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => {
              if (searchTerm.trim().length >= 2) {
                setIsOpen(true);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setIsOpen(false);
              }
            }}
            placeholder="Search products, brands, models..."
            autoComplete="off"
            className="w-full bg-transparent px-5 py-3 pr-10 text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
            >
              <X size={17} />
            </button>
          )}
        </div>

        <button
          type="submit"
          aria-label="Search"
          className="flex w-14 shrink-0 items-center justify-center bg-[#f97316] text-white transition hover:bg-orange-600"
        >
          <Search size={20} />
        </button>
      </form>

      {canShowDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-2 shadow-xl">
          {isFetching ? (
            <p className="px-3 py-4 text-sm text-neutral-500">Searching...</p>
          ) : isError ? (
            <p className="px-3 py-4 text-sm text-red-600">
              Search failed. Please try again.
            </p>
          ) : results.length === 0 ? (
            <p className="px-3 py-4 text-sm text-neutral-500">
              No products found.
            </p>
          ) : (
            results.map((listing) => {
              const imageUrl = getCoverImageUrl(listing);
              const price = Number(listing.price);

              return (
                <button
                  key={listing.id}
                  type="button"
                  onClick={() => handleSelectListing(listing.id)}
                  className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition hover:bg-orange-50"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={listing.title}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Cpu size={28} className="text-neutral-300" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-neutral-900">
                      {listing.title}
                    </p>

                    <p className="truncate text-xs text-neutral-500">
                      {[listing.brand, listing.model]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>

                    {listing.category?.name && (
                      <p className="mt-1 truncate text-xs text-neutral-400">
                        {listing.category.name}
                      </p>
                    )}
                  </div>

                  <p className="shrink-0 text-sm font-bold text-[#f97316]">
                    ฿{price.toLocaleString()}
                  </p>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

const navLinkClass = ({ isActive }) =>
  `hover:text-[#f97316] ${isActive ? "text-[#f97316]" : "text-neutral-700"}`;

const iconLinkClass = ({ isActive }) =>
  `flex items-center gap-1.5 hover:text-[#f97316] ${
    isActive ? "text-[#f97316]" : "text-neutral-700"
  }`;

function AuthLinks() {
  return (
    <div className="flex items-center gap-1.5 text-neutral-700">
      <User size={18} />
      <NavLink to="/login" className={navLinkClass}>
        Register
      </NavLink>
      <span> / </span>
      <NavLink to="/register" className={navLinkClass}>
        Sign up
      </NavLink>
    </div>
  );
}

function ProfileLink({ user }) {
  return (
    <NavLink
      to="/user" // TODO: แก้ path ให้ตรงกับ route หน้าโปรไฟล์จริงของคุณ เช่น `/users/${user.id}`
      className="flex items-center gap-2 text-neutral-700 hover:text-[#f97316]"
    >
      {user.profileImageUrl ? (
        <img
          src={user.profileImageUrl}
          alt={user.firstName ?? "My Profile "}
          className="h-8 w-8 rounded-full object-cover ring-2 ring-transparent hover:ring-[#f97316]"
        />
      ) : (
        <span className="matte flex h-8 w-8 items-center justify-center rounded-full">
          <User size={16} className="text-[#f97316]" />
        </span>
      )}
      <span className="max-w-[100px] truncate">{user.firstName}</span>
    </NavLink>
  );
}

function MainNav() {
  const user = useAuthStore((store) => store.user);
  const location = useLocation();
  // ยังไม่ login ก็ยิง useMyCart() ได้อยู่ดี (ไม่มี enabled guard) แต่ retry: false ในตัว hook
  // เลยไม่ยิงซ้ำรัว ๆ ผลคือ cartItems จะเป็น [] เฉยๆ ตอนไม่ login (ไม่กระทบอะไรเพราะกดแล้วเด้งไป login อยู่แล้ว)
  const { data: cartItems = [] } = useMyCart();
  const cartCount = cartItems.length;

  // ตอนยังไม่ login, to ของปุ่มนี้คือ "/login" เอง เลยเช็ค isActive ของ NavLink ตรงๆ ไม่ได้
  // เพราะพอ MainNav โดน render บนหน้า /login (ตอน isAuthPage) มันจะ isActive=true ไปโดยบังเอิญ
  // (path ตรงกับ /login แต่ไม่ได้แปลว่ากำลังอยู่ "ตะกร้า") เลยเช็คจาก pathname จริงแทนว่าอยู่ /cart รึเปล่า
  const isCartActive = location.pathname === "/cart";

  return (
    <nav className="flex shrink-0 items-center gap-6 whitespace-nowrap text-sm font-semibold">
      <NavLink to="/" end className={iconLinkClass}>
        <RefreshCw size={18} />
        Compare Products
      </NavLink>

      <NavLink to="/about" className={iconLinkClass}>
        <Heart size={18} />
        Wishlist
      </NavLink>

      {/* ยังไม่ login -> เด้งไป /login แทนหน้าตะกร้า (CartPage เองก็กันไว้อีกชั้นถ้าพิมพ์ URL ตรงๆ) */}
      <NavLink
        to={user ? "/cart" : "/login"}
        className={() =>
          `flex items-center gap-1.5 hover:text-[#f97316] ${
            isCartActive ? "text-[#f97316]" : "text-neutral-700"
          }`
        }
      >
        <span className="relative">
          <ShoppingCart size={18} />
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#f97316] text-[10px] text-white">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </span>
        Cart
      </NavLink>

      {user ? <ProfileLink user={user} /> : <AuthLinks />}
    </nav>
  );
}

function Header() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <header>
      <div className="sticky top-0 z-40 w-screen shadow-sm bg-white">
        <div className="mx-auto grid max-w-8xl grid-cols-[auto_1fr_auto] items-center gap-6 px-4 py-3">
          <Logo />

          <div className="flex justify-center">
            {isAuthPage ? <MainNav /> : <SearchForm />}
          </div>

          <div className="justify-self-end">{!isAuthPage && <MainNav />}</div>
        </div>
      </div>
    </header>
  );
}

export default Header;
