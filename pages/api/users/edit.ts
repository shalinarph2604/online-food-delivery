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

    // user can update one or more fields, so we need to create an object with only the fields that are provided
        const updateData: Record<string, any> = {}
        if (username !== undefined) updateData.username = username
        if (name !== undefined) updateData.name = name
        if (hashedPassword !== undefined) updateData.hashed_password = hashedPassword
        if (address !== undefined) updateData.address = address
        if (phone !== undefined) updateData.phone = phone
        if (bio !== undefined) updateData.bio = bio

        const { data: editedData, error: editedError } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', currentUser.id)
            .select('username, name, bio, address, phone')
            .single()

        if (editedError) throw new Error('Failed to update user data')

        return res.status(200).json(editedData)
    } catch (error: any) {
        console.error('Error in edit user profile:', error)
        return res.status(500).json({ message: error.message || 'Internal server error' })
    }
}