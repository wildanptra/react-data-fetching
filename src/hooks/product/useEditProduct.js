import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useEditProduct = ({ onSuccess, onError }) =>{
    return useMutation({
        mutationFn: async (body) => {

            const { id, title, price, description, thumbnail } = body;

            const requestBody = {
                title,
                price,
                description,
                thumbnail,
            }

            const productResponse = await axiosInstance.patch(`/products/${id}`, requestBody);
                    
            console.log(productResponse);
                
            return productResponse;
        },
        onSuccess,
        onError,
    });
}