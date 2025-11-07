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
            .select('*')
            .eq('user_id', currentUser.id)
            .eq('restaurant_id', req.query.restaurantCart)

            if (getCartError) {
                throw new Error(getCartError.message)
            }

            if (!getCart) {
                return res.status(200).json(null)
            }

        return res.status(200).json(getCart)

    } catch (error: any) {
        console.log('Error in general cart by ID API:', error)
        return res.status(500).json({ message: error.message || 'Internal server error' })
    }
}