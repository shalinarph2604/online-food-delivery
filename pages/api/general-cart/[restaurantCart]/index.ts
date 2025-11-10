/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/libs/serverAuth";
import supabase from "@/libs/supabase";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
            return res.status(405).end()
    }

    try {
        const { currentUser } = await serverAuth(req, res)

        if (!currentUser) {
            return res.status(401).json({ message: 'User not authenticated'})
        }  
        
        const { data: getCart, error: getCartError } = await supabase
            .from('cart')
            .select(`
                *,
                restaurant:restaurant_id (
                    name,
                    address
                ),
                dishes:dish_id (
                    name
                )
            `)
            .eq('user_id', currentUser.id)

            if (getCartError) throw new Error(getCartError.message)

            if (!getCart || getCart.length === 0) return res.status(200).json(null)

            const grouped = Object.values(
                getCart?.reduce((acc: any, item: any) => {
                    const restaurantId = item.restaurant_id
                    if (!acc[restaurantId]) {
                        acc[restaurantId] = {
                            restaurant_id: restaurantId,
                            restaurant: item.restaurant,
                            items: [],
                            total_price: 0
                        }
                    }
                    acc[restaurantId].items.push(item)
                    acc[restaurantId].total_price += (item.dishes?.price || 0) * (item.quantity || 1)
                    return acc
                }, {})
            )

            console.log('Grouped cart by restaurant:', grouped)

        return res.status(200).json(grouped)

    } catch (error: any) {
        console.log('Error in general cart by ID API:', error)
        return res.status(500).json({ message: error.message || 'Internal server error' })
    }

}