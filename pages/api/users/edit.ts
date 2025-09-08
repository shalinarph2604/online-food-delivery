/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next'
import serverAuth from '@/libs/serverAuth'
import supabase from '@/libs/supabase'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'PATCH') {
        return res.status(405).end()
    }

    try {
        const { currentUser } = await serverAuth(req, res)

        if (!currentUser) {
            return res.status(401).json({ message: 'User not authenticated' })
        }

        const { username, name, hashedPassword, address, phone, bio } = req.body

        const updateData: Record<string, any> = {}
        if (username !== undefined) updateData.username = username
        if (name !== undefined) updateData.name = name
        if (hashedPassword !== undefined) updateData.hashed_password = hashedPassword
        if (address !== undefined) updateData.address = address
        if (phone !== undefined) updateData.phone = phone
        if (bio !== undefined) updateData.bio = bio

        const { data: userData, error: userError } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', currentUser.id)
            .select('username, name, bio, address, phone')
            .single()

        if (userError) {
            console.log(userError)
            return res.status(400).end()
        }

        return res.status(200).json(userData)
    } catch (error) {
        console.log(error)
        return res.status(500).end()
    }
}