import { createClient } from '@supabase/supabase-js'

// Lazily create a server-side client with Service Role to avoid import-time crashes
export const getSupabaseAdmin = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url) {
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL env')
    }
    if (!serviceRoleKey) {
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY env')
    }

    return createClient(url, serviceRoleKey)
}

export default getSupabaseAdmin


