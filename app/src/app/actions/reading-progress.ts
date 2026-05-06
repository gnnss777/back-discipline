'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/app/supabase/server'

export async function upsertReadingProgress(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Não autorizado' }
  }

  const chapterSlug = formData.get('chapterSlug') as string
  const completed = formData.get('completed') === 'true'

  const { error } = await supabase
    .from('reading_progress')
    .upsert({
      user_id: user.id,
      chapter_slug: chapterSlug,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      last_read_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,chapter_slug',
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/livro')
  revalidatePath(`/livro/${chapterSlug}`)
  return { success: true }
}

export async function deleteReadingProgress(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Não autorizado' }
  }

  const chapterSlug = formData.get('chapterSlug') as string

  const { error } = await supabase
    .from('reading_progress')
    .delete()
    .eq('user_id', user.id)
    .eq('chapter_slug', chapterSlug)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/livro')
  revalidatePath(`/livro/${chapterSlug}`)
  return { success: true }
}
