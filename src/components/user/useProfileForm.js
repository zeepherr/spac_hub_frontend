import {
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router";
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
  const navigate = useNavigate();

  const setUser = useAuthStore((state) => state.setUser,);
  const [originalProfile, setOriginalProfile] =useState(emptyProfile);
  const [selectedImage, setSelectedImage] =useState(null);
  const [imagePreview, setImagePreview] =useState("");

  const profileQuery = useUserProfile();
  const {mutateAsync: updateProfile,isPending,} = useUpdateUserProfile();

  const { register,handleSubmit,reset,
    formState: {errors,}, 
                } = useForm({   defaultValues: emptyProfile, });

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

    setUser(user);}, [
    profileQuery.data,
    reset,
    setUser,
  ]);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;
    const result =
      profileImageSchema.safeParse({
        image: file,
      });

    if (!result.success) {
      const message = result.error.issues[0]?.message || "Invalid image file";
      toast.error(message);
      event.target.value = "";

      return;
    }

    const validImage = result.data.image;

    setSelectedImage(validImage);
    const previewUrl =
      URL.createObjectURL(validImage);

    setImagePreview(previewUrl);
  };


  const submitProfile = async (
    formValues,
  ) => {
    const formData = new FormData();
    const firstName =formValues.firstName.trim();
    const lastName =formValues.lastName.trim();
    const phone =formValues.phone?.trim() || "";
    const address =formValues.address?.trim() || "";


    if (
      firstName !== originalProfile.firstName
    ) {
      formData.append("firstName", firstName,);
    }

    if (
      lastName !== originalProfile.lastName
    ) {
      formData.append("lastName",lastName,);
    }
    if (
      phone !== originalProfile.phone
    ) {
      formData.append("phone",phone,);
    }

    if (
      address !== originalProfile.address
    ) {
      formData.append("address",address,);
    }

    if (selectedImage) {
      formData.append("profileImage", selectedImage,
      );
    }

    if (
      [...formData.keys()].length === 0) {
      toast.info(
        "No changes to save", );

      return;
    }
    try {
      const response = await updateProfile(formData);

      console.log("Update profile response:",response,);

      /*ป้องกัน Error กรณี Backend ไม่ได้ส่ง user กลับมา*/
      if (!response?.user) {
        console.error("Backend response does not contain user:",response,);

        return; }

      const updatedUser = response.user;

      const updatedProfile = {
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

      /* นำข้อมูลล่าสุดกลับเข้า Form*/
      reset(updatedProfile);

      /* เก็บเป็นข้อมูลต้นฉบับรอบใหม่เพื่อใช้เปรียบเทียบครั้งต่อไป*/
      setOriginalProfile(
        updatedProfile,
      );

      /* รูปถูกส่งสำเร็จแล้ว*/
      setSelectedImage(null);

      /* เปลี่ยน Preview จาก Blob URLเป็น URL จริงจาก R2*/
      setImagePreview(
        updatedUser.profileImageUrl || "",
      );
      navigate("/user/profile");
    } catch (error) {
      
      console.error("Submit profile error:",error,);}
  };

  return {
    register,
    handleSubmit,
    errors,

    imagePreview,
    handleImageChange,
    submitProfile,

    isLoading:
      profileQuery.isPending,

    isError:
      profileQuery.isError,

    isSaving:
      isPending,
  };
}