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
        return { currentUser: null, session: null as unknown as Session }
    }
    
    const currentUser = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single()

    if (!currentUser.data) {
        return { currentUser: null, session }
    }

    return { currentUser: currentUser.data, session }
}

export default serverAuth;