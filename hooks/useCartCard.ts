import fetcher from "@/libs/fetcher";
import useSWR from "swr";

const useCartCard = (restaurantCart?: string) => {
    const { data, error, mutate, isLoading } = useSWR(`/api/general-cart/${restaurantCart}`, fetcher);

    return {
        cartRestaurant: data,
        isLoading,
        isError: error,
        mutate
    }
}

export default useCartCard;