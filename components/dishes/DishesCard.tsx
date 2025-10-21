import React, { useCallback, useState } from "react"
import Button from "../Button"
import Image from "next/image"

import axios from "axios"
import toast from "react-hot-toast"

interface DishesCardProps {
    id: string
    restaurantId: string
    name: string
    price: number
    quantity: number
    imageUrl: string
}

const DishesCard: React.FC<DishesCardProps> = ({
    id,
    restaurantId,
    name,
    price,
    quantity,
    imageUrl,
}) => {
    const [isAdding, setIsAdding] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const addToCart = useCallback(async () => {
        try {
            setIsAdding(true)

            await axios.post('/api/cart', {
                id,
                restaurantId,
                name,
                price,
                quantity: quantity + 1,
                imageUrl
            })

            toast.success('Added to cart')
        } catch (error) {
            console.log(error)
            toast.error('Cannot add item to the cart')
        } finally {
            setIsAdding(false)
        }

    }, [id, restaurantId, name, price, quantity, imageUrl])


    const handleDeleteItem = useCallback(async () => {
        try {
            setIsDeleting(true)

            await axios.delete('/api/cart', {
                data: {
                    id,
                    restaurantId,
                    name,
                    price,
                    quantity: Math.max(0, quantity - 1),
                    imageUrl
                }
            })

            toast.success('Removed from cart')
        } catch (error) {
            console.log(error)
            toast.error('Cannot remove item from the cart')
        } finally {
            setIsDeleting(false)
        }
    }, [id, restaurantId, name, price, quantity, imageUrl])

    return (
        <div>
            <div>
                <Image src={imageUrl} alt={name} />
            </div>
            <h2>{name}</h2>
            <p>{price}</p>
            <div>
                <Button 
                    onClick={handleDeleteItem}
                    label="-"
                    
                />
            </div>
        </div>
    )
}

export default DishesCard