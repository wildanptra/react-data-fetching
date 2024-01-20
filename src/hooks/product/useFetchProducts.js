import { axiosInstance } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query';

export const useFetchProducts = ({ onError }) => {
    return useQuery({
        queryFn: async () => {
            const productsResponse = await axiosInstance.get("/products?limit=5");

            console.log(productsResponse);
            
            return productsResponse;
        },
        queryKey: ["fetch.products"],
        onError,
    });
}