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
    cartInfo: {
        restaurant_id: string
        restaurant: {
            name: string
            address: string
        }
        items: CartCardData[]
    }
}

const CartCard: React.FC<CartCardProps> = ({ restaurantCart, cartInfo }) => {
    console.log("CartCard props:", { restaurantCart, cartInfo })

    const { cartRestaurant } = useCartCard(restaurantCart || cartInfo?.restaurant_id)
    const { items } = useCartItems({ restaurantCart: cartInfo?.restaurant_id, itemId: cartInfo?.items[0]?.id })
    const router = useRouter()
    const loginModal = useLoginModal()
    const cartModal = useCartModal()
    const { user } = useCurrentUser()

    const fetchedCart = cartInfo ?? cartRestaurant ?? null
    const fetchedItems = useMemo(() => { 
        return Array.isArray(items) ? items : []
    }, [items])

    const totalPrice = useMemo(() => {
        if (!fetchedCart || !fetchedItems.length) return 'Rp 0'

        const total = fetchedItems.reduce((acc, fetchedItems) => {
            const price = Number(fetchedItems.price)
            const quantity = Number(fetchedItems.quantity)
            return acc + price * quantity
        }, 0)

        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(total));
    }, [fetchedCart, fetchedItems])

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
                <h3 className="text-sm">{cartInfo.restaurant?.name}</h3>
                <p>{cartInfo.restaurant?.address || ''}</p>
            </div>

            {/* Card Body */}
            <div className="w-full">
                {cartInfo.items.map((item: any) => (
                    <div key={item.id} className="grid grid-cols-3 gap-3">
                        <div className="w-28 h-28 relative rounded-md overflow-hidden bg-gray-50">
                            <Image 
                                src={item?.image_url || '/images/default-dish.png'}
                                alt={item?.restaurant?.name || 'Dish Image'}
                                fill
                            />
                        </div>
                        <div className="col-start-2 col-end-4">
                            <h4>{item.dishes?.name}</h4>
                            <p>{item.notes}</p>
                            <span className="text-purple-900 text-md font-medium">{item.price}</span>
                        </div>
                    </div>
                ))}
            </div>
            <Separator className="my-4 text-gray-400" />

            {/* Card Footer */}
            <div>
                <span className="text-purple-900 text-sm sm:text-base font-medium">{totalPrice}</span>
                <div className="right-4 bottom-4">
                    <Button 
                        label="Checkout"
                        primary
                        onClick={readyToCheckout}
                    />
                </div>
            </div>
        </div>
    )
}

export default CartCard;