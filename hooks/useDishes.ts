import useSWR from 'swr';
import fetcher from '@/libs/fetcher';

const useDishes = (resaturantId: string) => {
    const { data, error, isLoading } = useSWR(
        resaturantId ? `/api/restaurant/${resaturantId}` : null,
        fetcher
    );

    return {
        dishes: data,
        isLoading,
        isError: error
    }
}

export default useDishes;