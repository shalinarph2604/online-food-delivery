/* eslint-disable @typescript-eslint/no-explicit-any */
import useDishes from "@/hooks/useDishes";
import DishCard from "./DishCard";

interface DishFeedProps {
    restaurantId?: string
    dishId?: string
    quantity?: number
}

const DishesFeed: React.FC<DishFeedProps> = ({ restaurantId, dishId, quantity }) => {
    const { dishes = [] } = useDishes()

    return (
        <div className="pt-36 px-4 pb-6">
            <div className="grid grid-cols-2 gap-8">
                {dishes.map((dish: Record<string, any>) => (
                    <DishCard
                        key={dish.id} 
                        restaurantId={restaurantId}
                        dishId={typeof dishId === 'string' && dishId.trim() !== '' 
                                ? dishId : dish.id}
                        dish={dish as any}
                        quantity={quantity ?? dish.quantity ?? 0}
                    />
                ))}
            </div>
        </div>
    )
}

export default DishesFeed