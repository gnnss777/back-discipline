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
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 tracking-wider">CAPÍTULO NÃO ENCONTRADO</h1>
          <Link href="/livro" className="text-[#FF3333] hover:underline">
            VOLTAR AO ÍNDICE
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-[#333] sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/livro" className="flex items-center gap-2 text-[#666] hover:text-white transition-colors font-medium tracking-wider text-sm">
            <ArrowLeft className="w-4 h-4" />
            ÍNDICE
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FF3333] flex items-center justify-center rounded-sm">
              <span className="text-xs font-bold">BD</span>
            </div>
            <span className="text-sm font-bold tracking-wider">CAPÍTULO {chapter.order}</span>
          </div>
          <button className="flex items-center gap-2 text-sm text-[#FF3333] hover:text-[#CC2929] font-medium tracking-wider">
            <CheckCircle className="w-4 h-4" />
            CONCLUIR
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Chapter Header */}
        <div className="mb-8">
          {chapter.part === "I" ? (
            <span className="px-3 py-1 bg-[#FF3333]/20 text-[#FF3333] text-sm font-bold tracking-wider rounded-sm">PARTE I</span>
          ) : (
            <span className="px-3 py-1 bg-[#FF3333]/20 text-[#FF3333] text-sm font-bold tracking-wider rounded-sm">PARTE II</span>
          )}
          <h1 className="text-3xl font-bold mt-4 mb-2 tracking-wider">{chapter.title}</h1>
          <p className="text-[#555]">{chapter.description}</p>
        </div>

        {/* Content */}
        <article className="max-w-none">
          {content ? (
            <div className="space-y-6 text-[#ccc] leading-relaxed">
              {content.split('\n\n').map((paragraph, i) => {
                if (paragraph.startsWith('# ')) 
                  return <h1 key={i} className="text-3xl font-bold text-white mt-8 mb-4 tracking-wider">{paragraph.replace('# ', '')}</h1>;
                if (paragraph.startsWith('## ')) 
                  return <h2 key={i} className="text-2xl font-bold text-white mt-8 mb-4 tracking-wider">{paragraph.replace('## ', '')}</h2>;
                if (paragraph.startsWith('### ')) 
                  return <h3 key={i} className="text-xl font-semibold text-[#FF3333] mt-6 mb-3 tracking-wider">{paragraph.replace('### ', '')}</h3>;
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) 
                  return <h4 key={i} className="font-bold text-white mt-4 mb-2 tracking-wider">{paragraph.replace(/\*\*/g, '')}</h4>;
                if (paragraph.startsWith('|')) {
                  const rows = paragraph.split('\n').filter(r => r.trim());
                  if (rows.length > 1) {
                    return (
                      <div key={i} className="overflow-x-auto my-4">
                        <table className="min-w-full border border-[#333]">
                          <tbody>
                            {rows.map((row, rowIndex) => (
                              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-[#111]' : ''}>
                                {row.split('|').filter(c => c.trim()).map((cell, cellIndex) => (
                                  <td key={cellIndex} className="px-4 py-2 border border-[#333] text-sm">{cell.trim()}</td>
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
                        <li key={idx} className="text-[#bbb]">{item.replace(/^[-*]\s*/, '')}</li>
                      ))}
                    </ul>
                  );
                }
                if (paragraph.trim()) {
                  return <p key={i} className="text-[#bbb]">{paragraph}</p>;
                }
                return null;
              })}
            </div>
          ) : (
            <div className="p-8 bg-[#111] rounded-sm border border-[#333]">
              <p className="text-[#555]">Este capítulo está sendo preparado.</p>
            </div>
          )}
        </article>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-[#333]">
          {prevChapter ? (
            <Link 
              href={`/livro/${prevChapter.slug}`}
              className="flex items-center gap-2 text-[#666] hover:text-white transition-colors font-medium tracking-wider text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{prevChapter.title.replace('Capítulo ', '')}</span>
            </Link>
          ) : (
            <div />
          )}
          
          {nextChapter ? (
            <Link 
              href={`/livro/${nextChapter.slug}`}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF3333] text-white font-bold tracking-wider rounded-sm hover:bg-[#CC2929] transition-colors text-sm"
            >
              <span>PRÓXIMO</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link 
              href="/livro"
              className="flex items-center gap-2 px-4 py-2 bg-[#FF3333] text-white font-bold tracking-wider rounded-sm hover:bg-[#CC2929] transition-colors text-sm"
            >
              <span>CONCLUIR</span>
              <CheckCircle className="w-4 h-4" />
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}