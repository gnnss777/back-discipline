import Link from "next/link";
import { ArrowLeft, ArrowRight, Dumbbell } from "lucide-react";
import { getChapterBySlug, chapters } from "@/lib/chapters";
import { getChapterContent } from "@/lib/content";
import { ChapterAuthGuard } from "./ChapterAuthGuard";
import { ChapterHeader } from './ChapterHeader';
import { ConcluirButton } from './ConcluirButton';
import { ContentRenderer } from './ContentRenderer';

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
 
 const content = chapter ? getChapterContent(chapter.slug) : null;

 if (!chapter) {
  return (
   <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
    <div className="text-center">
     <h1 className="text-2xl font-medium mb-4 tracking-wider">CAPÍTULO NÃO ENCONTRADO</h1>
     <Link href="/livro" className="text-primary hover:underline">
      VOLTAR AO ÍNDICE
     </Link>
    </div>
   </div>
  );
 }

 return (
  <ChapterAuthGuard>
   <div className="min-h-screen bg-background text-foreground pb-24">
    {/* Header */}
    <header className="border-b border-secondary sticky top-0 bg-background/95 backdrop-blur-sm z-50">
     <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
      <Link href="/livro" className="flex items-center gap-2 text-muted hover:text-primary transition-colors font-medium tracking-wider text-sm">
       <ArrowLeft className="w-4 h-4" />
       ÍNDICE
      </Link>
      <div className="flex items-center gap-2">
       <span className="text-sm font-medium tracking-[0.2em] text-muted">JJ MONTEIRO</span>
       <span className="text-sm font-bold tracking-[0.15em] text-primary">BD</span>
      </div>
<ChapterHeader slug={slug} />
     </div>
    </header>

    <main className="max-w-3xl mx-auto px-6 py-12">
     {/* Chapter Header */}
     <div className="mb-8">
      {chapter.part === "I" ? (
       <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-bold tracking-wider rounded">PARTE I</span>
      ) : (
       <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-bold tracking-wider rounded">PARTE II</span>
      )}
      <h1 className="text-2xl font-medium mt-4 mb-2 tracking-wider">{chapter.title}</h1>
      <p className="text-muted font-light">{chapter.description}</p>
     </div>

     {/* Content */}
     <article className="max-w-none">
      {content ? (
       <ContentRenderer content={content} />
      ) : (
       <div className="p-8 bg-surface rounded border border-secondary">
        <p className="text-muted">Este capítulo está sendo preparado.</p>
       </div>
      )}
     </article>

     {/* Ver Planilha */}
     <div className="mt-8 p-4 bg-surface rounded border border-secondary">
      <Link href="/planilha" className="flex items-center gap-3 text-primary hover:text-primary-dark transition-colors">
       <Dumbbell className="w-5 h-5" />
       <div>
        <span className="font-bold tracking-wider text-sm block">VER PLANILHA</span>
        <span className="text-xs text-muted">Acompanhe os exercícios desta semana</span>
       </div>
       <ArrowRight className="w-4 h-4 ml-auto" />
      </Link>
     </div>

     {/* Concluir */}
     <div className="flex justify-center mt-12 pt-8 border-t border-secondary">
      <ConcluirButton slug={slug} />
     </div>
    </main>
   </div>
  </ChapterAuthGuard>
 );
}