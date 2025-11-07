import useSWR from "swr";
import fetcher from "@/libs/fetcher";

const useCartItems = ({ restaurantCart, itemId }: { restaurantCart: string; itemId: string }) => {
    const { data, error, mutate, isLoading } = useSWR(`/api/cart-item/${restaurantCart}/${itemId}`,
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