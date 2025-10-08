/* eslint-disable @typescript-eslint/no-explicit-any */
import RestaurantCard from "./RestaurantCard";
import useRestaurants from "@/hooks/useRestaurants";

const RestaurantFeed: React.FC = () => {
    const { restaurants = [] } = useRestaurants()
    return (
        <>
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
        </>
    )
}

export default RestaurantFeed
