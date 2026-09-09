import { useEffect, useRef, useState } from "react";
import {
  ImageIcon,
  LoaderCircle,
  Pencil,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { useDeleteWebAssetImage } from "@/hook/webAsset/useDeleteWebAssetImage";
import { useReplaceWebAssetImage } from "@/hook/webAsset/useReplaceWebAssetImage";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function WebAssetCard({
  slot,
  title,
  description,
  imageUrl,
}) {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [previewUrl, setPreviewUrl] =
    useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const replaceImageMutation =
    useReplaceWebAssetImage();

  const deleteImageMutation =
    useDeleteWebAssetImage();

  const isReplacing =
    replaceImageMutation.isPending;

  const isDeleting =
    deleteImageMutation.isPending;

  const isPending =
    isReplacing || isDeleting;

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSelectImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (
      !ALLOWED_IMAGE_TYPES.includes(file.type)
    ) {
      toast.error(
        "Only JPEG, PNG, and WebP images are allowed.",
        {
          position: "top-right",
        },
      );

      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        "Image must not exceed 5 MB.",
        {
          position: "top-right",
        },
      );

      event.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const nextPreviewUrl =
      URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewUrl(nextPreviewUrl);
  };

  const handleCancelSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = () => {
    if (!selectedFile || isPending) return;

    replaceImageMutation.mutate(
      {
        slot,
        image: selectedFile,
      },
      {
        onSuccess: () => {
          handleCancelSelection();
        },
      },
    );
  };

  const handleDelete = () => {
    if (isPending) return;

    deleteImageMutation.mutate(slot, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
      },
    });
  };

  const displayedImage =
    previewUrl || imageUrl;

  return (
    <>
      <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        {/* HEADER */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            {title}
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            {description}
          </p>
        </div>

        {/* IMAGE */}
        <div className="mt-5">
          <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
            {displayedImage ? (
              <img
                src={displayedImage}
                alt={title}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center px-6 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-neutral-100">
                  <ImageIcon
                    size={25}
                    className="text-neutral-400"
                  />
                </div>

                <p className="mt-3 text-sm font-medium text-neutral-600">
                  No image uploaded
                </p>

                <p className="mt-1 text-xs text-neutral-400">
                  Select an image to add to this
                  website position.
                </p>
              </div>
            )}

            {/* PREVIEW BADGE */}
            {previewUrl && (
              <span className="absolute left-3 top-3 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                Preview
              </span>
            )}
          </div>
        </div>

        {/* FILE INFORMATION */}
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            {selectedFile ? (
              <>
                <p className="truncate text-sm font-medium text-neutral-700">
                  {selectedFile.name}
                </p>

                <p className="mt-0.5 text-xs text-neutral-400">
                  {formatFileSize(
                    selectedFile.size,
                  )}
                </p>
              </>
            ) : (
              <p className="text-xs text-neutral-400">
                JPEG, PNG or WebP • Max 5 MB
              </p>
            )}
          </div>

          {imageUrl && !selectedFile && (
            <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              Active
            </span>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleSelectImage}
          disabled={isPending}
          className="hidden"
        />

        {/* ACTIONS */}
        {selectedFile ? (
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={handleCancelSelection}
              disabled={isPending}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={17} />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleUpload}
              disabled={isPending}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isReplacing ? (
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Upload size={17} />
              )}

              {isReplacing
                ? "Uploading..."
                : imageUrl
                  ? "Confirm Replace"
                  : "Upload Image"}
            </button>
          </div>
        ) : (
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={isPending}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {imageUrl ? (
                <Pencil size={17} />
              ) : (
                <Upload size={17} />
              )}

              {imageUrl
                ? "Replace Image"
                : "Upload Image"}
            </button>

            {imageUrl && (
              <button
                type="button"
                onClick={() =>
                  setShowDeleteConfirm(true)
                }
                disabled={isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={17} />
                Delete
              </button>
            )}
          </div>
        )}
      </article>

      {/* DELETE CONFIRMATION */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-50">
                <Trash2
                  size={20}
                  className="text-red-500"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowDeleteConfirm(false)
                }
                disabled={isDeleting}
                className="rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-neutral-900">
              Delete Image
            </h3>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Are you sure you want to delete the
              image for{" "}
              <span className="font-semibold text-neutral-700">
                {title}
              </span>
              ? This website position will return to
              its default fallback.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setShowDeleteConfirm(false)
                }
                disabled={isDeleting}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? (
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2 size={17} />
                )}

                {isDeleting
                  ? "Deleting..."
                  : "Delete Image"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function formatFileSize(bytes) {
  if (!bytes) return "0 MB";

  return `${(bytes / 1024 / 1024).toFixed(
    2,
  )} MB`;
}

export default WebAssetCard;