import Modal from "../Modal";
import Image from 'next/image'
import Input from '../Input'
import axios from "axios";
import toast from "react-hot-toast";
import { getCart, updateCartItem, removeFromCart } from "@/services/cartService";

import useCartModal from "@/hooks/useCartModal";
import { useCallback, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

interface CartItem {
    id: string
    user_id: string
    restaurant_id: string
    dish_id: string
    quantity: number
    notes?: string
    created_at?: string
    dish?: {
        name: string
        price: number
        image_url: string
    }
}

interface CartModalProps {
    restaurantId?: string
}

const CartModal: React.FC<CartModalProps> = ({ 
    restaurantId
}) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const cartModal = useCartModal()
    const router = useRouter()

    const fetchCart = useCallback(() => {
        const getCartData = async () => {
            if (cartModal.isOpen && restaurantId) {
                try {
                    setIsLoading(true)
                    const data = await getCart(restaurantId)
                    setCartItems(data)

                } catch (error) {
                    console.log(error)
                } finally {
                    setIsLoading(false)
                }
            }
        }

        getCartData()
    },[cartModal.isOpen, restaurantId])

    useEffect(() => {
        if (!router.isReady) {
            return
        }
            fetchCart()
        }, [cartModal.isOpen, restaurantId, fetchCart, router.isReady])

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (!restaurantId) return
        
        try {
            await updateCartItem(restaurantId, itemId, { quantity: newQuantity })
            fetchCart() // Refresh cart data
        } catch (error) {
            console.log(error)
            toast.error("Failed to update quantity")
        }
    }

    const handleRemoveItem = async (itemId: string) => {
        if (!restaurantId) return
        
        try {
            await removeFromCart(restaurantId, itemId)
            fetchCart() // Refresh cart data
            toast.success("Item removed from cart")
        } catch (error) {
            console.log(error)
            toast.error("Failed to remove item")
        }
    }

    const handleUpdateNotes = async (itemId: string, notes: string) => {
        if (!restaurantId) return
        
        try {
            await updateCartItem(restaurantId, itemId, { notes })
        } catch (error) {
            console.log(error)
            toast.error("Failed to update notes")
        }
    }

    const readyToCheckout = async () => {
        if (!cartItems || cartItems.length === 0) return

        try {
            setIsLoading(true)

            // Send all cart items to checkout
            await axios.post((`/api/restaurant/${restaurantId}/checkout`), {
                cartItems: cartItems.map(item => ({
                    id: item.id,
                    dishId: item.dish_id,
                    name: item.dish?.name,
                    price: item.dish?.price,
                    quantity: item.quantity,
                    notes: item.notes,
                    imageUrl: item.dish?.image_url
                }))
            })

            cartModal.onClose()
            router.push(`/restaurant/${restaurantId}/checkout`)

        } catch (error) {
            console.log(error)
            toast.error("Error, cannot proceed to checkout")

        } finally {
            setIsLoading(false)
        }
    }

    const countTotalPrice = useMemo(() => {
        if (!cartItems || !cartItems.length) return 0
        return cartItems.reduce((accumulator, item) => 
            accumulator + (item.dish?.price ?? 0) * (item.quantity ?? 0), 0
        )
    }, [cartItems])

    const bodyContent = (
        <div>
            {isLoading ? (
                <div>Loading...</div>
            ) : cartItems.length === 0 ? (
                <div>There are no item here</div>
            ) : (
                cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center p-3 border-b">
                        <div className="relative w-20 h-20 rounded overflow-hidden">
                            <Image
                                src={item.dish?.image_url || '/placeholder-dish.jpg'}
                                alt={item.dish?.name || 'Dish'}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="font-medium">{item.dish?.name}</div>
                            <div className="text-purple-900 font-semibold">
                                {new Intl.NumberFormat('id-ID', { 
                                    style: 'currency', 
                                    currency: 'IDR'
                                }).format(item.dish?.price ?? 0)}
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 my-2">
                                <button
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="px-3 py-1 bg-gray-100 rounded">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                >
                                    +
                                </button>
                            </div>

                            {/* Notes Input */}
                            <Input 
                                placeholder="Add your notes here"
                                onChange={(e) => handleUpdateNotes(item.id, e.target.value)}
                                value={item.notes || ''}
                                aria-label="Notes"
                                type="text"
                            />

                            {/* Remove Button */}
                            <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="mt-2 text-red-500 text-sm hover:text-red-700"
                            >
                                Remove
                            </button>
                        </div>                        
                    </div>
                ))
            )}    
        </div>
    )

    const footerContent = (
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold">Total:</div>
            <div className="text-xl font-bold text-purple-900">
                {new Intl.NumberFormat('id-ID', { 
                    style: 'currency', 
                    currency: 'IDR'
                }).format(countTotalPrice)}
            </div>
        </div>
    )

    return (
        <Modal 
            onSubmit={readyToCheckout}
            isOpen={cartModal.isOpen}
            onClose={cartModal.onClose}
            title="Cart"
            body={bodyContent}
            footer={footerContent}
            actionLabel="Checkout"
            disabled={isLoading}
        />
    )
}

export default CartModal