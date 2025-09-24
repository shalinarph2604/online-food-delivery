import useSWR from 'swr';
import fetcher from '@/libs/fetcher';

const useCurrentUser = () => {
    const { data, error, isLoading } = useSWR('/api/users/me', fetcher);

    return {
        user: data,
        isLoading,
        isError: error
    };
}

export default useCurrentUser;