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
    quantity?: number
}

const DishCard: React.FC<DishCardProps> = ({
    restaurantId, dishId, quantity
}) => {

    const {
        addButton,
        subtractButton,
        existing = [],
        isProcessing
    } = useAddDish({ restaurantId, dishId })

    const { dish } = useDish({ restaurantId, dishId })

    const { user } = useCurrentUser()

    const loginModal = useLoginModal()

    const existingItem = Array.isArray(existing)
        ? existing.find((it: any) => it.dish_id === dishId) ?? null
        : existing ?? null

// disable subtract if quantity = 0 or processing or explicitly disabled
    const existingQty = existingItem ? Number(existing.quantity ?? 0) : 0
    const isSubtractDisabled = Number(quantity) <= 0 || existingQty <= 0 || isProcessing

    const addToCart = useCallback(() => {

        if (!user) return loginModal.onOpen()

        addButton()
    }, [addButton, loginModal, user])

    const deleteFromCart = useCallback(() => {
        if (isSubtractDisabled) return

        if (!user) return loginModal.onOpen()

        subtractButton()
    }, [subtractButton, loginModal, user, isSubtractDisabled])


    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl cursor-pointer overflow-hidden">
            <div className="relative h-48 w-full">
                {dish?.image_url ? (
                    <Image src={dish.image_url} alt={dish.name ?? "Dish"} fill/>
                ) : (
                    <div className="h-full w-full bg-gray-100" />
                )}
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                    <h2 className="text-xl font-bold mb-2 truncate">{dish?.name}</h2>
                    <p className="text-purple-900 text-lg truncate">{dish?.price}</p>
                </div>
                <div className="items-center gap-0.5">
                    <Button
                        onClick={deleteFromCart} 
                        disabled={isSubtractDisabled}
                        label="-"
                        small
                        secondary
                    />
                    <span className="text-sm font-normal">{existingQty}</span>
                    <Button 
                        onClick={addToCart}
                        label="+"
                        small
                        secondary
                    />
                </div>
            </div>
        </div>
    )
}

export default DishCard