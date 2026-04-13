import Link from "next/link";
import { BookOpen, Dumbbell, Trophy, ArrowRight, Flame, GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E0D0]">
      {/* Header */}
      <header className="border-b border-[#3A2E22]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-medium tracking-[0.3em]">JJ</span>
            <span className="text-2xl font-light tracking-[0.2em] text-[#666]">MONTEIRO</span>
            <span className="text-lg font-bold tracking-[0.15em] text-[#B8956A]">BACK DISCIPLINE</span>
          </div>
          <nav className="flex items-center gap-8 text-sm font-medium tracking-wider text-[#666]">
            <Link href="/livro" className="hover:text-[#B8956A] transition-colors">PROGRAMA</Link>
            <Link href="/biblioteca" className="hover:text-[#B8956A] transition-colors">BIBLIOTECA</Link>
            <Link href="/dashboard" className="hover:text-[#B8956A] transition-colors">PROGRESSO</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#B8956A]/5 to-[#0A0A0A] z-0" />
          
          <div className="relative z-10 text-center max-w-4xl mx-auto px-6 py-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#B8956A]/20 text-[#B8956A] text-sm font-bold tracking-wider mb-8">
              <Flame className="w-4 h-4" />
              DISCIPLINA NÃO É MOTIVAÇÃO. É MÉTODO.
            </div>
            
            <h1 className="text-5xl md:text-7xl font-medium mb-6 tracking-wide leading-tight">
              CONSTRUA AS COSTAS
              <br />
              <span className="text-[#B8956A]">QUE VOCÊ MERECE</span>
            </h1>
            
            <p className="text-xl text-[#666] mb-4 max-w-2xl mx-auto font-light tracking-wide">
              6 semanas de treinamento estruturado por JJ Monteiro, com base acadêmica em Educação Física e Nutrição e anos de experiência prática.
            </p>
            <p className="text-sm text-[#555] mb-10 font-light tracking-wide">
              Cada série, cada técnica e cada nível de esforço com propósito definido por quem estuda e aplica.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/livro" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#B8956A] text-[#0A0A0A] font-bold tracking-wider rounded-sm hover:bg-[#9A7A50] transition-colors"
              >
                COMEÇAR AGORA
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/biblioteca" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#3A2E22] text-[#E8E0D0] font-bold tracking-wider rounded-sm hover:border-[#B8956A] hover:text-[#B8956A] transition-colors"
              >
                VER EXERCÍCIOS
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-[#3A2E22] bg-[#0F0F0F]">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-medium text-[#B8956A] tracking-wider">6</div>
              <div className="text-sm text-[#555] mt-2 tracking-wider">SEMANAS</div>
            </div>
            <div>
              <div className="text-4xl font-medium text-[#B8956A] tracking-wider">11</div>
              <div className="text-sm text-[#555] mt-2 tracking-wider">CAPÍTULOS</div>
            </div>
            <div>
              <div className="text-4xl font-medium text-[#B8956A] tracking-wider">16+</div>
              <div className="text-sm text-[#555] mt-2 tracking-wider">EXERCÍCIOS</div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h2 className="text-2xl font-medium mb-6 tracking-wider">SOBRE O PROGRAMA</h2>
          <p className="text-[#666] font-light text-lg leading-relaxed mb-8">
            Back Discipline não é uma rotina de treino. É a síntese de tudo que JJ Monteiro desenvolveu sobre treinamento de costas — traduzida em um programa que qualquer pessoa comprometida pode executar. Cada capítulo, cada série e cada RPE foi pensado para quem quer resultado real, não apenas motivação.
          </p>
          <div className="flex items-center justify-center gap-3 text-[#B8956A]">
            <GraduationCap className="w-5 h-5" />
            <span className="text-sm tracking-wider font-medium">JJ MONTEIRO — EDUCADOR FÍSICO E NUTRICIONISTA</span>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#0F0F0F] border border-[#3A2E22] rounded-sm hover:border-[#B8956A] transition-colors group">
              <div className="w-12 h-12 bg-[#B8956A]/20 flex items-center justify-center rounded-sm mb-6 group-hover:bg-[#B8956A] transition-colors">
                <BookOpen className="w-6 h-6 text-[#B8956A] group-hover:text-[#0A0A0A] transition-colors" />
              </div>
              <h3 className="text-lg font-bold mb-3 tracking-wider">PROGRAMA — 6 SEMANAS</h3>
              <p className="text-[#555] font-light text-sm">
                Da mentalidade à intensidade máxima — cada etapa construída sobre a anterior. O progresso aqui não é decoração, é o programa.
              </p>
            </div>
            
            <div className="p-8 bg-[#0F0F0F] border border-[#3A2E22] rounded-sm hover:border-[#B8956A] transition-colors group">
              <div className="w-12 h-12 bg-[#B8956A]/20 flex items-center justify-center rounded-sm mb-6 group-hover:bg-[#B8956A] transition-colors">
                <Dumbbell className="w-6 h-6 text-[#B8956A] group-hover:text-[#0A0A0A] transition-colors" />
              </div>
              <h3 className="text-lg font-bold mb-3 tracking-wider">BIBLIOTECA DE EXERCÍCIOS</h3>
              <p className="text-[#555] font-light text-sm">
                Cada exercício com músculo-alvo, ângulo e ponto de atenção de JJ. Não é um banco genérico de movimentos. É o glossário prático do Back Discipline.
              </p>
            </div>
            
            <div className="p-8 bg-[#0F0F0F] border border-[#3A2E22] rounded-sm hover:border-[#B8956A] transition-colors group">
              <div className="w-12 h-12 bg-[#B8956A]/20 flex items-center justify-center rounded-sm mb-6 group-hover:bg-[#B8956A] transition-colors">
                <Trophy className="w-6 h-6 text-[#B8956A] group-hover:text-[#0A0A0A] transition-colors" />
              </div>
              <h3 className="text-lg font-bold mb-3 tracking-wider">MEU PROGRESSO</h3>
              <p className="text-[#555] font-light text-sm">
                Acompanhe cada semana, cada capítulo, cada conquista. Seis semanas. Um objetivo. Seu progresso registrado do início ao fim.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-gradient-to-b from-[#0F0F0F] to-[#0A0A0A] border-t border-[#3A2E22]">
          <div className="text-center max-w-2xl mx-auto px-6">
            <h2 className="text-3xl font-medium mb-6 tracking-wider">
              AS COSTAS QUE VOCÊ QUER EXIGEM O MÉTODO QUE VOCÊ AINDA NÃO CONHECE.
            </h2>
            <p className="text-[#555] mb-10 font-light">
              Comece sua jornada agora e construa costas que impressionam.
            </p>
            <Link 
              href="/livro" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#B8956A] text-[#0A0A0A] font-bold tracking-wider rounded-sm hover:bg-[#9A7A50] transition-colors"
            >
              COMEÇAR O PROGRAMA
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#3A2E22] py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-[#444] text-sm font-light tracking-wider">
          <p>JJ MONTEIRO · BACK DISCIPLINE · PROGRAMA DESENVOLVIDO COM BASE ACADÊMICA E EXPERIÊNCIA PRÁTICA</p>
        </div>
      </footer>
    </div>
  );
}