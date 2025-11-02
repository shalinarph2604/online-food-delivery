/* eslint-disable @typescript-eslint/no-explicit-any */
// the UI of restaurant details, including the menu and reviews
import DishesFeed from "@/components/dishes/DishesFeed";
import Layout from "@/components/Layout";
import CartButton from "@/components/dishes/CartButton";

import { useRouter } from "next/router";
import { useState, useEffect, useCallback, useMemo } from "react";
import useCartModal from "@/hooks/useCartModal";
import axios from "axios";

const RestaurantView = () => {
    const router = useRouter()
    const { restaurantId } = router.query
    const cartModal = useCartModal()

    const [data, setData] = useState<Record<string, any> | null>(null)

    const openCartModal = useCallback(() => {
        cartModal.onOpen()
    }, [cartModal])

    useEffect(() => {
        if (restaurantId) {
            axios.get(`/api/restaurant/${restaurantId}`)
            .then(setData)
        }
    }, [restaurantId])

    if (!data) return <p>Loading...</p>

    return (
        <Layout>
            <DishesFeed
                restaurantId={restaurantId as string} 
                dishId={data.dishId}
            />
            <div className="fixed bottom-6 self-center">
                <CartButton 
                    restaurantId={restaurantId as string}

                />
            </div>
        </Layout>
    )
}

export default RestaurantView