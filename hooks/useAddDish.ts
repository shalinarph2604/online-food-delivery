import useSWR from 'swr'
import axios from 'axios'
import toast from 'react-hot-toast'

const useAddDish = (dishId, ) => {
    const { data: dish, mutate } = useSWR(userId ? '/api/cart' : null)
}