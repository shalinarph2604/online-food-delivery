import useSWR from 'swr'
import fetcher from '@/libs/fetcher'

const useCheckout = (checkoutId: string) => {
  const { data, error, mutate } = useSWR(
        checkoutId ? `/api/checkout/${checkoutId}` : null,
        fetcher
    )

  return {
    checkout: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

export default useCheckout