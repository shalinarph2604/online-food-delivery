import useSWR from 'swr'
import fetcher from '@/libs/fetcher'


const useDish = ({ restaurantId, dishId } : { restaurantId?: string, dishId?: string }) => {
    const { data, error, isLoading, mutate } = useSWR(
        restaurantId && dishId ? `/api/restaurant/${restaurantId}/${dishId}` : null,
        fetcher
    )

    return {
        dish: data,
        isLoading,
        isError: error,
        mutateFetchedDish: mutate
    }
}

export default useDish