import {
  ImageIcon,
  Images,
  RefreshCw,
} from "lucide-react";

import WebAssetCard from "@/components/admin/webAsset/WebAssetCard";
import GlobalLoading from "@/components/loading/GlobalLoading";

import { useWebAssets } from "@/hook/webAsset/useWebAssets";

const WEB_ASSET_SLOTS = [
  {
    slot: "home",
    field: "homeImageUrl",
    title: "Home Logo",
    description:
      "Logo displayed at the top-left of the homepage.",
  },
  {
    slot: "cover",
    field: "coverImageUrl",
    title: "Homepage Banner",
    description:
      "Main banner displayed in the center of the homepage.",
  },
  {
    slot: "promotion",
    field: "promotionImageUrl",
    title: "Promotion Image",
    description:
      "Promotion image displayed on the homepage.",
  },
  {
    slot: "banner",
    field: "bannerImageUrl",
    title: "Authentication Banner",
    description:
      "Banner displayed on the Login and Register pages.",
  },
];

function WebAssets() {
  const webAssetsQuery = useWebAssets();

  const webAssets = webAssetsQuery.data;

  /*
   * =========================================
   * LOADING
   * =========================================
   */
  if (webAssetsQuery.isPending) {
    return (
      <div className="min-h-screen bg-[#F5F5F4]">
        <GlobalLoading label="Loading website images..." />
      </div>
    );
  }

  /*
   * =========================================
   * ERROR
   * =========================================
   */
  if (webAssetsQuery.isError) {
    return (
      <div className="min-h-screen bg-[#F5F5F4] px-6 py-6">
        <div className="mx-auto flex min-h-[500px] w-full max-w-[1500px] items-center justify-center">
          <div className="text-center">
            {/* ICON */}
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-50">
              <ImageIcon
                size={24}
                className="text-red-500"
              />
            </div>

            {/* TITLE */}
            <h2 className="mt-4 text-lg font-semibold text-neutral-900">
              Unable to load website images
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Please try again.
            </p>

            {/* RETRY */}
            <button
              type="button"
              onClick={() =>
                webAssetsQuery.refetch()
              }
              className="
                mt-5
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-orange-500
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                shadow-sm
                transition
                hover:bg-orange-600
              "
            >
              <RefreshCw size={17} />

              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#F5F5F4] px-6 py-6">
      <div className="mx-auto w-full max-w-[1500px]">

        {/* =========================================
            HEADER
        ========================================= */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* ICON */}
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange-100">
              <Images
                size={22}
                className="text-orange-500"
              />
            </div>

            {/* TITLE */}
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">
                Website Images
              </h1>

              <p className="mt-1 text-xs text-neutral-500">
                Manage images displayed across the SpecHub website.
              </p>
            </div>
          </div>

          {/* REFRESH */}
          <button
            type="button"
            onClick={() =>
              webAssetsQuery.refetch()
            }
            disabled={
              webAssetsQuery.isFetching
            }
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-neutral-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-medium
              text-neutral-700
              shadow-sm
              transition
              hover:bg-neutral-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <RefreshCw
              size={16}
              className={
                webAssetsQuery.isFetching
                  ? "animate-spin"
                  : ""
              }
            />

            {webAssetsQuery.isFetching
              ? "Loading..."
              : "Refresh"}
          </button>
        </div>

        {/* =========================================
            IMAGE SLOTS
        ========================================= */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {WEB_ASSET_SLOTS.map((item) => (
            <WebAssetCard
              key={item.slot}
              slot={item.slot}
              title={item.title}
              description={
                item.description
              }
              imageUrl={
                webAssets?.[item.field]
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default WebAssets;