import { useMyCart } from "@/hook/cart/useMyCart";
import { useDebounce } from "@/hook/listing/useBounce";
import { useListingSearch } from "@/hook/listing/useListingSearch";
import useAuthStore from "@/stores/auth.store";
import { Cpu, Search, ShoppingCart, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { useCartFlyAnimation } from "../animation/CartFlyAnimationProvider";
import { animate } from "motion";
import { useWebAssets } from "@/hook/webAsset/useWebAssets";

// เงาชุดเดียวกับ MainNav.jsx - เวอร์ชันปรับให้อ่านออกชัดบนพื้นหลังขาว (ของเดิม bg-white/25 จะจางมาก
// ถ้าไม่มีคอนเทนต์สีสันข้างหลังให้ blur) ขึ้น opacity ของ bg-white ให้พอเห็นเป็นแผ่นแก้วได้เองแม้พื้น
// เป็นขาวล้วน เพิ่ม border สีเทา/ส้มจางๆ ให้มีขอบชัดขึ้น แต่ยังคง backdrop-blur ไว้เผื่อมีคอนเทนต์
// เลื่อนผ่านข้างหลังตอน scroll (ดู PublicLayout.jsx ที่ทำ header เป็น fixed ไว้แล้ว)
const GLASS_IDLE =
  "bg-white/60 backdrop-blur-md text-neutral-700 border border-neutral-200/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.06)]";
const GLASS_ACTIVE =
  "bg-[#f97316]/90 backdrop-blur-md text-white border border-orange-300/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_4px_14px_rgba(249,115,22,0.35)]";
// panel (dropdown ผลค้นหา) ต้องทึบกว่าปุ่มพอสมควร เพราะต้องมีตัวหนังสือ/รูปสินค้าอ่านง่ายอยู่ข้างใน
const GLASS_PANEL =
  "bg-white/95 backdrop-blur-xl border border-neutral-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_20px_40px_rgba(0,0,0,0.10)]";
// พื้นหลังของตัว header เองก็เป็นแผ่นแก้ว liquid glass ด้วย (เดิมโปร่งใสล้วน) - บางกว่าตัว element ย่อย
// ข้างใน (search/cart/avatar) มีเส้นขีดล่างจางๆ (border-b) คั่นจากเนื้อหาข้างล่างให้ดูเป็นแถบลอย
const GLASS_BAR =
  "bg-white/50 backdrop-blur-xl border-b border-neutral-200/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.05)]";

function Logo() {
  // ดึงรูปโลโก้จริงจาก backend - fallback กลับไปใช้ไอคอน + ตัวหนังสือเดิมถ้ายังโหลดไม่เสร็จ/ไม่มีค่า
  const logoUrl = useWebAssets().data?.homeImageUrl;

  return (
    <Link to="/" className="flex shrink-0 flex-col items-start">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="SpecHub"
          className="h-10 w-auto object-contain"
        />
      ) : (
        <span className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-900">
          <Cpu className="h-5 w-5 text-[#f97316]" strokeWidth={2} />
          SPEC<span className="text-[#f97316]">HUB</span>
        </span>
      )}
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
      {/* ช่องค้นหาเป็นแผ่นแก้ว liquid glass ลอยอยู่บนพื้นหลังโปร่งใสของ header */}
      <form
        onSubmit={handleSubmit}
        className={`flex w-full items-center overflow-hidden rounded-2xl transition-colors ${GLASS_IDLE}`}
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
            className="w-full bg-transparent px-4 py-2.5 pr-9 text-sm text-neutral-800 outline-none placeholder:text-neutral-500"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-800"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="submit"
          aria-label="Search"
          className="flex w-11 shrink-0 items-center justify-center text-neutral-500 transition hover:text-[#f97316]"
        >
          <Search size={18} />
        </button>
      </form>

      {canShowDropdown && (
        <div
          className={`absolute left-0 right-0 top-full z-50 mt-3 max-h-96 overflow-y-auto rounded-2xl p-2 ${GLASS_PANEL}`}
        >
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
                  className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-white/60"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/50">
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
  `hover:text-[#f97316] ${isActive ? "text-[#f97316]" : "text-neutral-600"}`;

function AuthLinks() {
  return (
    <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-600">
      <User size={17} strokeWidth={1.75} />
      <NavLink to="/login" className={navLinkClass}>
        Login
      </NavLink>
      <span className="text-neutral-400">/</span>
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
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full ${GLASS_IDLE}`}
        >
          <img
            src={user.profileImageUrl}
            alt={user.firstName ?? "My Profile "}
            className="h-7 w-7 rounded-full object-cover"
          />
        </span>
      ) : (
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full ${GLASS_IDLE}`}
        >
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
    <nav className="flex shrink-0 items-center gap-4 whitespace-nowrap text-sm font-medium">
      {/* ปุ่มตะกร้าเป็นแผ่นแก้วเดียวกับปุ่มเมนูใน MainNav.jsx - ใส (idle) / ส้มโปร่งพร้อมเรืองแสงตอน active */}
      <NavLink
        to={user ? "/cart" : "/login"}
        className={() =>
          `flex items-center gap-2 rounded-2xl px-3 py-2 transition-colors ${
            isCartActive ? GLASS_ACTIVE : `${GLASS_IDLE} hover:text-[#f97316]`
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
      <div className={`sticky top-0 z-40 w-screen ${GLASS_BAR}`}>
        <div className="mx-auto grid max-w-8xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4">
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
