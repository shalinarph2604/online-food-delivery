import useSWR from "swr";
import fetcher from "@/libs/fetcher";

const useCartItems = ({ restaurantCart, itemId }: { restaurantCart: string; itemId: string }) => {
    const { data, error, mutate, isLoading } = useSWR(restaurantCart && itemId ? `/api/general-cart/${restaurantCart}/${itemId}` : null,
        fetcher
    );

    return {
        items: data,
        isLoading,
        isError: error,
        mutate
    }
}

export default useCartItems;