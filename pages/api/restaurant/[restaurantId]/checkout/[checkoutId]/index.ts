/* eslint-disable @typescript-eslint/no-explicit-any */
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

        const { checkoutId } = req.query

            if (!checkoutId || typeof checkoutId !== 'string') {
                return res.status(400).json({ message: 'Invalid checkout ID' })
            }

        if (req.method === 'GET') {

            const { data: checkout, error: checkoutError } = await supabase
                .from('checkout')
                .select('*')
                .eq('id', checkoutId)
                .eq('user_id', currentUser.id)
                .single()
                
                if (checkoutError) throw new Error ('Failed to retrieve checkout data')

                if (!checkout) return res.status(404).json({ message: 'Checkout data not found' })

            const { data: checkoutItems, error: itemsError } = await supabase
                .from('checkout_items')
                .select('*')
                .eq('checkout_id', checkoutId)

                if (itemsError) throw new Error ('Failed to retrieve checkout items')

            return res.status(200).json({ checkout, items: checkoutItems })
        }

    // this api will use for cancel order
        if (req.method === 'DELETE') {

            const { data: deletedItems, error: itemsError } = await supabase
                .from('checkout_items')
                .delete()
                .eq('checkout_id', checkoutId)
                .select()

                if (itemsError) throw new Error('Failed to delete checkout items')

            const { data: deletedCheckout, error: deleteError } = await supabase
                .from('checkout')
                .delete()
                .eq('id', checkoutId)
                .eq('user_id', currentUser.id)
                .select()
                .single()

                if (deleteError) throw new Error('Failed to delete checkout')

            return res.status(200).json({ deletedCheckout, deletedItems })
        }
    
    // this api will use for update order status
        if (req.method === 'PATCH') {
            const { status } = req.body
            const validStatuses = ['pending', 'preparing', 'on the way', 'delivered', 'cancelled']

            if (!status || typeof status !== 'string' || !validStatuses.includes(status)) {
                return res.status(400).json({ message: 'Invalid status value' })
            }

            const { data: updatedStatus, error: updateError } = await supabase
                .from('checkout')
                .update({ status })
                .eq('id', checkoutId)
                .eq('user_id', currentUser.id)
                .select()
                .single()

                if (updateError) throw new Error ('Failed to update order status')

            return res.status(200).json(updatedStatus)
        }
    } catch (error: any) {
        console.error('Error in checkout API:', error)
        return res.status(500).json({ message: error.message || 'Internal server error' })
    }
}