/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr'
import axios from 'axios'
import toast from 'react-hot-toast'

import { useCallback } from 'react'

import useDish from './useDish'
import useDishes from './useDishes'
import useCurrentUser from './useCurrentUser'
import useLoginModal from './useLoginModal'
import fetcher from '@/libs/fetcher'

const useAddDish = ({ restaurantId, dishId } : { restaurantId?: string, dishId?: string}) => {
    const { user } = useCurrentUser()
    const { mutateFetchedDish } = useDish({ restaurantId, dishId })
    const { mutateFetchedDishes } = useDishes(restaurantId)

    const loginModal = useLoginModal()

    const { data: filledCart, mutate: mutateCart } = useSWR(
        restaurantId ? `/api/restaurant/${restaurantId}/cart` : null,
        fetcher
    )

    const addButton = useCallback(async () => {
        if (!user) return loginModal.onOpen()
        if (!restaurantId || !dishId) return toast.error('Invalid item')

        try {
        // checking if the specific dish is already in the cart or not
            const existing = (filledCart || []).find((it: any) => it.dish_id === dishId)

            if (existing) {
                const itemId = existing.id
                await axios.patch(`/api/restaurant/${restaurantId}/cart/${itemId}`, {
                    quantity: (existing.quantity ?? 0) + 1
                })
            } else {
                await axios.post(`/api/restaurant/${restaurantId}/cart`, {
                    dishId,
                    quantity: 1
                })
            }

            mutateCart?.()
            mutateFetchedDish?.()
            mutateFetchedDishes?.()

            toast.success('Added to cart')
        } catch (error) {
            console.log(error)
            toast.error("Cannot add item to the cart")
        }

    }, [user, restaurantId, dishId, filledCart, loginModal, mutateCart, mutateFetchedDish, mutateFetchedDishes])

    const subtractButton = useCallback(async () => {
        if (!user) return loginModal.onOpen()
        if (!restaurantId || !dishId) return toast.error('Invalid item')

        try {
            const existing = (filledCart || []).find((item: any) => item.dish_id === dishId)

            if (!existing) {
                return toast.error('Item not in cart')
            }

            const itemId = existing.id
            const currentQty = Number(existing.quantity ?? 0)

            if (currentQty <= 1) {
                await axios.delete(`/api/restaurant/${restaurantId}/cart/${itemId}`, {
                    data: { dishId }
                })
            } else {
                await axios.patch(`/api/restaurant/${restaurantId}/cart/${itemId}`, {
                    quantity: currentQty - 1
                })
            }

            mutateCart()
            mutateFetchedDish()
            mutateFetchedDishes()
        } catch (error) {
            console.log(error)
            toast.error("Cannot remove item from the cart")
        }
    }, [dishId, filledCart, loginModal, restaurantId, user, mutateCart, mutateFetchedDish, mutateFetchedDishes])

    return {
        addButton,
        subtractButton
    }
}

export default useAddDish