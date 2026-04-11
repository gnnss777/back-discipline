import Link from "next/link";
import { ArrowLeft, BookOpen, Trophy, Target, Clock, TrendingUp, Lock } from "lucide-react";
import { chapters } from "@/lib/chapters";

export default function DashboardPage() {
  const totalChapters = chapters.filter(c => c.part).length;
  const completedChapters = 0; // Mock - would come from database
  const progress = Math.round((completedChapters / totalChapters) * 100);

  const badges = [
    { name: "Primeiro Passo", description: "Complete o primeiro capítulo", earned: false, icon: "🎯" },
    { name: "Estudante", description: "Complete 3 capítulos", earned: false, icon: "📚" },
    { name: "Meteor Dog", description: "Complete a Parte I", earned: false, icon: "🐕" },
    { name: "Formado", description: "Complete todo o livro", earned: false, icon: "🎓" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Início
          </Link>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="font-semibold">Meu Progresso</span>
          </div>
          <Link href="/perfil" className="text-sm text-zinc-400 hover:text-white">Perfil</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Welcome */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Bem-vindo ao seu <span className="text-amber-500">Painel de Progresso</span></h1>
          <p className="text-zinc-400">Acompanhe sua jornada de aprendizado</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <span className="text-zinc-400 text-sm">Capítulos</span>
            </div>
            <div className="text-2xl font-bold">0 / {totalChapters}</div>
          </div>
          
          <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-green-500" />
              <span className="text-zinc-400 text-sm">Progresso</span>
            </div>
            <div className="text-2xl font-bold">{progress}%</div>
          </div>
          
          <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-purple-500" />
              <span className="text-zinc-400 text-sm">Badges</span>
            </div>
            <div className="text-2xl font-bold">0 / {badges.length}</div>
          </div>
          
          <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-zinc-400 text-sm">Tempo</span>
            </div>
            <div className="text-2xl font-bold">0h</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 p-6 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Sua Jornada no Livro</h2>
            <span className="text-amber-500 font-medium">{progress}% completo</span>
          </div>
          <div className="h-4 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-zinc-500 mt-3">
            Continue lendo para desbloquear novos capítulos e avançar na sua trilha de aprendizado.
          </p>
        </div>

        {/* Badges */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Conquistas (Badges)
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {badges.map((badge, index) => (
              <div 
                key={index}
                className={`p-4 rounded-xl border ${
                  badge.earned 
                    ? "bg-amber-500/10 border-amber-500/30" 
                    : "bg-zinc-900/50 border-zinc-800 opacity-60"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{badge.icon}</div>
                  <div>
                    <h3 className="font-semibold">{badge.name}</h3>
                    <p className="text-sm text-zinc-500">{badge.description}</p>
                  </div>
                </div>
                {badge.earned && (
                  <div className="mt-3 text-xs text-green-500 flex items-center gap-1">
                    ✓ Conquistado
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chapter Progress */}
        <div>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            Ler Livros
          </h2>
          <div className="space-y-3">
            {chapters.filter(c => c.part).map((chapter) => (
              <div 
                key={chapter.slug}
                className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-zinc-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{chapter.title}</h3>
                  <p className="text-sm text-zinc-500">{chapter.description}</p>
                </div>
                <Link 
                  href={`/livro/${chapter.slug}`}
                  className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  Ler
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Login CTA */}
        <div className="mt-12 p-6 bg-zinc-900/30 rounded-xl border border-zinc-800 text-center">
          <h3 className="text-lg font-semibold mb-2">Faça login para salvar seu progresso</h3>
          <p className="text-zinc-400 mb-4">Crie uma conta para acompanhar seu progresso, ganhar badges e acessar todos os recursos.</p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors">
              Criar Conta
            </button>
            <button className="px-6 py-2 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors">
              Entrar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}