import useSWR from 'swr';
import fetcher from '@/libs/fetcher';

const useDishes = (restaurantId?: string) => {
    const { data, error, isLoading, mutate } = useSWR(
        restaurantId ? `/api/restaurant/${restaurantId}` : null,
        fetcher
    );

    return {
        dishes: data,
        isLoading,
        isError: error,
        mutateFetchedDishes: mutate
    }
}

export default useDishes;