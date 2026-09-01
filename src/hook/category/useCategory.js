import {
  getAllCategoriesAdmin,
  getAllCategoriesForUser,
} from "@/api/category.api";
import { useQuery } from "@tanstack/react-query";
import { categoryKeys } from "./categoryKeys";

export const useCategories = ({ includeInactive = false } = {}) => {
  return useQuery({
    queryKey: includeInactive
      ? categoryKeys.includeInactive()
      : categoryKeys.active(),

    queryFn: includeInactive ? getAllCategoriesAdmin : getAllCategoriesForUser,

    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
