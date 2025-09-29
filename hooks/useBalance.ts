import fetcher from "@/libs/fetcher";
import useSWR from "swr";

const useBalance = (userId: string) => {
    const { data, error, mutate } = useSWR(`/api/balance/${userId}`, fetcher);
    return {
        balance: data,
        isLoading: !error && !data,
        isError: error,
        mutate
    };
};

export default useBalance;
