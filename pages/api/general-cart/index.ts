/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/libs/serverAuth";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

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

        const { data: getCart, error: getCartError } = await supabaseAdmin
            .from('cart')
            .select('*')
            .eq('user_id', currentUser.id)

            if (getCartError) throw new Error(getCartError.message || 'Cannot get cart data')

            if (!getCart || getCart.length === 0) {
                return res.status(200).json([])
            }

        return res.status(200).json(getCart)
        
    } catch (error: any) {
        console.error('Error in dish API:', error)
        return res.status(500).json({ message: error.message || 'Internal server error' })
    }
}