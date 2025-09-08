// API for a specific checkout by ID
// isinya tracking status order, estimated delivery time, alamat, maps, total price, payment method, notes, tombol cancel order
// data di checkoutId akan dipakai untuk progress order page
// kalo orderan belum selesai, UI yang muncul adalah progress order
// kalo orderan udah selesai, UI yang muncul adalah review order/receipt order

import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/libs/serverAuth";
import supabase from "@/libs/supabase";

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET'
        && req.method !== 'DELETE'
        && req.method !== 'PATCH'
    ) {
        return res.status(405).end()
    }

    try {
        const { currentUser } = await serverAuth(req, res)

        if (!currentUser) {
            return res.status(401).json({ message: 'User not authenticated' })
        }

        if (req.method === 'GET') {
            const { checkoutId } = req.query

            if (typeof checkoutId !== 'string') {
                return res.status(400).json({ message: 'Invalid checkout ID' })
            }

            const { data: checkout, error: checkoutError } = await supabase
                .from('checkout')
                .select('*')
                .eq('id', checkoutId)
                .eq('user_id', currentUser.id)
                .single()

                if (checkoutError || !checkout) {
                    return res.status(404).json({ message: 'Checkout data not found' })
                }

            const { data: checkoutItems, error: itemsError } = await supabase
        }
    } catch (error) {
        console.error('Error in checkout API:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}