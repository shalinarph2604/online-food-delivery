import Button from '../Button'
import useCartModal from '@/hooks/useCartModal'
import toast from 'react-hot-toast'
import React, { useCallback } from 'react'

interface CartButtonProps {
    restaurantId?: string
}

const CartButton: React.FC<CartButtonProps> = ({ restaurantId }) => {
    const cartModal = useCartModal()

    const openCartModal = useCallback(() => {
        if (!restaurantId || restaurantId.trim() === '') {
            toast.error('Invalid restaurant.')
            return
        } 
        cartModal.onOpen(restaurantId)

    }, [restaurantId, cartModal])

    return (
        <Button 
            label="View Cart"
            primary
            onClick={openCartModal}
        />
    )
}

export default CartButton