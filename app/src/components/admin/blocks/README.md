# Editor de Blocos — Notas de Revisão

## Visão Geral
Substituição do editor markdown (textarea com preview) por um editor baseado em blocos modulares (estilo Notion) para gerenciar o conteúdo do livro no painel admin.

## Tipos de Bloco
- `paragraph` — texto corrido
- `heading` — H1/H2/H3
- `tip` — bloco de dica (verde)
- `warning` — bloco de aviso (âmbar)
- `exercise` — título + músculos + descrição (azul)
- `quote` — citação com atribuição opcional
- `list` — numerada ou com marcadores
- `library_item` — referência a exercício da biblioteca

## Arquitetura
- `content_blocks` (JSONB) é o storage primário
- `content_markdown` mantido para compatibilidade com o renderer do app público
- Dual storage permite migração suave (volta para markdown se blocks vier vazio)

## Migration obrigatória
Rodar `app/supabase/migrations/004_chapter_blocks.sql` antes do deploy:

```sql
ALTER TABLE chapters
ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT '[]'::jsonb;
```

## Renderização
- Editor: `BlocksEditor.tsx` + `BlockEditor.tsx` (por tipo)
- Preview: `BlockPreview.tsx` reaproveita o estilo visual do `ContentRenderer.tsx` (TipBox/WarningBox/QuoteBox)
- App público: mantém `ContentRenderer.tsx` parseando markdown até que toda a base seja convertida para blocks

## Auto-save
Mantido em 30s (igual ao editor markdown). Salvamento full (blocks + markdown).
