import { NextResponse } from 'next/server'
import { execSync } from 'child_process'
import { join } from 'path'
import { existsSync, statSync } from 'fs'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const PUBLIC_DIR = join(process.cwd(), 'public')

const PDF_FILES = {
  livro: 'back-discipline-livro.pdf',
  fundamentos: 'back-discipline-fundamentos.pdf',
  biblioteca: 'back-discipline-biblioteca.pdf',
} as const

type BookKey = keyof typeof PDF_FILES

export async function POST(request: Request) {
  // Auth check
  const cookieStore = await cookies()
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'editor'].includes(profile.role)) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  // Parse book from request body
  const body = await request.json().catch(() => ({}))
  const book = body.book as BookKey

  if (book && !PDF_FILES[book]) {
    return NextResponse.json({ error: 'Livro inválido' }, { status: 400 })
  }

  try {
    const scriptPath = join(process.cwd(), 'scripts', 'generate-pdf.ts')

    if (!existsSync(scriptPath)) {
      return NextResponse.json({ error: 'Script de geração não encontrado' }, { status: 500 })
    }

    // Run the full PDF generation script
    execSync(`npx tsx "${scriptPath}"`, {
      cwd: process.cwd(),
      timeout: 120000, // 2 min timeout
      stdio: 'pipe',
    })

    // Check all PDFs were generated
    const results = Object.entries(PDF_FILES).map(([key, filename]) => {
      const filePath = join(PUBLIC_DIR, filename)
      const exists = existsSync(filePath)
      const size = exists ? statSync(filePath).size : 0
      return {
        book: key,
        filename,
        generated: exists,
        size,
        url: `/${filename}`,
      }
    })

    return NextResponse.json({
      success: true,
      pdfs: results,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    console.error('PDF generation failed:', message)
    return NextResponse.json({
      success: false,
      error: message,
    }, { status: 500 })
  }
}
