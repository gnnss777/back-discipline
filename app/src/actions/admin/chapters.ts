'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { AdminChapter, ContentVersion } from '@/types/admin'

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

export async function getChapters(): Promise<AdminChapter[]> {
  const supabase = await getAdminClient()
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .order('order_index')
  if (error) throw new Error(error.message)
  return (data as AdminChapter[]) ?? []
}

export async function getChapter(id: string): Promise<AdminChapter | null> {
  const supabase = await getAdminClient()
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data as AdminChapter
}

export async function updateChapter(
  id: string,
  payload: Partial<Pick<AdminChapter, 'title' | 'subtitle' | 'content_markdown' | 'is_published' | 'part' | 'order_index'>>
) {
  const supabase = await getAdminClient()
  const { error } = await supabase
    .from('chapters')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function createChapter(
  payload: Pick<AdminChapter, 'slug' | 'title' | 'part' | 'order_index'>
) {
  const supabase = await getAdminClient()
  const { error } = await supabase
    .from('chapters')
    .insert(payload)
  if (error) throw new Error(error.message)
}

export async function getChapterVersions(chapterId: string): Promise<ContentVersion[]> {
  const supabase = await getAdminClient()
  const { data, error } = await supabase
    .from('content_versions')
    .select('*')
    .eq('chapter_id', chapterId)
    .order('created_at', { ascending: false })
    .limit(10)
  if (error) throw new Error(error.message)
  return (data as ContentVersion[]) ?? []
}
