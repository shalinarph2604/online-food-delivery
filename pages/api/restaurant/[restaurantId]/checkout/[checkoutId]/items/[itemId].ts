/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/libs/serverAuth";
import supabase from "@/libs/supabase";

// this api is to edit each item in checkout page
export default async function hanlder (
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
                return res.status(401).json({ message: 'User not authenticated'})
            }
        
        const { checkoutId, itemId } = req.query
            
            if (!checkoutId || typeof checkoutId !== 'string') {
                return res.status(400).json({ message: 'Invalid checkout ID' })
            }

        if (req.method === 'GET') {
            const { data: getItem, error: errorItem } = await supabase
                .from('checkout_items')
                .select('id, dish_id, quantity, notes')
                .eq('checkout_id', checkoutId)
                .eq('id', itemId)
                .single()

                if (errorItem) throw new Error ('Cannot retrieve an item')
            
            return res.status(200).json(getItem)
        }

        if (req.method === 'DELETE') {
            const { data: deleteItem, error: errorDelete } = await supabase
                .from('checkout_items')
                .delete()
                .eq('checkout_id', checkoutId)
                .eq('id', itemId)
                .select()
                .single()

                if (errorDelete) throw new Error ('Cannot delete this item')
            
            return res.status(200).json(deleteItem)
        }

        if (req.method === 'PATCH') {
            const { quantity, notes } = req.body
                if (quantity < 1 || quantity !== undefined || typeof quantity !== 'number') {
                    return res.status(400).json({ message: 'There\'s no item in the cart' })
                }

            const updateItem: any = {}
                if (quantity !== undefined) updateItem.quantity = quantity
                if (notes !== undefined) updateItem.notes = notes

            const { data: editItem, error: errorEdit } = await supabase
                .from('checkout_items')
                .update(updateItem)
                .eq('checkout_id', checkoutId)
                .eq('id', itemId)
                .select()
                .single()

                if (errorEdit) throw new Error ('Cannot edit your order')
            
            return res.status(200).json(editItem)
        }
    } catch (error: any) {
        console.error('Error in itemId API:', error)
        return res.status(500).json({ message: error.message || 'Internal server error' })
    }
}