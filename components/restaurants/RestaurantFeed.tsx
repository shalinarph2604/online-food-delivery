/* eslint-disable @typescript-eslint/no-explicit-any */
import RestaurantCard from "./RestaurantCard";
import useRestaurants from "@/hooks/useRestaurants";

const RestaurantFeed: React.FC = () => {
    const { restaurants = [] } = useRestaurants()
    return (
        <div className="pt-18 px-4 pb-6">
            <div className="mb-8">
                <h3 className="text-3xl font-sans font-bold text-purple-900">What do you want to eat?</h3>
            </div>
            <div className="grid grid-cols-2 gap-8">
                {restaurants.map((restaurant: any) => (
                    <RestaurantCard
                        key={restaurant.id}
                        id={restaurant.id}
                        name={restaurant.name}
                        imageUrl={restaurant.image_url}
                        address={restaurant.address}
                        category={restaurant.category}
                        rating={restaurant.rating}
                    />
                ))}
            </div>
        </div> 
    )
}

export default RestaurantFeed
