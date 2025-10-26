/* eslint-disable @typescript-eslint/no-explicit-any */
// the UI of restaurant details, including the menu and reviews
import DishesFeed from "@/components/dishes/DishesFeed";
import Layout from "@/components/Layout";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";

const RestaurantView = () => {
    const router = useRouter()
    const { restaurantId } = router.query

    const [data, setData] = useState<Record<string, any> | null>(null)

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
                data={data}
                restaurantId={restaurantId as string} 
            />
        </Layout>
    )
}

export default RestaurantView