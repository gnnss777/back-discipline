import { z } from 'zod'

export const blockTypes = [
  'paragraph',
  'heading',
  'tip',
  'warning',
  'exercise',
  'quote',
  'list',
  'library_item',
] as const

export type BlockType = typeof blockTypes[number]

const blockBase = z.object({
  id: z.string().min(1),
})

export const paragraphBlockSchema = blockBase.extend({
  type: z.literal('paragraph'),
  content: z.string(),
})

export const headingBlockSchema = blockBase.extend({
  type: z.literal('heading'),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  content: z.string(),
})

export const tipBlockSchema = blockBase.extend({
  type: z.literal('tip'),
  content: z.string(),
})

export const warningBlockSchema = blockBase.extend({
  type: z.literal('warning'),
  content: z.string(),
})

export const quoteBlockSchema = blockBase.extend({
  type: z.literal('quote'),
  content: z.string(),
  attribution: z.string().optional(),
})

export const exerciseBlockSchema = blockBase.extend({
  type: z.literal('exercise'),
  title: z.string(),
  muscles: z.string().optional(),
  content: z.string(),
})

export const listBlockSchema = blockBase.extend({
  type: z.literal('list'),
  ordered: z.boolean(),
  items: z.array(z.string()),
})

export const libraryItemBlockSchema = blockBase.extend({
  type: z.literal('library_item'),
  exercise_slug: z.string(),
})

export const blockSchema = z.discriminatedUnion('type', [
  paragraphBlockSchema,
  headingBlockSchema,
  tipBlockSchema,
  warningBlockSchema,
  quoteBlockSchema,
  exerciseBlockSchema,
  listBlockSchema,
  libraryItemBlockSchema,
])

export const blocksSchema = z.array(blockSchema)

export type ParagraphBlock = z.infer<typeof paragraphBlockSchema>
export type HeadingBlock = z.infer<typeof headingBlockSchema>
export type TipBlock = z.infer<typeof tipBlockSchema>
export type WarningBlock = z.infer<typeof warningBlockSchema>
export type QuoteBlock = z.infer<typeof quoteBlockSchema>
export type ExerciseBlock = z.infer<typeof exerciseBlockSchema>
export type ListBlock = z.infer<typeof listBlockSchema>
export type LibraryItemBlock = z.infer<typeof libraryItemBlockSchema>
export type Block = z.infer<typeof blockSchema>
