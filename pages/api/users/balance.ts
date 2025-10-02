/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next'
import supabase from '@/libs/supabase'
import serverAuth from '@/libs/serverAuth'

// API route to get or update user balance
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET' && req.method !== 'PATCH') {
        return res.status(405).end()
    }

    try {
        const { currentUser } = await serverAuth(req, res)

        if (!currentUser) {
            return res.status(401).json({ message: 'User not authenticated' })
        }

        if (req.method === 'GET') {
            const { data: userBalance, error: errorBalance } = await supabase
                .from('users')
                .select('balance')
                .eq('id', currentUser.id)
                .single()
            
                if (errorBalance) throw new Error('Failed to retrieve balance')

                if (userBalance.balance === 0 || userBalance.balance === null) {
                    return res.status(200).json({ balance: 0 })
                }
            return res.status(200).json({ balance: userBalance.balance })
        }

        if (req.method === 'PATCH') {
            const { balance } = req.body

            if (typeof balance !== 'number' || balance < 0) {
                return res.status(400).json({ message: 'Invalid balance amount' })
            }

            const { data: updatedBalance, error: errorUpdating } = await supabase
                .from('users')
                .update({ balance })
                .eq('id', currentUser.id)
                .select('balance')
                .single()

                if (errorUpdating || !updatedBalance) throw new Error('Failed to update balance')

            return res.status(200).json(updatedBalance)
        }
    } catch (error: any) {
        console.log('Error in user balance API:', error)
        return res.status(500).json({ message: error.message || 'Internal server error' })
    }
}