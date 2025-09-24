import useSWR from "swr";
import fetcher from "@/libs/fetcher";

const useOrders = () => {
    const { data, error, isLoading } = useSWR('/api/orders', fetcher);

    return {
        orders: data,
        isLoading,
        isError: error
    };
}

export default useOrders;
