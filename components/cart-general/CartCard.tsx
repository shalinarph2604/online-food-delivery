/* eslint-disable @typescript-eslint/no-explicit-any */
// singular cart card defined by restaurant
import useCurrentUser from "@/hooks/useCurrentUser";
import useLoginModal from "@/hooks/useLoginModal";
import useCartCard from "@/hooks/useCartCard";
import useCartModal from "@/hooks/useCartModal";
import useCartItems from "@/hooks/useCartItems";

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/router";

import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Button from "../Button";
import axios from "axios";

interface CartCardData {
    id: string
    price: number
    user_id: string
    dish_id: string
    quantity: number
    notes: string | null
    total_price: string
    restaurant_id: string
    image_url?: string
    restaurant?: {
        name: string,
        address: string
    }
    dishes?: {
        name: string,
    }
}

interface CartCardProps {
    restaurantCart?: string
    cartInfo: CartCardData
}

const CartCard: React.FC<CartCardProps> = ({ restaurantCart, cartInfo }) => {
    const { cartRestaurant } = useCartCard(restaurantCart)
    const { items } = useCartItems({ restaurantCart: cartInfo.restaurant_id, itemId: cartInfo.id })
    const router = useRouter()
    const loginModal = useLoginModal()
    const cartModal = useCartModal()
    const { user } = useCurrentUser()

    const fetchedCart = cartInfo ?? cartRestaurant ?? null
    const fetchedItems = useMemo(() => { 
        return Array.isArray(items) ? items : []
    }, [items])

    console.log('🧺 cartInfo:', cartInfo)
    console.log('📦 cartRestaurant:', cartRestaurant)
    console.log('📜 items:', items)


    const totalPrice = useMemo(() => {
        if (!fetchedCart || !fetchedCart.total_price || !fetchedItems.length) return 'Rp 0'

        const total = fetchedItems.reduce((acc, item) => {
            const price = Number(item.price)
            const quantity = Number(item.quantity)
            return acc + price * quantity
        }, 0)

        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(total));
    }, [fetchedCart, fetchedItems])

    const rupiahPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(Number(cartInfo.price));

    const goToRestaurant = useCallback((restaurantId: string) => {
        router.push(`/restaurant/${restaurantId}`)

        cartModal.onOpen(restaurantId)
    }, [router, cartModal])

    const readyToCheckout = useCallback(async () => {
        try {
            await axios.post(`api/restaurant/${restaurantCart}/checkout`, {
                fetchedCart
            });
        } catch (error) {
            console.error("Error checking out:", error)
        }

        router.push('/checkout')
    }, [router, restaurantCart, fetchedCart])

    return (
        <div className="bg-white rounded-lg shadow-md w-full max-w-3xl mx-auto p-4">
            {/* Card Header */}
            <div onClick={() => goToRestaurant(cartInfo.restaurant_id)}
                className="cursor-pointer mb-4"
            >
                <h3>{cartInfo.restaurant?.name}</h3>
                <p>{cartInfo.restaurant?.address || ''}</p>
            </div>

            {/* Card Body */}
            <div>
                {fetchedItems.map((item: any) => (
                    <div key={item.id}>
                        <Image 
                            src={item.image_url || '/images/default-dish.png'}
                            alt={item.dish?.name || 'Dish Image'}
                            width={100}
                            height={100}
                        />
                        <div>
                            <h4>{item.dish?.name}</h4>
                            <p>{item.notes}</p>
                            <span className="text-purple-900">{rupiahPrice}</span>
                        </div>
                    </div>
                ))}
            </div>
            <Separator className="my-4" />

            {/* Card Footer */}
            <div>
                <span className="text-purple-900 text-sm sm:text-base font-medium">{totalPrice}</span>
                <Button 
                    label="Checkout"
                    primary
                    onClick={readyToCheckout}
                />
            </div>
        </div>
    )
}

export default CartCard;