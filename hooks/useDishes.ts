import useSWR from 'swr';
import fetcher from '@/libs/fetcher';

const useDishes = (resaturantId?: string) => {
    const { data, error, isLoading, mutate } = useSWR(
        resaturantId ? `/api/restaurant/${resaturantId}` : null,
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