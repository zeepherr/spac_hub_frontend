import { getAllCategoriesAdmin } from "@/api/category.api"
import { useQuery } from "@tanstack/react-query"

export const useCategories = ()=>{
    return useQuery({
        queryKey :["categories"],
        queryFn : getAllCategoriesAdmin
    })
}