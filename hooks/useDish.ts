import useSWR from 'swr'
import fetcher from '@/libs/fetcher'

const useDish = (restaurantId: string, dishId: string) => {
    const { data, error, isLoading } = useSWR(
        dishId ? `/api/restaurant/${restaurantId}/${dishId}` : null,
        fetcher
    )

    return {
        dish: data,
        isLoading,
        isError: error
    }
}

export default useDish