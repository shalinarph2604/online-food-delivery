/* eslint-disable @typescript-eslint/no-explicit-any */
import CartCard from "./CartCard";
import useCartGeneral from "@/hooks/useCartGeneral";
import { ClipLoader } from "react-spinners";


const CartFeed = () => {
    const { carts = [], isLoading } = useCartGeneral()

    console.log("CARTFEED carts:", carts)


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <ClipLoader size={50} color={"#6a6a6a"} />
            </div>
        )
    }

    const groupedByRestaurant = carts.reduce((acc: any, item: any) => {
        const restaurantId = item.restaurant_id
        if (!acc[restaurantId]) {
            acc[restaurantId] = {
                restaurant_id: restaurantId,
                restaurant: item.restaurant,
                items: []
            }
        }
        acc[restaurantId].items.push(item)
        return acc
    }, {})

    const groupedCarts = Object.values(groupedByRestaurant)

    return (
        <div className="mt-4 gap-y-6">
            {groupedCarts.map((group: any) => (
                <CartCard key={group.restaurant_id} restaurantCart={group.restaurant_id} cartInfo={group} />
            ))}
        </div>
    )
}

export default CartFeed;