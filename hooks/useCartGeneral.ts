import fetcher from "@/libs/fetcher";
import SWR from "swr";

const useCartGeneral = (userId: string) => {
    const { data, error, mutate } = SWR(userId ? `/api/cart/${userId}` : null, fetcher);
    return {
        cart: data,
        isLoading: !error && !data,
        isError: error,
        mutate
    }
}

export default useCartGeneral;