// the UI of restaurant details, including the menu and reviews
import DishesFeed from "@/components/dishes/DishesFeed";
import Layout from "@/components/Layout";

import { useRouter } from "next/router";
import React from "react";

const RestaurantView = () => {
    const router = useRouter()
    const { restaurantId } = router.query

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