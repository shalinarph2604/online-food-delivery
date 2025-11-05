// the UI of restaurant details, including the menu and reviews
import DishesFeed from "@/components/dishes/DishesFeed";
import useDishes from "@/hooks/useDishes";
import Layout from "@/components/Layout";
import CartButton from "@/components/dishes/CartButton";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";

const RestaurantView = () => {
    const router = useRouter()
    const [isPageReady, setIsPageReady] = useState(false)

    useEffect(() => {
        if (router.isReady) {
            setIsPageReady(true)
        }
    }, [router.isReady])

    if (!isPageReady) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen">
                    <ClipLoader size={50} color={"#F97316"} />
                </div>
            </Layout>
        )
    }

    const { restaurantId } = router.query
    const ridString = typeof restaurantId === 'string' ? restaurantId : undefined
    const { dishes = [] } = useDishes(ridString)
    const restaurantName = Array.isArray(dishes)
        ? (dishes.find((d: any) => d?.restaurant?.id === restaurantId)?.restaurant?.name ?? dishes[0]?.restaurant?.name ?? 'Restaurant')
        : 'Restaurant'
    
    if (!restaurantId || typeof restaurantId !== 'string') {
        return (
            <Layout>
                <div className="flex justify-center items-center h-full">
                    <p>Restaurant not found</p>
                </div>
            </Layout>
        )
    }

    return (
        <div>
            {/* Restaurant Header */}
            <div className="pt-28 px-4 pb-2">
                <h1 className="text-2xl font-bold">{restaurantName}</h1>
            </div>
            <DishesFeed
                restaurantId={restaurantId as string}
            />

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
                <CartButton 
                    restaurantId={restaurantId as string}
                />
            </div>
        </div>
    )
}

export default RestaurantView