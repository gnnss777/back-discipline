'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { chapters as chaptersMeta } from '@/lib/chapters'
import { exercises as exercisesData } from '@/data/exercises'

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

export async function seedChapters() {
  const supabase = await getAdminClient()

  // Check if already seeded
  const { count } = await supabase
    .from('chapters')
    .select('*', { count: 'exact', head: true })
  if (count && count > 0) return { success: true, count }

  // Seed from chapters.ts
  const rows = chaptersMeta.map((ch, i) => ({
    slug: ch.slug,
    title: ch.title,
    subtitle: null,
    part: ch.part || 'I',
    group_id: null,
    order_index: i,
    content_markdown: '',
    is_published: true,
  }))

  const { error } = await supabase.from('chapters').insert(rows)
  if (error) throw new Error(error.message)

  return { success: true, count: rows.length }
}

export async function seedExercises() {
  const supabase = await getAdminClient()

  // Check if already seeded
  const { count } = await supabase
    .from('exercises')
    .select('*', { count: 'exact', head: true })
  if (count && count > 0) return { success: true, count }

  const rows = exercisesData.map((ex, i) => ({
    slug: ex.id,
    name: ex.name,
    category: ex.category,
    muscles: ex.muscles,
    difficulty: ex.difficulty,
    description: ex.description,
    full_description: ex.fullDescription || '',
    tips: ex.tips || [],
    is_published: true,
    order_index: i,
  }))

  const { error } = await supabase.from('exercises').insert(rows)
  if (error) throw new Error(error.message)

  return { success: true, count: rows.length }
}
