import { axiosInstance } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query';

export const useFetchProducts = () => {
    return useQuery({
        queryFn: async () => {
            const productsResponse = await axiosInstance.get("/products");

            console.log(productsResponse);
            
            return productsResponse;
        },
        queryKey: ["fetch.products"],
    });
}