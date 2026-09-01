import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Camera, LoaderCircle, Save, UserRound, } from "lucide-react";
import { toast } from "sonner";
import { getMe, updateMe, } from "@/api/auth/auth.api";
import useAuthStore from "@/stores/auth.store";

const emptyProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
};

function Profile() {
  const setUser = useAuthStore((state) => state.setUser,);
  const [originalProfile, setOriginalProfile] = useState(emptyProfile);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const { register, handleSubmit, reset,
    formState: { errors, isSubmitting, },
  } = useForm({
    defaultValues: emptyProfile,
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoadingProfile(true);

        const response = await getMe();
        const user = response.user;

        const profile = {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
        };

        reset(profile);
        setOriginalProfile(profile);
        setImagePreview(
          user.profileImageUrl || "",
        );

        setUser(user);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
          "ไม่สามารถโหลดข้อมูลผู้ใช้ได้",
        );
      } finally {
        setIsLoadingProfile(false);
      }
    }

    loadProfile();
  }, [reset, setUser]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "รองรับเฉพาะไฟล์ JPG, PNG และ WEBP",
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "รูปภาพต้องมีขนาดไม่เกิน 5 MB",
      );
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      /*
       * ส่งเฉพาะช่องที่เปลี่ยน
       */
      if (
        data.firstName.trim() !==
        originalProfile.firstName
      ) {
        formData.append(
          "firstName",
          data.firstName.trim(),
        );
      }

      if (
        data.lastName.trim() !==
        originalProfile.lastName
      ) {
        formData.append(
          "lastName",
          data.lastName.trim(),
        );
      }

      if (
        data.phone.trim() !==
        originalProfile.phone
      ) {
        formData.append(
          "phone",
          data.phone.trim(),
        );
      }

      if (
        data.address.trim() !==
        originalProfile.address
      ) {
        formData.append(
          "address",
          data.address.trim(),
        );
      }

      if (selectedImage) {
        formData.append(
          "profileImage",
          selectedImage,
        );
      }

      /*
       * ผู้ใช้ไม่ได้เปลี่ยนอะไรเลย
       */
      if ([...formData.keys()].length === 0) {
        toast.info(
          "ยังไม่มีข้อมูลที่เปลี่ยนแปลง",
        );
        return;
      }

      const response = await updateMe(formData);
      const updatedUser = response.user;

      const updatedProfile = {
        firstName: updatedUser.firstName || "",
        lastName: updatedUser.lastName || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        address: updatedUser.address || "",
      };

      reset(updatedProfile);
      setOriginalProfile(updatedProfile);
      setSelectedImage(null);
      setImagePreview(
        updatedUser.profileImageUrl || "",
      );

      setUser(updatedUser);

      toast.success(
        response.message ||
        "บันทึกข้อมูลสำเร็จ",
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "ไม่สามารถบันทึกข้อมูลได้",
      );
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <LoaderCircle
          size={30}
          className="animate-spin text-orange-500"
        />

        <span className="ml-3 text-neutral-500">
          กำลังโหลดข้อมูล...
        </span>
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
            ข้อมูลส่วนตัว
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            จัดการข้อมูลบัญชีและข้อมูลสำหรับติดต่อ
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8"
          noValidate
        >
          {/* รูปโปรไฟล์ */}
          <div className="mb-8 flex items-center gap-5 border-b border-neutral-200 pb-8">
            <div className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-neutral-200 bg-neutral-100">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="รูปโปรไฟล์"
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
                เปลี่ยนรูปโปรไฟล์
              </label>

              <input
                id="profileImage"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />

              <p className="mt-2 text-xs text-neutral-400">
                JPG, PNG หรือ WEBP ไม่เกิน 5 MB
              </p>
            </div>
          </div>

          {/* ชื่อและนามสกุล */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormInput
              id="firstName"
              label="ชื่อ"
              placeholder="กรอกชื่อ"
              error={errors.firstName?.message}
              inputProps={register("firstName", {
                required: "กรุณากรอกชื่อ",
              })}
            />

            <FormInput
              id="lastName"
              label="นามสกุล"
              placeholder="กรอกนามสกุล"
              error={errors.lastName?.message}
              inputProps={register("lastName", {
                required: "กรุณากรอกนามสกุล",
              })}
            />
          </div>

          {/* อีเมล */}
          <div className="mt-5">
            <FormInput
              id="email"
              label="อีเมล"
              type="email"
              disabled
              inputProps={register("email")}
            />

            <p className="mt-2 text-xs text-neutral-400">
              ไม่สามารถเปลี่ยนอีเมลจากหน้านี้ได้
            </p>
          </div>

          {/* เบอร์โทร */}
          <div className="mt-5">
            <FormInput
              id="phone"
              label="เบอร์โทรศัพท์"
              type="tel"
              placeholder="0812345678"
              error={errors.phone?.message}
              inputProps={register("phone", {
                pattern: {
                  value: /^0[0-9]{8,9}$/,
                  message:
                    "เบอร์โทรศัพท์ไม่ถูกต้อง",
                },
              })}
            />
          </div>

          {/* ที่อยู่ */}
          <div className="mt-5">
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-semibold text-neutral-800"
            >
              ที่อยู่
            </label>

            <textarea
              id="address"
              rows={5}
              placeholder="กรอกที่อยู่สำหรับติดต่อ"
              className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-neutral-900 outline-none transition focus:ring-2 ${errors.address
                  ? "border-red-500 focus:ring-red-100"
                  : "border-neutral-300 focus:border-orange-500 focus:ring-orange-100"
                }`}
              {...register("address", {
                maxLength: {
                  value: 500,
                  message:
                    "ที่อยู่ต้องไม่เกิน 500 ตัวอักษร",
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
              disabled={isSubmitting}
              className="inline-flex min-w-40 cursor-pointer items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save size={18} />
                  บันทึกข้อมูล
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
        className={`w-full rounded-xl border px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500 ${error
            ? "border-red-500 focus:ring-red-100"
            : "border-neutral-300 focus:border-orange-500 focus:ring-orange-100"
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

export default Profile;