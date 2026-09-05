import {Camera,LoaderCircle,Save,UserRound,} from "lucide-react";
import { useProfileForm } from "@/components/user/useProfileForm";

function EditProfile() {
  const {
    register,
    handleSubmit,
    errors,
    imagePreview,
    handleImageChange,
    submitProfile,
    isLoading,
    isError,
    isSaving,
  } = useProfileForm();

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <LoaderCircle
          size={30}
          className="animate-spin text-orange-500"
        />

        <span className="ml-3 text-neutral-500">
          Loading profile...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-80 items-center justify-center text-red-500">
        Unable to load profile data
      </div>
    );
  }

  return (
    <section className="min-h-full bg-neutral-50 px-5 py-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-7">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            Account settings
          </p>

          <h1 className="mt-1 text-3xl font-bold text-neutral-900">
            Profile Information
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Manage your account details and contact information
          </p>
        </header>

        <form
          onSubmit={handleSubmit(submitProfile)}
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8"
          noValidate
        >
          {/* Profile Picture */}
          <div className="mb-8 flex items-center gap-5 border-b border-neutral-200 pb-8">
            <div className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-neutral-200 bg-neutral-100">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="size-full object-cover"
                />
              ) : (
                <UserRound
                  size={48}
                  className="text-neutral-400"
                />
              )}
            </div>

            <div>
              <label
                htmlFor="profileImage"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 transition hover:bg-orange-50"
              >
                <Camera size={18} />
                Change Profile Picture
              </label>

              <input
                id="profileImage"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />

              <p className="mt-2 text-xs text-neutral-400">
                JPG, PNG or WEBP (Max. 5 MB)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormInput
              id="firstName"
              label="First Name"
              placeholder="Enter first name"
              error={errors.firstName?.message}
              inputProps={register("firstName", {
                required: "First name is required",
              })}
            />

            <FormInput
              id="lastName"
              label="Last Name"
              placeholder="Enter last name"
              error={errors.lastName?.message}
              inputProps={register("lastName", {
                required: "Last name is required",
              })}
            />
          </div>

          <div className="mt-5">
            <FormInput
              id="email"
              label="Email Address"
              type="email"
              disabled
              inputProps={register("email")}
            />

            <p className="mt-2 text-xs text-neutral-400">
              Email address cannot be changed here
            </p>
          </div>

          <div className="mt-5">
            <FormInput
              id="phone"
              label="Phone Number"
              type="tel"
              placeholder="0812345678"
              error={errors.phone?.message}
              inputProps={register("phone", {
                pattern: {
                  value: /^0[0-9]{8,9}$/,
                  message: "Invalid phone number format",
                },
              })}
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-semibold text-neutral-800"
            >
              Address
            </label>

            <textarea
              id="address"
              rows={5}
              placeholder="Enter your contact address"
              className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-neutral-900 outline-none transition focus:ring-2 ${
                errors.address
                  ? "border-red-500 focus:ring-red-100"
                  : "border-neutral-300 focus:border-orange-500 focus:ring-orange-100"
              }`}
              {...register("address", {
                maxLength: {
                  value: 500,
                  message: "Address cannot exceed 500 characters",
                },
              })}
            />

            {errors.address && (
              <p className="mt-1 text-sm text-red-500">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="mt-7 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex min-w-40 cursor-pointer items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function FormInput({
  id,
  label,
  type = "text",
  placeholder,
  error,
  disabled = false,
  inputProps,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-neutral-800"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
          error
            ? "border-red-500"
            : "border-neutral-300 focus:border-orange-500"
        }`}
        {...inputProps}
      />

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default EditProfile;