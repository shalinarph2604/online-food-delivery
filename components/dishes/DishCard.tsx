/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from "react"

import useAddDish from "@/hooks/useAddDish"
import useDish from "@/hooks/useDish"
import useLoginModal from "@/hooks/useLoginModal"
import useCurrentUser from "@/hooks/useCurrentUser"

import Button from "../Button"
import Image from "next/image"

interface DishCardItem {
    id: string
    restaurant_id: string
    name: string
    price: number
    image_url: string
}

interface DishCardProps {
    restaurantId?: string
    dishId?: string
    dish?: DishCardItem
    quantity?: number
}

const DishCard: React.FC<DishCardProps> = ({
    restaurantId, dishId, dish: dishInfo, quantity
}) => {

    const {
        addButton,
        subtractButton,
        existing = [],
    } = useAddDish({ restaurantId, dishId })

    const { dish: fetchedDish } = useDish({ restaurantId, dishId })

    const displayDish = dishInfo ?? fetchedDish ?? null

    const { user } = useCurrentUser()

    const loginModal = useLoginModal()

    const existingItem = Array.isArray(existing)
        ? existing.find((it: any) => it.dish_id === dishId) ?? null
        : existing ?? null

// disable subtract if quantity = 0 or less
    const existingQty = existingItem ? Number((existingItem as any).quantity ?? 0) : 0
    const isSubtractDisabled = existingQty <= 0

    const addToCart = useCallback(() => {

        if (!user) return loginModal.onOpen()

        addButton()
    }, [addButton, loginModal, user])

    const deleteFromCart = useCallback(() => {
        if (isSubtractDisabled) return

        if (!user) return loginModal.onOpen()

        subtractButton()
    }, [subtractButton, loginModal, user, isSubtractDisabled])


    const formattedPrice = typeof displayDish?.price === 'number'
        ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(displayDish.price)
        : ''

    return (
        <div className="bg-white w-full max-w-3xl mx-auto rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 p-3 sm:p-4">
                <div className="relative w-28 h-28 sm:w-40 sm:h-24 rounded-md overflow-hidden bg-gray-50 flex-shrink-0">
                    {displayDish?.image_url ? (
                        <Image 
                            src={displayDish.image_url}
                            alt={displayDish.name ?? "Dish"}
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 640px) 120px, 160px"
                        />
                    ) : (
                        <div className="h-full w-full bg-gray-100" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-base sm:text-lg font-semibold leading-snug break-words">{displayDish?.name ?? 'Untitled Dish'}</h2>
                    <p className="text-purple-900 text-sm sm:text-base font-medium mt-0.5">{formattedPrice}</p>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        onClick={deleteFromCart}
                        disabled={isSubtractDisabled}
                        label="-"
                        small
                        secondary
                    />
                    <span className="text-sm sm:text-base font-semibold min-w-[1.5rem] text-center">{existingQty}</span>
                    <Button 
                        onClick={addToCart}
                        label="+"
                        small
                        primary
                    />
                </div>
            </div>
        </div>
    )
}

export default DishCard