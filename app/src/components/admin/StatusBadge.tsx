export function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        published
          ? 'bg-emerald-500/15 text-emerald-400'
          : 'bg-amber-500/15 text-amber-400'
      }`}
    >
      {published ? 'Publicado' : 'Rascunho'}
    </span>
  )
}
