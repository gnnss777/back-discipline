'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/app/supabase/server'

export async function updateDisplayName(formData: FormData) {
  const name = formData.get('name') as string

  let supabase
  try {
    supabase = await createSupabaseServerClient()
  } catch {
    return { error: 'Supabase não configurado. Configure as variáveis de ambiente.' }
  }

  const { error } = await supabase.auth.updateUser({
    data: { display_name: name },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/perfil')
  revalidatePath('/dashboard')
  return { success: true }
}
