'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { AdminExercise } from '@/types/admin'

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

export async function getExercises(): Promise<AdminExercise[]> {
  const supabase = await getAdminClient()
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .order('order_index', { ascending: true, nullsFirst: false })
  if (error) throw new Error(error.message)
  return (data as AdminExercise[]) ?? []
}

export async function getExercise(id: string): Promise<AdminExercise | null> {
  const supabase = await getAdminClient()
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data as AdminExercise
}

export async function updateExercise(
  id: string,
  payload: Partial<Pick<AdminExercise, 'name' | 'category' | 'description' | 'full_description' | 'tips' | 'difficulty' | 'muscles' | 'is_published'>>
) {
  const supabase = await getAdminClient()
  const { error } = await supabase
    .from('exercises')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function createExercise(payload: {
  slug: string
  name: string
  category: string
}) {
  const supabase = await getAdminClient()
  const { error } = await supabase
    .from('exercises')
    .insert(payload)
  if (error) throw new Error(error.message)
}
