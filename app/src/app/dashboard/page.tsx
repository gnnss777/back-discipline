import Link from "next/link";
import { ArrowLeft, BookOpen, Trophy, Target, Clock, Lock } from "lucide-react";
import { chapters } from "../../lib/chapters";

export default function DashboardPage() {
  const totalChapters = chapters.filter(c => c.part).length;
  const completedChapters = 0;
  const progress = Math.round((completedChapters / totalChapters) * 100);

  const badges = [
    { name: "PRIMEIRO PASSO", description: "Complete o primeiro capítulo", earned: false, icon: "🎯" },
    { name: "ESTUDANTE", description: "Complete 3 capítulos", earned: false, icon: "📚" },
    { name: "MOUNTAIN DOG", description: "Complete a Parte I", earned: false, icon: "🐕" },
    { name: "FORMADO", description: "Complete todo o livro", earned: false, icon: "🎓" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-[#333] sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#666] hover:text-white transition-colors font-medium tracking-wider text-sm">
            <ArrowLeft className="w-4 h-4" />
            INÍCIO
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#B8956A] flex items-center justify-center rounded-sm">
              <span className="text-[#0A0A0A] text-sm font-bold">JJ</span>
            </div>
            <span className="font-bold tracking-wider">PROGRESSO</span>
          </div>
          <Link href="/perfil" className="text-sm text-[#666] hover:text-white font-medium tracking-wider">PERFIL</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Welcome */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2 tracking-wider">SEU <span className="text-[#B8956A]">PAINEL</span></h1>
          <p className="text-[#555] tracking-wide font-medium">ACOMPANHE SUA JORNADA DE APRENDIZADO</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-[#111] border border-[#333] rounded-sm">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-[#B8956A]" />
              <span className="text-[#555] text-sm tracking-wider">CAPÍTULOS</span>
            </div>
            <div className="text-2xl font-bold tracking-wider">0 / {totalChapters}</div>
          </div>
          
          <div className="p-4 bg-[#111] border border-[#333] rounded-sm">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-green-500" />
              <span className="text-[#555] text-sm tracking-wider">PROGRESSO</span>
            </div>
            <div className="text-2xl font-bold tracking-wider">{progress}%</div>
          </div>
          
          <div className="p-4 bg-[#111] border border-[#333] rounded-sm">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-purple-500" />
              <span className="text-[#555] text-sm tracking-wider">BADGES</span>
            </div>
            <div className="text-2xl font-bold tracking-wider">0 / {badges.length}</div>
          </div>
          
          <div className="p-4 bg-[#111] border border-[#333] rounded-sm">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-[#555] text-sm tracking-wider">TEMPO</span>
            </div>
            <div className="text-2xl font-bold tracking-wider">0h</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 p-6 bg-[#111] rounded-xl border border-[#333]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-wider">SUA JORNADA</h2>
            <span className="text-[#B8956A] font-bold tracking-wider">{progress}% COMPLETO</span>
          </div>
          <div className="h-3 bg-[#222] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#B8956A] to-[#8B7355] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-[#444] mt-3 tracking-wide">
            Continue lendo para desbloquear novos capítulos e avançar na sua trilha de aprendizado.
          </p>
        </div>

        {/* Badges */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 tracking-wider">
            <Trophy className="w-5 h-5 text-[#B8956A]" />
            CONQUISTAS
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {badges.map((badge, index) => (
              <div 
                key={index}
                className={`p-4 rounded-xl border ${
                  badge.earned 
                    ? "bg-[#B8956A]/10 border-[#B8956A]/30" 
                    : "bg-[#111] border-[#333] opacity-60"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{badge.icon}</div>
                  <div>
                    <h3 className="font-bold tracking-wider">{badge.name}</h3>
                    <p className="text-sm text-[#555]">{badge.description}</p>
                  </div>
                </div>
                {badge.earned && (
                  <div className="mt-3 text-xs text-green-500 flex items-center gap-1 tracking-wider">
                    ✓ CONQUISTADO
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chapter Progress */}
        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 tracking-wider">
            <BookOpen className="w-5 h-5 text-[#B8956A]" />
            CAPÍTULOS
          </h2>
          <div className="space-y-3">
            {chapters.filter(c => c.part).map((chapter) => (
              <div 
                key={chapter.slug}
                className="p-4 bg-[#111] border border-[#333] flex items-center gap-4 rounded-sm"
              >
                <div className="w-10 h-10 bg-[#222] flex items-center justify-center rounded-sm">
                  <Lock className="w-5 h-5 text-[#444]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold tracking-wider text-sm">{chapter.title}</h3>
                  <p className="text-xs text-[#444]">{chapter.description}</p>
                </div>
                <Link 
                  href={`/livro/${chapter.slug}`}
                  className="px-4 py-2 text-sm bg-[#222] hover:bg-[#B8956A] hover:text-[#0A0A0A] rounded-sm transition-colors font-medium tracking-wider"
                >
                  LER
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Login CTA */}
        <div className="mt-12 p-6 bg-[#111] rounded-xl border border-[#333] text-center">
          <h3 className="text-lg font-bold mb-2 tracking-wider">FAÇA LOGIN PARA SALVAR SEU PROGRESSO</h3>
          <p className="text-[#555] mb-4 tracking-wide">Crie uma conta para acompanhar seu progresso e ganhar badges.</p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-2 bg-[#B8956A] text-[#0A0A0A] font-bold tracking-wider rounded-sm hover:bg-[#8B7355] transition-colors">
              CRIAR CONTA
            </button>
            <button className="px-6 py-2 border border-[#333] text-[#ccc] rounded-sm hover:border-[#B8956A] hover:text-[#B8956A] transition-colors font-bold tracking-wider">
              ENTRAR
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}