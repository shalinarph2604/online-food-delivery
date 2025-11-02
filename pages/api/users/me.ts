/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    try {
        const session = await getServerSession(req, res, authOptions)
        if (!session) return res.status(401).json({ message: 'User not authenticated' })
        return res.status(200).json({ user: session.user })

    } catch (error: any) {
        console.error('Error in user profile API:', error)
        return res.status(500).json({ message: error.message || 'Internal server error' })
    }
} 