import Link from "next/link";
import { BookOpen, ArrowLeft, ArrowRight, CheckCircle, Lock } from "lucide-react";
import { chapters } from "@/lib/chapters";

export default function LivroPage() {
  const part1Chapters = chapters.filter(c => c.part === "I");
  const part2Chapters = chapters.filter(c => c.part === "II");

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <span className="font-semibold">Livro</span>
          </div>
          <Link href="/dashboard" className="text-sm text-amber-500 hover:text-amber-400">
            Meu Progresso
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Back Training <span className="text-amber-500">O Método Mountain Dog</span></h1>
          <p className="text-zinc-400 text-lg">Um guia prático de 6 semanas para construir costas épicas</p>
        </div>

        {/* Progress */}
        <div className="mb-12 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-zinc-400">Seu progresso</span>
            <span className="text-amber-500 font-medium">0 de 11 capítulos</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: "0%" }} />
          </div>
        </div>

        {/* Parte I */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-500 text-sm font-medium rounded-full">Parte I</span>
            <h2 className="text-2xl font-bold">O Sistema e a Prática Imediata</h2>
          </div>
          
          <div className="space-y-3">
            {part1Chapters.map((chapter, index) => (
              <Link
                key={chapter.slug}
                href={`/livro/${chapter.slug}`}
                className="block p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-amber-500/20 group-hover:text-amber-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-amber-500 transition-colors">{chapter.title}</h3>
                    <p className="text-sm text-zinc-500">{chapter.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-amber-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Parte II */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-500 text-sm font-medium rounded-full">Parte II</span>
            <h2 className="text-2xl font-bold">Fundamentos Técnicos e Ciência</h2>
          </div>
          
          <div className="space-y-3">
            {part2Chapters.map((chapter) => (
              <Link
                key={chapter.slug}
                href={`/livro/${chapter.slug}`}
                className="block p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-blue-500/20 group-hover:text-blue-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-blue-400 transition-colors">{chapter.title}</h3>
                    <p className="text-sm text-zinc-500">{chapter.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-blue-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-12 p-6 bg-zinc-900/30 rounded-xl border border-zinc-800 text-center">
          <p className="text-zinc-400 mb-4">Faça login para acompanhar seu progresso e desbloquear todos os capítulos</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-colors">
            Entrar / Criar Conta
          </Link>
        </div>
      </main>
    </div>
  );
}