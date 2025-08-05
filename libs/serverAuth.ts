import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { Session } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

import supabase from '@/libs/supabase'

const serverAuth = async (
    req: NextApiRequest,
    res: NextApiResponse,
) => {
    const session = await getServerSession(req, res, authOptions) as Session

    if (!session?.user?.email) {
        throw new Error('Not signed in')
    }
    
    const currentUser = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single()

    if (!currentUser.data) {
        throw new Error('Not signed in')
    }

    return { currentUser: currentUser.data, session }
}

export default serverAuth;