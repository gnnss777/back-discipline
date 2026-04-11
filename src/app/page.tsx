import Link from "next/link";
import { BookOpen, Brain, Dumbbell, Trophy, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-8 h-8 text-amber-500" />
            <span className="text-xl font-bold">Back Training</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-zinc-400">
            <Link href="/livro" className="hover:text-white transition-colors">Livro</Link>
            <Link href="/biblioteca" className="hover:text-white transition-colors">Biblioteca</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Meu Progresso</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium mb-6">
            <Trophy className="w-4 h-4" />
            Método Mountain Dog
          </div>
          
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Construa Costas
            <span className="text-amber-500"> Épicas</span> com o
            Método John Meadows
          </h1>
          
          <p className="text-xl text-zinc-400 mb-10">
            Um guia prático de 6 semanas para transformar suas costas. 
            A methodology científica aplicada ao treinamento brasileiro.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/livro" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-colors"
            >
              Começar a Ler
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/biblioteca" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-zinc-700 text-zinc-300 font-semibold rounded-lg hover:bg-zinc-900 transition-colors"
            >
              Ver Biblioteca de Exercícios
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <BookOpen className="w-10 h-10 text-amber-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Livro Interativo</h3>
            <p className="text-zinc-400">
              Leia o conteúdo técnico do programa de 6 semanas com índice navegável e marcação de progresso.
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <Brain className="w-10 h-10 text-amber-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Trilha de Aprendizado</h3>
            <p className="text-zinc-400">
              Acompanhe seu progresso capítulo a capítulo, ganhe badges e alcance a certificação final.
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <Dumbbell className="w-10 h-10 text-amber-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Biblioteca Técnica</h3>
            <p className="text-zinc-400">
              Glossário de termos técnicos, biblioteca de exercícios com vídeos demonstração e dicas de execução.
            </p>
          </div>
        </div>

        {/* Progress Preview */}
        <div className="mt-24 p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800">
          <h2 className="text-2xl font-bold mb-6 text-center">Estrutura do Livro</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="text-amber-500 font-semibold mb-3">Parte I - O Sistema e a Prática</h3>
              <ul className="space-y-2 text-zinc-400">
                <li>✓ Capítulo 1: Mentalidade Mountain Dog</li>
                <li>✓ Capítulo 2: Sistema RPE (6-13)</li>
                <li>✓ Capítulos 3-8: Semanas 1-6 do Programa</li>
              </ul>
            </div>
            <div>
              <h3 className="text-amber-500 font-semibold mb-3">Parte II - Fundamentos Técnicos</h3>
              <ul className="space-y-2 text-zinc-400">
                <li>✓ Capítulo 9: Anatomia Funcional</li>
                <li>✓ Capítulo 10: Análise de Levantamentos</li>
                <li>✓ Capítulo 11: Saúde do Ombro</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-zinc-500 mb-4">Pronto para começar sua transformação?</p>
          <Link 
            href="/livro" 
            className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors"
          >
            Ir para o Livro <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-zinc-500 text-sm">
          <p>Baseado no trabalho de John Meadows | Adaptado para o público brasileiro</p>
        </div>
      </footer>
    </div>
  );
}