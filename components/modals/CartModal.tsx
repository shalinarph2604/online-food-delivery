/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "../Modal";
import Image from 'next/image'
import Input from '../Input'
import axios from "axios";
import toast from "react-hot-toast";
import { getCart, updateCartItem, removeFromCart } from "@/services/cartService";

import useCartModal from "@/hooks/useCartModal";
import { useCallback, useState, useEffect, useMemo } from "react";
import { mutate as swrMutate } from 'swr'
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

const CartModal: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const cartModal = useCartModal()
    const router = useRouter()

    const fetchCart = useCallback(() => {
        const getCartData = async () => {
            if (cartModal.isOpen && cartModal.restaurantId) {
                try {
                    setIsLoading(true)
                    const data = await getCart(cartModal.restaurantId)
                    // Normalize response - handle both dish (singular) and dishes (plural) from API
                    const normalizedData = Array.isArray(data) ? data.map((item: any) => ({
                        ...item,
                        dish: item.dish || (Array.isArray(item.dishes) ? item.dishes[0] : item.dishes)
                    })) : []
                    setCartItems(normalizedData)

                } catch (error: any) {
                    console.error('Error fetching cart:', error)
                    toast.error(error?.response?.data?.message || 'Cannot retrieve cart')
                } finally {
                    setIsLoading(false)
                }
            }
        }

        getCartData()
    },[cartModal.isOpen, cartModal.restaurantId])

    useEffect(() => {
        if (!router.isReady) {
            return
        }
            fetchCart()
        }, [cartModal.isOpen, cartModal.restaurantId, fetchCart, router.isReady])

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (!cartModal.restaurantId) return
        
        try {
            await updateCartItem(cartModal.restaurantId, itemId, { quantity: newQuantity })
            fetchCart() // Refresh cart data
            // notify other views (e.g., DishesFeed) to revalidate cart/dishes
            swrMutate(`/api/restaurant/${cartModal.restaurantId}/cart`)
            swrMutate(`/api/restaurant/${cartModal.restaurantId}`)
        } catch (error) {
            console.log(error)
            toast.error("Failed to update quantity")
        }
    }

    const handleRemoveItem = async (itemId: string) => {
        if (!cartModal.restaurantId) return
        
        try {
            await removeFromCart(cartModal.restaurantId, itemId)
            fetchCart() // Refresh cart data
            toast.success("Item removed from cart")
            // notify other views (e.g., DishesFeed) to revalidate cart/dishes
            swrMutate(`/api/restaurant/${cartModal.restaurantId}/cart`)
            swrMutate(`/api/restaurant/${cartModal.restaurantId}`)
        } catch (error) {
            console.log(error)
            toast.error("Failed to remove item")
        }
    }

    const handleUpdateNotes = async (itemId: string, notes: string) => {
        if (!cartModal.restaurantId) return
        
        // optimistic local update so input reflects immediately
        setCartItems((prev) => prev.map((ci) => ci.id === itemId ? { ...ci, notes } : ci))
        
        try {
            await updateCartItem(cartModal.restaurantId, itemId, { notes })
            // revalidate cart so notes stay consistent
            swrMutate(`/api/restaurant/${cartModal.restaurantId}/cart`)
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
            await axios.post((`/api/restaurant/${cartModal.restaurantId}/checkout`), {
                cartItems: cartItems.map(item => ({
                    id: item.id,
                    dish_id: item.dish_id,
                    name: item.dish?.name,
                    price: item.dish?.price,
                    quantity: item.quantity,
                    notes: item.notes,
                    image_url: item.dish?.image_url
                }))
            })

            cartModal.onClose()
            router.push(`/restaurant/${cartModal.restaurantId}/checkout`)

        } catch (error) {
            console.log(error)
            toast.error("Error, cannot proceed to checkout")

        } finally {
            setIsLoading(false)
        }
    }

    const countTotalPrice = useMemo(() => {
        if (!cartItems || !cartItems.length) return 0
        return cartItems.reduce((accumulator, item) => {
            const price = Number(item.dish?.price ?? 0)
            const qty = Number(item.quantity ?? 0)
            return accumulator + price * qty
        }, 0)
    }, [cartItems])

    const bodyContent = (
        <div>
            {isLoading ? (
                <div>Loading...</div>
            ) : cartItems.length === 0 ? (
                <div>There are no item here</div>
            ) : (
                <div className="max-h-[60vh] overflow-y-auto pr-2">
                    {cartItems.map((item) => (
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
                            <div className="font-medium text-black text-lg">{item.dish?.name}</div>
                            <div className="text-purple-900 font-semibold">
                                {new Intl.NumberFormat('id-ID', { 
                                    style: 'currency', 
                                    currency: 'IDR'
                                }).format(Number(item.dish?.price ?? 0))}
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
                                className="mt-2 ml-5 text-red-500 text-sm hover:text-red-700"
                            >
                                Remove
                            </button>
                        </div>                        
                    </div>
                    ))}
                </div>
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