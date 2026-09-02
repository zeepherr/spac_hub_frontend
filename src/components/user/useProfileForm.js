import {useEffect,useState,} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import useAuthStore from "@/stores/auth.store";
import { profileImageSchema } from "@/validations/image.schema";

import { useUserProfile } from "../../hook/user/useUserProfile";
import { useUpdateUserProfile } from "../../hook/user/useUpdateUserProfile";

const emptyProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
};

export function useProfileForm() {
  const setUser = useAuthStore(
    (state) => state.setUser,
  );

  const [originalProfile, setOriginalProfile] =
    useState(emptyProfile);

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const profileQuery = useUserProfile();

  const { mutateAsync: updateProfile, isPending } =
    useUpdateUserProfile();

  const {register,handleSubmit,reset,formState: {errors, },} = useForm({
    defaultValues: emptyProfile,
  });

  /** นำข้อมูลจาก GET /user/me ใส่ Form*/
  useEffect(() => {
    const user = profileQuery.data?.user;

    if (!user) return;

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
  }, [
    profileQuery.data,
    reset,
    setUser,
  ]);

  /*
   * ล้าง Preview URL ที่ Browser สร้าง
   */
  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  /*
   * ทำงานเมื่อผู้ใช้เลือกรูป
   */
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    /*
     * ตรวจรูปด้วย Zod
     */
    const result =
      profileImageSchema.safeParse({
        image: file,
      });

    if (!result.success) {
      toast.error(
        result.error.issues[0].message,
      );

      event.target.value = "";
      return;
    }

    const validImage = result.data.image;

    setSelectedImage(validImage);
    console.log(validImage)

    setImagePreview(
      URL.createObjectURL(validImage),
    );
  };

  /*
   * ทำงานเมื่อกดบันทึก
   */
  const submitProfile = async (formValues) => {
    const formData = new FormData();

    const firstName =
      formValues.firstName.trim();

    const lastName =
      formValues.lastName.trim();

    const phone =
      formValues.phone?.trim() || "";

    const address =
      formValues.address?.trim() || "";

    /*
     * ส่งเฉพาะข้อมูลที่เปลี่ยน
     */
    if (
      firstName !== originalProfile.firstName
    ) {
      formData.append(
        "firstName",
        firstName,
      );
    }

    if (
      lastName !== originalProfile.lastName
    ) {
      formData.append(
        "lastName",
        lastName,
      );
    }

    if (phone !== originalProfile.phone) {
      formData.append("phone", phone);
    }

    if (address !== originalProfile.address) {
      formData.append("address", address);
    }

    if (selectedImage) {
      formData.append(
        "profileImage",
        selectedImage,
      );
    }

    /*
     * ไม่มีอะไรเปลี่ยน
     */
    if ([...formData.keys()].length === 0) {
      toast.info(
        "ยังไม่มีข้อมูลที่เปลี่ยนแปลง",
      );

      return;
    }

    try {
  
      const response = await updateProfile({ payload: formData });
      const updatedUser = response.user;

      const updatedProfiles = {
        firstName:
          updatedUser.firstName || "",
        lastName:
          updatedUser.lastName || "",
        email:
          updatedUser.email || "",
        phone:
          updatedUser.phone || "",
        address:
          updatedUser.address || "",
      };

      reset(updatedProfiles);
      setOriginalProfile(updatedProfiles);
      setSelectedImage(null);

      setImagePreview(
        updatedUser.profileImageUrl || "",
      );
    } catch {
      /*
       * useUpdateUserProfile
       * จัดการ Error และ Toast แล้ว
       */
    }
  };

  return {
    register,
    handleSubmit,
    errors,

    imagePreview,
    handleImageChange,
    submitProfile,

    isLoading: profileQuery.isPending,
    isError: profileQuery.isError,
    isSaving:isPending,
  };
}
