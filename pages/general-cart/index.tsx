import CartFeed from "@/components/cart-general/CartFeed";

const CartGeneralPage = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Your Carts</h1>
            <CartFeed />
        </div>
    )
}

export default CartGeneralPage;