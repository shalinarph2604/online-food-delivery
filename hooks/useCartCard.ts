import fetcher from "@/libs/fetcher";
import useSWR from "swr";

const useCartCard = (restaurantCart?: string) => {

    const shouldFetch = Boolean(restaurantCart);

    const { data, error, mutate, isLoading } = useSWR(shouldFetch ? `/api/general-cart/${restaurantCart}` : null,
        fetcher);

    console.log("useCartCard triggered:", restaurantCart)
    console.log("Fetched data:", data)

    return {
        cartRestaurant: data,
        isLoading,
        isError: error,
        mutate
    }
}

export default useCartCard;