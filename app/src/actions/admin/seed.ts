'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { chapters as chaptersMeta, chapterGroups } from '@/lib/chapters'
import { chapterContents } from '@/lib/content'
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

export async function seedAll() {
  const supabase = await getAdminClient()
  const results: { chapters?: number; exercises?: number; errors?: string[] } = {}
  const errors: string[] = []

  // Check if already seeded
  const { count: chapCount, error: chapCheckErr } = await supabase
    .from('chapters')
    .select('*', { count: 'exact', head: true })
  if (chapCheckErr) errors.push(chapCheckErr.message)

  if (!chapCount || chapCount === 0) {
    // Seed chapters
    const chapterRows = chaptersMeta.map((ch, i) => {
      // Find which group this chapter belongs to
      const group = chapterGroups.find(g => g.children.includes(ch.slug))
      const contentMarkdown = chapterContents[ch.slug] || ''

      return {
        slug: ch.slug,
        title: ch.title,
        subtitle: ch.description || null,
        part: ch.part || 'I',
        group_id: group?.id || null,
        order_index: ch.order,
        content_markdown: contentMarkdown,
        is_published: true,
      }
    })

    const { error: insertErr } = await supabase.from('chapters').insert(chapterRows)
    if (insertErr) {
      errors.push(`chapters: ${insertErr.message}`)
    } else {
      results.chapters = chapterRows.length
    }
  } else {
    results.chapters = chapCount
  }

  // Seed exercises
  const { count: exCount, error: exCheckErr } = await supabase
    .from('exercises')
    .select('*', { count: 'exact', head: true })
  if (exCheckErr) errors.push(exCheckErr.message)

  if (!exCount || exCount === 0) {
    const exerciseRows = exercisesData.map((ex, i) => ({
      slug: ex.id,
      name: ex.name,
      category: ex.category,
      muscles: ex.muscles || [],
      difficulty: ex.difficulty || 'Intermediário',
      description: ex.description || '',
      full_description: ex.fullDescription || '',
      tips: ex.tips || [],
      is_published: true,
      order_index: i,
    }))

    const { error: insertErr } = await supabase.from('exercises').insert(exerciseRows)
    if (insertErr) {
      errors.push(`exercises: ${insertErr.message}`)
    } else {
      results.exercises = exerciseRows.length
    }
  } else {
    results.exercises = exCount
  }

  return { ...results, errors: errors.length > 0 ? errors : undefined }
}
