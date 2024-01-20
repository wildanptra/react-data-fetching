import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useDeleteProduct = ({ onSuccess, onError }) => {
    return useMutation({
        mutationFn: async (id) => {
            const productResponse = await axiosInstance.delete(`/products/${id}`);
            
            console.log(productResponse);
        
            return productResponse;
        },
        onSuccess,
        onError,
    });
}