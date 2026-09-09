import {
  ImageIcon,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import WebAssetCard from "@/components/admin/webAsset/WebAssetCard";

import { useWebAssets } from "@/hook/webAsset/useWebAssets";
import GlobalLoading from "@/components/loading/GlobalLoading";

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

  if (webAssetsQuery.isPending) {
    return <GlobalLoading label="Loading website images..."/>
  }

  if (webAssetsQuery.isError) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-50">
            <ImageIcon
              size={24}
              className="text-red-500"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-neutral-900">
            Unable to load website images
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Please try again.
          </p>

          <button
            type="button"
            onClick={() =>
              webAssetsQuery.refetch()
            }
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#F5F5F4] px-6 py-6">
      <div className="mx-auto w-full max-w-[1450px]">
        {/* HEADER */}
        <header className="mb-7">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Website Images
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Manage images displayed across the
            SpecHub website.
          </p>
        </header>

        {/* IMAGE SLOTS */}
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