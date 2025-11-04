// the UI of restaurant details, including the menu and reviews
import DishesFeed from "@/components/dishes/DishesFeed";
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
        <Layout>
            <DishesFeed
                restaurantId={restaurantId as string}
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