/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import RestaurantCard from "./RestaurantCard";
import useRestaurants from "@/hooks/useRestaurants";

interface RestaurantFeedProps {
    search?: string;
}

const RestaurantFeed: React.FC<RestaurantFeedProps> = ({ search }) => {
    const { restaurants = [] } = useRestaurants()

    const filteredRestaurants = useMemo(() => {
        if (!search?.trim()) {
            console.log('No search query, returning all restaurants', restaurants.length);
            return restaurants;
        }

        // filter restaurants by name, category, address
        const query = search.toLowerCase().trim(); 
        const filtered = restaurants.filter((restaurant: any) => {
            const nameMatch = restaurant.name?.toLowerCase().includes(query)
            const categoryMatch = restaurant.category?.toLowerCase().includes(query)
            const addressMatch = restaurant.address?.toLowerCase().includes(query)

            return nameMatch || categoryMatch || addressMatch
        })

        console.log('Filtered restaurants:', filtered.length);
        return filtered;
        
    }, [search, restaurants])

    return (
        <div className="pt-36 px-4 pb-6">
            {/* Header */}
            <div className="mb-8">
                <h3 className="text-3xl font-sans font-bold text-purple-900">
                    {search ? `Search results for "${search}"` : "What do you want to eat?"}
                </h3>
                <p className="text-gray-600 mt-2">
                    {filteredRestaurants.length} {filteredRestaurants.length !== 1 ? 's' : ''} found
                </p>
            </div>

            {/* Restaurant Grid */}
            {filteredRestaurants.length > 0 ? (
                <div className="grid grid-cols-2 gap-8">
                    {filteredRestaurants.map((restaurant: any) => (
                        <RestaurantCard
                            key={restaurant.id}
                            id={restaurant.id}
                            name={restaurant.name}
                            image_url={restaurant.image_url}
                            address={restaurant.address}
                            category={restaurant.category}
                            rating={restaurant.rating}
                        />
                    ))}
                </div>
            ) : (
            <div className="text-center py-16">
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                    No restaurants found
                </h3>
                <p className="text-gray-600">
                    Try searching with different keywords
                </p>
            </div>
            )}
        </div> 
    )
}

export default RestaurantFeed
