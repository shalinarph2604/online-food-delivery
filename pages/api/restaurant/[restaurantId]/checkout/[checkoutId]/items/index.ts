/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/libs/serverAuth";
import supabase from "@/libs/supabase";

// api for getting all items in each checkoutId
export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).end()
    }

    try {
        const { currentUser } = await serverAuth(req, res)
            if (!currentUser) {
                return res.status(401).json({ message: 'User not authenticated' })
            }

        const { checkoutId } = req.query
            if (!checkoutId || typeof checkoutId !== 'string') {
                return res.status(400).json({ message: 'Invalid checkout ID' })
            }
        
        const { data, error } = await supabase
            .from('checkout_items')
            .select('*')
            .eq('checkout_id', checkoutId)
            
            if (error) throw new Error ('Error fetching checkout items')
        return res.status(200).json(data)

    } catch (error: any) {
        console.error('Error in checkout items API:', error)
        return res.status(500).json({ message: error.message || 'Internal server error' })
    }
}