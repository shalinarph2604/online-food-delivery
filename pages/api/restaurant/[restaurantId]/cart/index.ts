/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import supabaseAdmin from "@/libs/supabaseAdmin";

// to view the cart items and add items to the cart
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST' && req.method !== 'GET') {
        return res.status(405).end();
    }

    try {
        const { currentUser } = await serverAuth(req, res)

        if (!currentUser) {
            return res.status(401).json({ message: 'User not authenticated' })
        }

        if (req.method === 'GET') {
            const { restaurantId } = req.query

            if (typeof restaurantId !== 'string') {
                return res.status(400).json({ message: 'Invalid restaurant ID' })
            }

            const { data: cart, error: cartError } = await supabaseAdmin
                .from('cart')
                .select(`
                    *,
                    dishes(
                        name,
                        price,
                        image_url
                    )
                `)
                .eq('restaurant_id', restaurantId)
                .eq('user_id', currentUser.id)

                if (cartError) {
                    console.error('Cart query error:', cartError)
                    return res.status(500).json({ message: 'Cannot retrieve cart', error: cartError.message })
                }
                
                if (!cart || cart.length === 0) {
                    return res.status(200).json([])
                }

            // Transform response to match expected structure (dishes -> dish)
            const transformedCart = cart.map((item: any) => ({
                ...item,
                dish: item.dishes || item.dish
            }))

            return res.status(200).json(transformedCart)
        }

        if (req.method === 'POST') {
            const { dishId, quantity, price, notes, image_url, total_price } = req.body
            const { restaurantId } = req.query

            if (typeof restaurantId !== 'string') {
                return res.status(400).json({ message: 'Invalid restaurant ID' })
            }

            if (!dishId || typeof dishId !== 'string' || !quantity || typeof quantity !== 'number') {
                return res.status(400).json({ message: 'Invalid dish ID or quantity' })
            }
            // Try to insert; if unique violation occurs, increment quantity instead
            const { data: inserted, error: insertError } = await supabaseAdmin 
                .from('cart')
                .insert([
                    {
                        user_id: currentUser.id,
                        restaurant_id: restaurantId,
                        dish_id: dishId,
                        quantity: quantity,
                        price: price,
                        notes: notes || null,
                        image_url: image_url,
                        total_price: total_price,
                    }
                ])
                .select()
                .single()

            if (!inserted && insertError) {
                // Unique violation (duplicate) → increment quantity
                if ((insertError as any).code === '23505') {
                    const { data: existingRow, error: fetchErr } = await supabaseAdmin
                        .from('cart')
                        .select('*')
                        .eq('user_id', currentUser.id)
                        .eq('restaurant_id', restaurantId)
                        .eq('dish_id', dish_id)
                        .single()

                    if (fetchErr || !existingRow) {
                        return res.status(400).json({ message: fetchErr?.message || 'Failed to locate existing cart item', details: (fetchErr as any)?.details, code: (fetchErr as any)?.code })
                    }

                    const newQty = Number(existingRow.quantity ?? 0) + Number(quantity)

                    const { data: updatedRow, error: updateErr } = await supabaseAdmin
                        .from('cart')
                        .update({ quantity: newQty })
                        .eq('id', existingRow.id)
                        .select()
                        .single()

                    if (updateErr) {
                        return res.status(400).json({ message: updateErr.message || 'Failed to update cart quantity', details: (updateErr as any).details, code: (updateErr as any).code })
                    }

                    return res.status(200).json(updatedRow)
                }

                // Other errors
                return res.status(400).json({ message: insertError.message || 'Failed to add item to cart', details: (insertError as any).details, code: (insertError as any).code })
            }

            return res.status(200).json(inserted)
        }

    } catch (error: any) {
        console.error('Error in cart API:', error)
        return res.status(500).json({ message: error.message || 'Internal server error' })
    }
}
