import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle } from "lucide-react";
import { getChapterBySlug, getNextChapter, getPrevChapter, chapters } from "@/lib/chapters";
import { getChapterContent } from "@/lib/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return chapters.map((chapter) => ({
    slug: chapter.slug,
  }));
}

export default async function ChapterPage({ params }: PageProps) {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);
  const nextChapter = getNextChapter(slug);
  const prevChapter = getPrevChapter(slug);
  
  const content = chapter ? getChapterContent(chapter.slug) : null;

  if (!chapter) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Capítulo não encontrado</h1>
          <Link href="/livro" className="text-amber-500 hover:underline">
            Voltar ao índice
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/livro" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Índice
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-medium">Capítulo {chapter.order}</span>
          </div>
          <button className="flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400">
            <CheckCircle className="w-4 h-4" />
            Concluir
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Chapter Header */}
        <div className="mb-8">
          {chapter.part === "I" ? (
            <span className="px-3 py-1 bg-amber-500/20 text-amber-500 text-sm font-medium rounded-full">Parte I</span>
          ) : (
            <span className="px-3 py-1 bg-blue-500/20 text-blue-500 text-sm font-medium rounded-full">Parte II</span>
          )}
          <h1 className="text-3xl font-bold mt-4 mb-2">{chapter.title}</h1>
          <p className="text-zinc-400">{chapter.description}</p>
        </div>

        {/* Content */}
        <article className="prose prose-invert prose-amber max-w-none">
          {content ? (
            <div className="space-y-6 text-zinc-300 leading-relaxed">
              {content.split('\n\n').map((paragraph, i) => {
                if (paragraph.startsWith('# ')) 
                  return <h1 key={i} className="text-3xl font-bold text-white mt-8 mb-4">{paragraph.replace('# ', '')}</h1>;
                if (paragraph.startsWith('## ')) 
                  return <h2 key={i} className="text-2xl font-bold text-white mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
                if (paragraph.startsWith('### ')) 
                  return <h3 key={i} className="text-xl font-semibold text-amber-500 mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) 
                  return <h4 key={i} className="font-semibold text-white mt-4 mb-2">{paragraph.replace(/\*\*/g, '')}</h4>;
                if (paragraph.startsWith('|')) {
                  // Simple table handling
                  const rows = paragraph.split('\n').filter(r => r.trim());
                  if (rows.length > 1) {
                    return (
                      <div key={i} className="overflow-x-auto my-4">
                        <table className="min-w-full border border-zinc-700">
                          <tbody>
                            {rows.map((row, rowIndex) => (
                              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-zinc-900/30' : ''}>
                                {row.split('|').filter(c => c.trim()).map((cell, cellIndex) => (
                                  <td key={cellIndex} className="px-4 py-2 border border-zinc-700">{cell.trim()}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                }
                if (paragraph.trim().startsWith('-') || paragraph.trim().startsWith('*')) {
                  const items = paragraph.split('\n').filter(p => p.trim());
                  return (
                    <ul key={i} className="space-y-2 ml-6 list-disc">
                      {items.map((item, idx) => (
                        <li key={idx} className="text-zinc-300">{item.replace(/^[-*]\s*/, '')}</li>
                      ))}
                    </ul>
                  );
                }
                if (paragraph.trim()) {
                  return <p key={i} className="text-zinc-300">{paragraph}</p>;
                }
                return null;
              })}
            </div>
          ) : (
            <div className="p-8 bg-zinc-900/50 rounded-lg border border-zinc-800">
              <p className="text-zinc-400">Este capítulo está sendo preparado.</p>
            </div>
          )}
        </article>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-zinc-800">
          {prevChapter ? (
            <Link 
              href={`/livro/${prevChapter.slug}`}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">{prevChapter.title.replace('Capítulo ', '')}</span>
            </Link>
          ) : (
            <div />
          )}
          
          {nextChapter ? (
            <Link 
              href={`/livro/${nextChapter.slug}`}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors"
            >
              <span className="text-sm">Próximo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link 
              href="/livro"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-500 transition-colors"
            >
              <span className="text-sm">Concluir Livro</span>
              <CheckCircle className="w-4 h-4" />
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}