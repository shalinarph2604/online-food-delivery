import CartFeed from "@/components/general-cart/CartFeed";

const CartGeneralPage = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Your Carts</h1>
            <CartFeed />
        </div>
    )
}

export default CartGeneralPage;