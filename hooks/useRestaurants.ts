import useSWR from "swr";
import fetcher from "@/libs/fetcher";

const useRestaurants = () => {
    const { data, error, isLoading } = useSWR('/api/restaurant', fetcher);

    return {
        restaurants: data,
        isLoading,
        isError: error
    };
}

export default useRestaurants;