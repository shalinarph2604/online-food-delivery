// the UI of restaurant list (I'll use card), search bar
import Layout from "@/components/Layout";
import RestaurantFeed from "@/components/restaurants/RestaurantFeed";

export default function MainMenu() {
    return (
        <Layout>
            <div>
                <RestaurantFeed />
            </div>
        </Layout>
    )
}