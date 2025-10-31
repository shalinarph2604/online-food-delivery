/* eslint-disable @typescript-eslint/no-explicit-any */
import useDishes from "@/hooks/useDishes";
import useRestaurants from "@/hooks/useRestaurants";
import DishCard from "./DishCard";

interface DishFeedProps {
    restaurantId?: string
    dishId?: string
}

const DishesFeed: React.FC<DishFeedProps> = ({ restaurantId, dishId }) => {
    const { dishes = [] } = useDishes()

    return (
        <div className="pt-36 px-4 pb-6">
            <div className="grid grid-cols-2 gap-8">
                {dishes.map((dish: Record<string, any>) => (
                    <DishCard
                        key={dish.id} 
                        restaurantId={restaurantId}
                        dishId={dishId}
                    />
                ))}
            </div>
        </div>
    )
}

export default DishesFeed