import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, Lock } from "lucide-react";
import { chapters } from "../../lib/chapters";

export default function LivroPage() {
  const part1Chapters = chapters.filter(c => c.part === "I");
  const part2Chapters = chapters.filter(c => c.part === "II");

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E0D0]">
      {/* Header */}
      <header className="border-b border-[#3A2E22] sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#666] hover:text-[#B8956A] transition-colors font-medium tracking-wider text-sm">
            <ArrowLeft className="w-4 h-4" />
            VOLTAR
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium tracking-[0.2em] text-[#666]">JJ MONTEIRO</span>
            <span className="text-sm font-bold tracking-[0.15em] text-[#B8956A]">BACK DISCIPLINE</span>
          </div>
          <Link href="/dashboard" className="text-sm text-[#B8956A] hover:text-[#9A7A50] font-medium tracking-wider">
            PROGRESSO
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-medium mb-4 tracking-wider">PROGRAMA <span className="text-[#B8956A]">6 SEMANAS</span></h1>
          <p className="text-[#555] font-light tracking-wide">DE TREINAMENTO DE COSTAS</p>
        </div>

        {/* Progress */}
        <div className="mb-12 p-4 bg-[#0F0F0F] rounded-sm border border-[#3A2E22]">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-[#555] font-medium tracking-wider">SEU PROGRESSO</span>
            <span className="text-[#B8956A] font-bold tracking-wider">0 / 11 CAPÍTULOS</span>
          </div>
          <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div className="h-full bg-[#B8956A]" style={{ width: "0%" }} />
          </div>
        </div>

        {/* Parte I */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-[#B8956A]/20 text-[#B8956A] text-sm font-bold tracking-wider rounded-sm">PARTE I</span>
            <h2 className="text-xl font-medium tracking-wider">SISTEMA E PRÁTICA</h2>
          </div>
          
          <div className="space-y-3">
            {part1Chapters.map((chapter) => (
              <Link
                key={chapter.slug}
                href={`/livro/${chapter.slug}`}
                className="block p-5 bg-[#0F0F0F] border border-[#3A2E22] hover:border-[#B8956A] transition-all group rounded-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#1a1a1a] flex items-center justify-center rounded-sm text-[#444] group-hover:bg-[#B8956A]/20 group-hover:text-[#B8956A] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold group-hover:text-[#B8956A] transition-colors tracking-wider text-sm">{chapter.title}</h3>
                    <p className="text-xs text-[#444]">{chapter.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#333] group-hover:text-[#B8956A] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Parte II */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-[#B8956A]/20 text-[#B8956A] text-sm font-bold tracking-wider rounded-sm">PARTE II</span>
            <h2 className="text-xl font-medium tracking-wider">FUNDAMENTOS TÉCNICOS</h2>
          </div>
          
          <div className="space-y-3">
            {part2Chapters.map((chapter) => (
              <Link
                key={chapter.slug}
                href={`/livro/${chapter.slug}`}
                className="block p-5 bg-[#0F0F0F] border border-[#3A2E22] hover:border-[#B8956A] transition-all group rounded-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#1a1a1a] flex items-center justify-center rounded-sm text-[#444] group-hover:bg-[#B8956A]/20 group-hover:text-[#B8956A] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold group-hover:text-[#B8956A] transition-colors tracking-wider text-sm">{chapter.title}</h3>
                    <p className="text-xs text-[#444]">{chapter.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#333] group-hover:text-[#B8956A] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-12 p-6 bg-[#0F0F0F] rounded-xl border border-[#3A2E22] text-center">
          <p className="text-[#444] mb-4 font-light tracking-wide">FAÇA LOGIN PARA ACOMPANHAR SEU PROGRESSO</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-[#B8956A] text-[#0A0A0A] font-bold tracking-wider rounded-sm hover:bg-[#9A7A50] transition-colors">
            ENTRAR / CRIAR CONTA
          </Link>
        </div>
      </main>
    </div>
  );
}