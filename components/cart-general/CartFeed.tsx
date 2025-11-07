/* eslint-disable @typescript-eslint/no-explicit-any */
import CartCard from "./CartCard";
import useCartGeneral from "@/hooks/useCartGeneral";
import { ClipLoader } from "react-spinners";


const CartFeed = () => {
    const { carts = [], isLoading } = useCartGeneral()

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <ClipLoader size={50} color={"#6a6a6a"} />
            </div>
        )
    }

    return (
        <div className="mt-4 gap-y-6">
            {carts.map((cart: any) => (
                <CartCard key={cart.restaurant_id} cartInfo={cart} />
            ))}
        </div>
    )
}

export default CartFeed;