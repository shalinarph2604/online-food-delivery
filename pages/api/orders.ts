/* eslint-disable @typescript-eslint/no-explicit-any */
// make order list and GET all of user's orders
// fetch data dari database checkout + checkout_items

import { NextApiRequest, NextApiResponse } from 'next';
import serverAuth from '@/libs/serverAuth';
import supabase from '@/libs/supabase';

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    try {
        const { currentUser } = await serverAuth(req, res)

        if (!currentUser) {
            return res.status(401).json({ message: 'User not authenticated' })
        }

        const { data: orders, error: ordersError } = await supabase
            .from('checkout')
            .select('*, checkout_items(*)')
            .eq('user_id', currentUser.id)

        if (ordersError) {
            throw new Error(ordersError.message)
        }

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' })
        }

        return res.status(200).json(orders)
    } catch (error: any) {
        console.error('Error in dish API:', error)
        return res.status(500).json({ message: error.message || 'Internal server error' })
    }
}