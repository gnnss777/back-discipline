'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getAdminClient() {
  const cookieStore = await cookies()
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    }
  )
}

export async function getProfiles() {
  const supabase = await getAdminClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function updateProfileRole(userId: string, role: 'admin' | 'editor') {
  const supabase = await getAdminClient()

  // Fetch current role of target user
  const { data: target, error: fetchError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  if (fetchError) throw new Error(fetchError.message)

  // Prevent removing the last admin
  if (role === 'editor' && target?.role === 'admin') {
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin')
    if (countError) throw new Error(countError.message)
    if (count === 1) {
      throw new Error('Não é possível remover o último administrador')
    }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)
  if (error) throw new Error(error.message)
}
