import { useMyCart } from "@/hook/cart/useMyCart";
import { useDebounce } from "@/hook/listing/useBounce";
import { useListingSearch } from "@/hook/listing/useListingSearch";
import { useWebAssets } from "@/hook/webAsset/useWebAssets";
import useAuthStore from "@/stores/auth.store";
import { Cpu, Search, ShoppingCart, User, X } from "lucide-react";
import { animate } from "motion";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { useCartFlyAnimation } from "../animation/CartFlyAnimationProvider";
import GlobalLoading from "../loading/GlobalLoading";

function Logo() {
  const { data: webassents, isLoading } = useWebAssets();
  const logoUrl = webassents?.homeImageUrl;
  if (logoUrl && isLoading) return <GlobalLoading />;
  return (
    <Link to="/" className="flex shrink-0 flex-col items-start">
      <img
        src={logoUrl ? logoUrl : "/spechub-logo.png"}
        alt="SpecHub"
        className="h-13 w-auto object-contain "
      />
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
        className="flex w-full items-center overflow-hidden rounded-lg border border-neutral-200 bg-white transition focus-within:border-neutral-400"
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
            className="w-full bg-transparent px-4 py-2.5 pr-9 text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="submit"
          aria-label="Search"
          className="flex w-11 shrink-0 items-center justify-center text-neutral-400 transition hover:text-[#f97316]"
        >
          <Search size={18} />
        </button>
      </form>

      {canShowDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-2 shadow-md">
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
                  className="flex w-full items-center gap-3 rounded-md p-2.5 text-left transition hover:bg-neutral-50"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-neutral-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={listing.title}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Cpu size={24} className="text-neutral-300" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {listing.title}
                    </p>

                    <p className="truncate text-xs text-neutral-500">
                      {[listing.brand, listing.model]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-[#f97316]">
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
  `hover:text-[#f97316] ${isActive ? "text-[#f97316]" : "text-neutral-500"}`;

function AuthLinks() {
  return (
    <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-500">
      <User size={17} strokeWidth={1.75} />
      <NavLink to="/login" className={navLinkClass}>
        Login{" "}
      </NavLink>
      <span className="text-neutral-300">/</span>
      <NavLink to="/register" className={navLinkClass}>
        Register
      </NavLink>
    </div>
  );
}

function ProfileLink({ user }) {
  return (
    <NavLink
      to="/user" // TODO: แก้ path ให้ตรงกับ route หน้าโปรไฟล์จริงของคุณ เช่น `/users/${user.id}`
      className="flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-[#f97316]"
    >
      {user.profileImageUrl ? (
        <img
          src={user.profileImageUrl}
          alt={user.firstName ?? "My Profile "}
          className="h-7 w-7 rounded-full object-cover ring-1 ring-transparent hover:ring-[#f97316]"
        />
      ) : (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100">
          <User size={14} className="text-[#f97316]" />
        </span>
      )}
      <span className="max-w-[100px] truncate">{user.firstName}</span>
    </NavLink>
  );
}

function MainNav() {
  const user = useAuthStore((store) => store.user);
  const location = useLocation();
  const { data: cartItems = [] } = useMyCart();
  const cartCount = cartItems.length;

  const isCartActive = location.pathname === "/cart";

  const { cartIconRef, cartRingRef } = useCartFlyAnimation();

  const cartBadgeRef = useRef(null);
  const previousCartCountRef = useRef(cartCount);

  useEffect(() => {
    if (cartCount > previousCartCountRef.current && cartBadgeRef.current) {
      animate(
        cartBadgeRef.current,
        { scale: [1, 1.5, 1] },
        { duration: 0.35, ease: "easeOut" },
      );
    }
    previousCartCountRef.current = cartCount;
  }, [cartCount]);

  return (
    <nav className="flex shrink-0 items-center gap-5 whitespace-nowrap text-sm font-medium">
      <NavLink
        to={user ? "/cart" : "/login"}
        className={() =>
          `flex items-center gap-1.5 hover:text-[#f97316] ${
            isCartActive ? "text-[#f97316]" : "text-neutral-500"
          }`
        }
      >
        <span ref={cartIconRef} className="relative">
          <span
            ref={cartRingRef}
            className="pointer-events-none absolute -inset-1.5 rounded-full border border-[#f97316] opacity-0"
          />
          <ShoppingCart size={18} strokeWidth={1.75} />
          {cartCount > 0 && (
            <span
              ref={cartBadgeRef}
              className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#f97316] text-[10px] text-white"
            >
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
      <div className="sticky top-0 z-40 w-screen border-b border-neutral-100 bg-white shadow-sm/20">
        <div className="mx-auto grid max-w-8xl grid-cols-[auto_1fr_auto] items-center gap-2 px-4 py-4">
          <Logo />

          <div className="flex justify-center">
            {!isAuthPage && <SearchForm />}
          </div>

          <div className="justify-center pr-2 sm:pr-4">
            <MainNav />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
