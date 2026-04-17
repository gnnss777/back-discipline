import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, Lock } from "lucide-react";
import { getChapterBySlug, getNextChapter, getPrevChapter, chapters } from "../../../../lib/chapters";
import { getChapterContent } from "../../../../lib/content";
import { ChapterAuthGuard } from "./ChapterAuthGuard";

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
      <div className="min-h-screen bg-[#0A0A0A] text-[#E8E0D0] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4 tracking-wider">CAPÍTULO NÃO ENCONTRADO</h1>
          <Link href="/livro" className="text-[#B8956A] hover:underline">
            VOLTAR AO ÍNDICE
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ChapterAuthGuard>
      <div className="min-h-screen bg-[#0A0A0A] text-[#E8E0D0]">
        {/* Header */}
        <header className="border-b border-[#3A2E22] sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-50">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/livro" className="flex items-center gap-2 text-[#555] hover:text-[#B8956A] transition-colors font-medium tracking-wider text-sm">
              <ArrowLeft className="w-4 h-4" />
              ÍNDICE
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium tracking-[0.2em] text-[#666]">JJ MONTEIRO</span>
              <span className="text-sm font-bold tracking-[0.15em] text-[#B8956A]">BD</span>
            </div>
            <button className="flex items-center gap-2 text-sm text-[#B8956A] hover:text-[#9A7A50] font-medium tracking-wider">
              <CheckCircle className="w-4 h-4" />
              CONCLUIR
            </button>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12">
          {/* Chapter Header */}
          <div className="mb-8">
            {chapter.part === "I" ? (
              <span className="px-3 py-1 bg-[#B8956A]/20 text-[#B8956A] text-sm font-bold tracking-wider rounded-sm">PARTE I</span>
            ) : (
              <span className="px-3 py-1 bg-[#B8956A]/20 text-[#B8956A] text-sm font-bold tracking-wider rounded-sm">PARTE II</span>
            )}
            <h1 className="text-2xl font-medium mt-4 mb-2 tracking-wider">{chapter.title}</h1>
            <p className="text-[#444] font-light">{chapter.description}</p>
          </div>

          {/* Content */}
          <article className="max-w-none">
            {content ? (
              <div className="space-y-6 text-[#bbb] leading-relaxed font-light">
                {content.split('\n\n').map((paragraph, i) => {
                  if (paragraph.startsWith('# ')) 
                    return <h1 key={i} className="text-3xl font-medium text-[#E8E0D0] mt-8 mb-4 tracking-wider">{paragraph.replace('# ', '')}</h1>;
                  if (paragraph.startsWith('## ')) 
                    return <h2 key={i} className="text-2xl font-medium text-[#E8E0D0] mt-8 mb-4 tracking-wider">{paragraph.replace('## ', '')}</h2>;
                  if (paragraph.startsWith('### ')) 
                    return <h3 key={i} className="text-lg font-bold text-[#B8956A] mt-6 mb-3 tracking-wider">{paragraph.replace('### ', '')}</h3>;
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) 
                    return <h4 key={i} className="font-bold text-[#E8E0D0] mt-4 mb-2 tracking-wider">{paragraph.replace(/\*\*/g, '')}</h4>;
                  if (paragraph.startsWith('|')) {
                    const rows = paragraph.split('\n').filter(r => r.trim());
                    if (rows.length > 1) {
                      return (
                        <div key={i} className="overflow-x-auto my-4">
                          <table className="min-w-full border border-[#3A2E22]">
                            <tbody>
                              {rows.map((row, rowIndex) => (
                                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-[#0F0F0F]' : ''}>
                                  {row.split('|').filter(c => c.trim()).map((cell, cellIndex) => (
                                    <td key={cellIndex} className="px-4 py-2 border border-[#3A2E22] text-sm">{cell.trim()}</td>
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
                          <li key={idx} className="text-[#aaa]">{item.replace(/^[-*]\s*/, '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (paragraph.trim()) {
                    return <p key={i} className="text-[#aaa]">{paragraph}</p>;
                  }
                  return null;
                })}
              </div>
            ) : (
              <div className="p-8 bg-[#0F0F0F] rounded-sm border border-[#3A2E22]">
                <p className="text-[#444]">Este capítulo está sendo preparado.</p>
              </div>
            )}
          </article>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-[#3A2E22]">
            {prevChapter ? (
              <Link 
                href={`/livro/${prevChapter.slug}`}
                className="flex items-center gap-2 text-[#555] hover:text-[#B8956A] transition-colors font-medium tracking-wider text-sm"
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
                className="flex items-center gap-2 px-4 py-2 bg-[#B8956A] text-[#0A0A0A] font-bold tracking-wider rounded-sm hover:bg-[#9A7A50] transition-colors text-sm"
              >
                <span>PRÓXIMO</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link 
                href="/livro"
                className="flex items-center gap-2 px-4 py-2 bg-[#B8956A] text-[#0A0A0A] font-bold tracking-wider rounded-sm hover:bg-[#9A7A50] transition-colors text-sm"
              >
                <span>CONCLUIR</span>
                <CheckCircle className="w-4 h-4" />
              </Link>
            )}
          </div>
        </main>
      </div>
    </ChapterAuthGuard>
  );
}