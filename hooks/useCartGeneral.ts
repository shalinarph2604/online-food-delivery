import fetcher from "@/libs/fetcher";
import useSWR from "swr";

const useCartGeneral = () => {
    const { data, error, mutate } = useSWR(`/api/cart`, fetcher);
    return {
        cart: data,
        isLoading: !error && !data,
        isError: error,
        mutate
    }
}

export default useCartGeneral;