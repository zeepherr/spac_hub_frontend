import {
  BadgeCheck,
  CalendarDays,
  LoaderCircle,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Shield,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router";

import { useUserProfile } from "@/hook/user/useUserProfile";

function AdminProfile() {
  const navigate = useNavigate();
  const profileQuery = useUserProfile();

  const user = profileQuery.data?.user;

  if (profileQuery.isPending) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <LoaderCircle
          size={30}
          className="animate-spin text-orange-500"
        />

        <span className="ml-3 text-sm text-neutral-500">
          Loading profile...
        </span>
      </div>
    );
  }

  if (profileQuery.isError || !user) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center gap-3">
        <p className="text-red-500">
          Unable to load user profile
        </p>

        <button
          type="button"
          onClick={() => profileQuery.refetch()}
          className="cursor-pointer rounded-lg border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 transition hover:bg-orange-50"
        >
          Try Again
        </button>
      </div>
    );
  }

  const fullName =
    [user.firstName, user.lastName]
      .filter(Boolean)
      .join(" ") || "Name not provided";

  const roleLabel =
    user.role === "ADMIN"
      ? "Administrator"
      : user.role === "SELLER"
        ? "Seller"
        : "User";

  const createdAt = user.createdAt
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(user.createdAt))
    : "No information available";

  return (
    <section className="min-h-full bg-neutral-50 px-5 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <header className="mb-7">
          <h1 className="text-3xl font-bold text-neutral-900">
            Admin Profile
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            View administrator account information and details
          </p>
        </header>

        {/* PROFILE CARD */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
          {/* PROFILE HEADER */}
          <div className="flex flex-col gap-6 border-b border-neutral-200 pb-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-5">
              <ProfileImage
                imageUrl={user.profileImageUrl}
                fullName={fullName}
              />

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-2xl font-bold text-neutral-900">
                    {fullName}
                  </h2>

                  {user.isVerified && (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-neutral-600">
                      <BadgeCheck
                        size={21}
                        className="fill-orange-500 text-white"
                      />

                      Verified
                    </span>
                  )}
                </div>

                <p className="mt-2 truncate text-neutral-500">
                  {user.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin/profile/edit")}
              className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-orange-500 px-5 py-3 font-semibold text-orange-500 transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
            >
              <Pencil size={19} />
              Edit Profile
            </button>
          </div>

          {/* PROFILE DETAILS */}
          <div className="mt-7 space-y-4">
            <ProfileRow
              icon={UserRound}
              label="Full Name"
              value={fullName}
            />

            <ProfileRow
              icon={Mail}
              label="Email"
              value={user.email}
            />

            <ProfileRow
              icon={Phone}
              label="Phone Number"
              value={user.phone}
              emptyText="No phone number added"
            />

            <ProfileRow
              icon={MapPin}
              label="Address"
              value={user.address}
              emptyText="No address added"
            />

            <ProfileRow
              icon={Shield}
              label="Role"
              value={roleLabel}
            />

            <ProfileRow
              icon={CalendarDays}
              label="Member Since"
              value={createdAt}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfileImage({ imageUrl, fullName }) {
  return (
    <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-neutral-200 bg-neutral-100">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${fullName}'s profile`}
          className="size-full object-cover"
        />
      ) : (
        <UserRound
          size={42}
          className="text-neutral-400"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

function ProfileRow({
  icon: Icon,
  label,
  value,
  emptyText = "No information available",
}) {
  const hasValue =
    value !== null &&
    value !== undefined &&
    String(value).trim() !== "";

  return (
    <div className="grid gap-3 rounded-xl border border-neutral-200 p-4 sm:grid-cols-[220px_1fr] sm:items-center">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-orange-50 text-orange-500">
          <Icon size={20} aria-hidden="true" />
        </span>

        <span className="font-semibold text-neutral-800">
          {label}
        </span>
      </div>

      <p
        className={
          hasValue
            ? "break-words text-neutral-600"
            : "text-neutral-400"
        }
      >
        {hasValue ? value : emptyText}
      </p>
    </div>
  );
}

export default AdminProfile;