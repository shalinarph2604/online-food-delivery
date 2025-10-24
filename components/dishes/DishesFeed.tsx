/* eslint-disable @typescript-eslint/no-explicit-any */
import useDishes from "@/hooks/useDishes";
import DishCard from "./DishCard";

interface DishFeedProps {
    data: Record<string, any>
    restaurantId?: string
}

const DishesFeed: React.FC<DishFeedProps> = ({ data, restaurantId }) => {
    const { dishes = [] } = useDishes()

    return (
        <>
            {dishes.map((dish: Record<string, any>) => (
                <DishCard
                    key={dish.id} 
                    restaurantId={restaurantId}
                    data={data}
                />
            ))}
        </>
    )
}

export default DishesFeed