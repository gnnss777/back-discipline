import type { Block, BlockType } from '@/types/blocks'

let counter = 0
export function generateId(): string {
  counter += 1
  return `${Date.now().toString(36)}-${counter.toString(36)}`
}

export function makeBlock<T extends BlockType>(type: T, partial?: Partial<Block>): Block {
  switch (type) {
    case 'paragraph':
      return { id: generateId(), type: 'paragraph', content: '', ...(partial as any) }
    case 'heading':
      return { id: generateId(), type: 'heading', level: 2, content: '', ...(partial as any) }
    case 'tip':
      return { id: generateId(), type: 'tip', content: '', ...(partial as any) }
    case 'warning':
      return { id: generateId(), type: 'warning', content: '', ...(partial as any) }
    case 'quote':
      return { id: generateId(), type: 'quote', content: '', ...(partial as any) }
    case 'exercise':
      return { id: generateId(), type: 'exercise', title: '', content: '', ...(partial as any) }
    case 'list':
      return { id: generateId(), type: 'list', ordered: false, items: [], ...(partial as any) }
    case 'library_item':
      return { id: generateId(), type: 'library_item', exercise_slug: '', ...(partial as any) }
    default:
      return { id: generateId(), type: 'paragraph', content: '' }
  }
}

const EXERCISE_RE = /^###\s+(Exercício\s+\d+|(\d+\.))[\s:]/i
const STATS_RE = /^\*\*.*[\d×x]|^\*\*.*RPE|^\*\*.*série|^\*\*.*reps/i
const DICA_RE = /^\*\*(Dica|Dica técnica|Dica avançada|Dica de Meadows):/i
const WARNING_RE = /^\*\*(Cuidado|Aviso):/i

export function parseMarkdownToBlocks(md: string): Block[] {
  const rawBlocks = md.split(/\n{2,}/)
  const blocks: Block[] = []

  for (let i = 0; i < rawBlocks.length; i++) {
    const raw = rawBlocks[i]
    const trimmed = raw.trim()
    if (!trimmed) continue

    // :::tip\n...\n:::
    const tipMatch = /^:::tip\n([\s\S]*?)\n:::$/.exec(trimmed)
    if (tipMatch) {
      blocks.push(makeBlock('tip', { content: tipMatch[1].trim() }))
      continue
    }
    const warningMatch = /^:::warning\n([\s\S]*?)\n:::$/.exec(trimmed)
    if (warningMatch) {
      blocks.push(makeBlock('warning', { content: warningMatch[1].trim() }))
      continue
    }
    const exerciseBlockMatch = /^:::exercise\n([\s\S]*?)\n:::$/.exec(trimmed)
    if (exerciseBlockMatch) {
      const inner = exerciseBlockMatch[1].trim()
      const titleMatch = /^##\s+(.+)$/m.exec(inner)
      const musclesMatch = /^\*\*M\u00fasculos:\*\*\s*(.+)$/m.exec(inner)
      const contentAfter = inner
        .split(/\n+/)
        .filter((l) => !/^##\s/.test(l) && !/^\*\*M/.test(l))
        .join('\n')
        .trim()
      blocks.push(
        makeBlock('exercise', {
          title: titleMatch ? titleMatch[1].trim() : '',
          muscles: musclesMatch ? musclesMatch[1].trim() : undefined,
          content: contentAfter,
        }),
      )
      continue
    }
    const quoteMatch = /^:::quote\n([\s\S]*?)\n:::$/.exec(trimmed)
    if (quoteMatch) {
      blocks.push(makeBlock('quote', { content: quoteMatch[1].trim() }))
      continue
    }

    // Heading 1
    if (trimmed.startsWith('# ')) {
      blocks.push(makeBlock('heading', { level: 1, content: trimmed.slice(2).trim() }))
      continue
    }
    // Heading 2
    if (trimmed.startsWith('## ')) {
      blocks.push(makeBlock('heading', { level: 2, content: trimmed.slice(3).trim() }))
      continue
    }
    // Heading 3
    if (trimmed.startsWith('### ')) {
      if (EXERCISE_RE.test(trimmed)) {
        blocks.push(
          makeBlock('exercise', { title: trimmed.replace(/^###\s+/, '').trim(), content: '' }),
        )
      } else {
        blocks.push(makeBlock('heading', { level: 3, content: trimmed.slice(4).trim() }))
      }
      continue
    }

    // Tip via **Dica:** (legacy syntax)
    if (DICA_RE.test(trimmed)) {
      const content = trimmed.replace(DICA_RE, '').trim()
      blocks.push(makeBlock('tip', { content: `Dica: ${content}` }))
      continue
    }
    if (WARNING_RE.test(trimmed)) {
      const content = trimmed.replace(WARNING_RE, '').trim()
      blocks.push(makeBlock('warning', { content: `${trimmed.match(WARNING_RE)![1]}: ${content}` }))
      continue
    }

    // Bullet list
    if (/^(- |\* )/m.test(trimmed)) {
      const items = trimmed
        .split(/\n/)
        .map((l) => l.replace(/^(- |\* )/, '').trim())
        .filter(Boolean)
      if (items.length > 0) {
        blocks.push(makeBlock('list', { items, ordered: false }))
        continue
      }
    }
    // Ordered list
    if (/^\d+\.\s/m.test(trimmed)) {
      const items = trimmed
        .split(/\n/)
        .map((l) => l.replace(/^\d+\.\s*/, '').trim())
        .filter(Boolean)
      if (items.length > 0) {
        blocks.push(makeBlock('list', { items, ordered: true }))
        continue
      }
    }

    // Default: paragraph
    blocks.push(makeBlock('paragraph', { content: trimmed }))
  }
  return blocks
}

export function serializeBlocksToMarkdown(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case 'paragraph':
          return b.content
        case 'heading': {
          const prefix = '#'.repeat(b.level)
          return `${prefix} ${b.content}`
        }
        case 'tip':
          return `:::tip\n${b.content}\n:::`
        case 'warning':
          return `:::warning\n${b.content}\n:::`
        case 'quote':
          return `:::quote\n${b.content}\n:::`
        case 'exercise': {
          const titleLine = b.title ? `## ${b.title}` : '## Exerc\u00edcio'
          const musclesLine = b.muscles ? `**M\u00fasculos:** ${b.muscles}` : '**M\u00fasculos:**'
          const content = b.content || ''
          return `:::exercise\n${titleLine}\n${musclesLine}\n${content}\n:::`
        }
        case 'list': {
          const prefix = b.ordered ? '1. ' : '- '
          return b.items.map((item) => `${prefix}${item}`).join('\n')
        }
        case 'library_item':
          return `[biblioteca:${b.exercise_slug}]`
        default:
          return ''
      }
    })
    .join('\n\n')
}

export function isEmpty(blocks: Block[]): boolean {
  return blocks.every((b) => {
    switch (b.type) {
      case 'paragraph':
      case 'heading':
      case 'tip':
      case 'warning':
      case 'quote':
        return !b.content.trim()
      case 'exercise':
        return !b.title.trim() && !b.content.trim()
      case 'list':
        return b.items.length === 0
      case 'library_item':
        return !b.exercise_slug
      default:
        return true
    }
  })
}
