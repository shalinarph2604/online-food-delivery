// the UI of restaurant list (I'll use card), search bar
import Layout from "@/components/Layout";
import RestaurantFeed from "@/components/restaurants/RestaurantFeed";

import { useState } from "react";

export default function HomePage() {

    const [search, setSearch] = useState('')

    const handleSearch = (query: string) => {
        setSearch(query)
    }
    
    return (
        <Layout onSearch={handleSearch}>
            <RestaurantFeed search={search} />
        </Layout>
    )
}