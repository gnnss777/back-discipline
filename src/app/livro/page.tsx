import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, Lock } from "lucide-react";
import { chapters } from "@/lib/chapters";

export default function LivroPage() {
  const part1Chapters = chapters.filter(c => c.part === "I");
  const part2Chapters = chapters.filter(c => c.part === "II");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-[#333] sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#666] hover:text-white transition-colors font-medium tracking-wider">
            <ArrowLeft className="w-4 h-4" />
            VOLTAR
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF3333] flex items-center justify-center rounded-sm">
              <span className="text-sm font-bold">BD</span>
            </div>
            <span className="font-bold tracking-wider">LIVRO</span>
          </div>
          <Link href="/dashboard" className="text-sm text-[#FF3333] hover:text-[#CC2929] font-medium tracking-wider">
            PROGRESSO
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 tracking-wider">BACK <span className="text-[#FF3333]">DISCIPLINE</span></h1>
          <p className="text-[#666] text-lg font-medium tracking-wide">PROGRAMA DE 6 SEMANAS</p>
        </div>

        {/* Progress */}
        <div className="mb-12 p-4 bg-[#111] rounded-sm border border-[#333]">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-[#666] font-medium tracking-wider">SEU PROGRESSO</span>
            <span className="text-[#FF3333] font-bold tracking-wider">0 / 11 CAPÍTULOS</span>
          </div>
          <div className="h-1 bg-[#222] rounded-full overflow-hidden">
            <div className="h-full bg-[#FF3333] rounded-full" style={{ width: "0%" }} />
          </div>
        </div>

        {/* Parte I */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-[#FF3333]/20 text-[#FF3333] text-sm font-bold tracking-wider rounded-sm">PARTE I</span>
            <h2 className="text-2xl font-bold tracking-wider">SISTEMA E PRÁTICA</h2>
          </div>
          
          <div className="space-y-3">
            {part1Chapters.map((chapter) => (
              <Link
                key={chapter.slug}
                href={`/livro/${chapter.slug}`}
                className="block p-5 bg-[#111] border border-[#333] hover:border-[#FF3333] transition-all group rounded-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#222] flex items-center justify-center rounded-sm text-[#444] group-hover:bg-[#FF3333]/20 group-hover:text-[#FF3333] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold group-hover:text-[#FF3333] transition-colors tracking-wider">{chapter.title}</h3>
                    <p className="text-sm text-[#555]">{chapter.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#444] group-hover:text-[#FF3333] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Parte II */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-[#FF3333]/20 text-[#FF3333] text-sm font-bold tracking-wider rounded-sm">PARTE II</span>
            <h2 className="text-2xl font-bold tracking-wider">FUNDAMENTOS TÉCNICOS</h2>
          </div>
          
          <div className="space-y-3">
            {part2Chapters.map((chapter) => (
              <Link
                key={chapter.slug}
                href={`/livro/${chapter.slug}`}
                className="block p-5 bg-[#111] border border-[#333] hover:border-[#FF3333] transition-all group rounded-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#222] flex items-center justify-center rounded-sm text-[#444] group-hover:bg-[#FF3333]/20 group-hover:text-[#FF3333] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold group-hover:text-[#FF3333] transition-colors tracking-wider">{chapter.title}</h3>
                    <p className="text-sm text-[#555]">{chapter.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#444] group-hover:text-[#FF3333] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-12 p-6 bg-[#111] rounded-xl border border-[#333] text-center">
          <p className="text-[#555] mb-4 font-medium tracking-wide">FAÇA LOGIN PARA ACOMPANHAR SEU PROGRESSO</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF3333] text-white font-bold tracking-wider rounded-sm hover:bg-[#CC2929] transition-colors">
            ENTRAR / CRIAR CONTA
          </Link>
        </div>
      </main>
    </div>
  );
}