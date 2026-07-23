'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { AdminChapter, ContentVersion } from '@/types/admin'
import { chapters as chaptersMeta } from '@/lib/chapters'

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
  if (error || !data || data.length === 0) {
    // Fallback to TS files
    return chaptersMeta.map((ch, i) => ({
      id: ch.slug,
      slug: ch.slug,
      title: ch.title,
      subtitle: ch.description || null,
      part: ch.part || 'I',
      group_id: null,
      order_index: ch.order,
      content_markdown: '',
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updated_by: null,
    }))
  }
  return data as AdminChapter[]
}

export async function getChapter(id: string): Promise<AdminChapter | null> {
  const supabase = await getAdminClient()
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', id)
    .single()
  if (error) {
    // Fallback: try finding by slug
    const ch = chaptersMeta.find(c => c.slug === id || c.id === id)
    if (!ch) return null
    return {
      id: ch.slug,
      slug: ch.slug,
      title: ch.title,
      subtitle: ch.description || null,
      part: ch.part || 'I',
      group_id: null,
      order_index: ch.order,
      content_markdown: '',
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updated_by: null,
    } as AdminChapter
  }
  return data as AdminChapter
}

export async function updateChapter(
  id: string,
  payload: Partial<Pick<AdminChapter, 'title' | 'subtitle' | 'content_markdown' | 'is_published' | 'part' | 'order_index'>>
) {
  const supabase = await getAdminClient()

  // Check if this is a UUID (existing DB row) or a slug (TS fallback)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

  if (isUuid) {
    const { error } = await supabase
      .from('chapters')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    // TS fallback chapter: find chapter metadata and create in DB
    const { chapters: chaptersMeta } = await import('@/lib/chapters')
    const meta = chaptersMeta.find(c => c.slug === id)
    const { error } = await supabase
      .from('chapters')
      .insert({
        slug: id,
        title: payload.title || meta?.title || id,
        subtitle: payload.subtitle || meta?.description || null,
        part: payload.part || meta?.part || 'I',
        order_index: payload.order_index ?? meta?.order ?? 0,
        content_markdown: payload.content_markdown || '',
        is_published: payload.is_published ?? true,
        updated_at: new Date().toISOString(),
      })
    if (error) throw new Error(error.message)
  }
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
