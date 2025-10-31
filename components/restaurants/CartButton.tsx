import Button from '../Button'
import useCartModal from '@/hooks/useCartModal'
import { getCart } from '@/services/cartService'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

interface CartButtonProps {
    restaurantId?: string
}

const CartButton: React.FC<CartButtonProps> = ({ restaurantId }) => {
    const cartModal = useCartModal()
    const [isLoading, setIsLoading] = useState(false)
    const [cartCount, setCartCount] = useState<number>(0)

    const refreshCount = useCallback(async () => {
        if (!restaurantId) {
            setCartCount(0)
            return
        }
        try {
            setIsLoading(true)
            const data = await getCart(restaurantId)
            const count = Array.isArray(data) ? data.length : 0
            setCartCount(count)
        } catch {
            setCartCount(0)
        } finally {
            setIsLoading(false)
        }
    }, [restaurantId])

    useEffect(() => {
        void refreshCount()
    }, [refreshCount])

    const openCartModal = useCallback(() => {
        cartModal.onOpen()
    }, [cartModal])

    const isButtonDisabled = useMemo(() => {
        if (isLoading) return true
        if (!restaurantId) return true
        return cartCount === 0
    }, [isLoading, restaurantId, cartCount])

    return (
        <Button 
            label={isLoading ? 'Loading…' : `View Cart${cartCount ? ` (${cartCount})` : ''}`}
            primary
            onClick={openCartModal}
            disabled={isButtonDisabled}
        />
    )
}

export default CartButton