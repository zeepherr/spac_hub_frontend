import {updateCategory} from "@/api/category.api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { data } from "react-router"
import {toast} from "sonner"

export const useUpdateCategory = ()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({id,payload})=>{
            return updateCategory(id,payload)
        },
        onSuccess: (data)=>{
            toast.success(data.message, {position:"top-right"})
            queryClient.invalidateQueries({
                queryKey :["categories"]
            })
        }
    })
}