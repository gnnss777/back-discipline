export interface AdminProfile {
  id: string
  display_name: string | null
  role: 'admin' | 'editor'
  created_at: string
}

export interface AdminChapter {
  id: string
  slug: string
  title: string
  subtitle: string | null
  part: string
  group_id: string | null
  order_index: number
  content_markdown: string
  is_published: boolean
  created_at: string
  updated_at: string
  updated_by: string | null
}

export interface AdminExercise {
  id: string
  slug: string
  name: string
  category: string
  muscles: string[]
  difficulty: string
  description: string
  full_description: string
  tips: string[]
  is_published: boolean
  order_index: number | null
  created_at: string
  updated_at: string
}

export interface ContentVersion {
  id: string
  chapter_id: string
  content_markdown: string
  created_by: string | null
  created_at: string
  change_summary: string | null
}
