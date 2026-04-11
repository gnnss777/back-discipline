import Link from "next/link";
import Image from "next/image";
import { BookOpen, Dumbbell, Trophy, ArrowRight, Flame } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-[#333]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF3333] flex items-center justify-center rounded-sm">
              <span className="text-xl font-bold">BD</span>
            </div>
            <span className="text-2xl font-bold tracking-wider">BACK<span className="text-[#FF3333]">DISCIPLINE</span></span>
          </div>
          <nav className="flex items-center gap-8 text-sm font-medium tracking-wider text-[#666]">
            <Link href="/livro" className="hover:text-white transition-colors">LIVRO</Link>
            <Link href="/biblioteca" className="hover:text-white transition-colors">BIBLIOTECA</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">PROGRESSO</Link>
          </nav>
        </div>
      </header>

      {/* Hero with Background Image */}
      <main>
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FF3333]/10 to-[#0a0a0a] z-0" />
          <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-10 z-0" />
          
          <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#FF3333]/20 text-[#FF3333] text-sm font-bold tracking-wider mb-8">
              <Flame className="w-4 h-4" />
              MÉTODO MOUNTAIN DOG
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-wider leading-none">
              CONQUISTE
              <br />
              <span className="text-[#FF3333]">COSTAS ÍMPIAS</span>
            </h1>
            
            <p className="text-xl text-[#666] mb-10 max-w-2xl mx-auto font-medium tracking-wide">
              O programa definitivo de 6 semanas baseado na metodologia de John Meadows. 
              Técnica científica aplicada ao treinamento brasileiro.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/livro" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FF3333] text-white font-bold tracking-wider rounded-sm hover:bg-[#CC2929] transition-colors"
              >
                COMEÇAR AGORA
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/biblioteca" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#333] text-white font-bold tracking-wider rounded-sm hover:border-[#FF3333] hover:text-[#FF3333] transition-colors"
              >
                VER EXERCÍCIOS
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-[#333] bg-[#111]">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#FF3333] tracking-wider">6</div>
              <div className="text-sm text-[#666] mt-2 tracking-wider">SEMANAS</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#FF3333] tracking-wider">11</div>
              <div className="text-sm text-[#666] mt-2 tracking-wider">CAPÍTULOS</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#FF3333] tracking-wider">16+</div>
              <div className="text-sm text-[#666] mt-2 tracking-wider">EXERCÍCIOS</div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="text-4xl font-bold text-center mb-16 tracking-wider">
            O SISTEMA
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#111] border border-[#333] rounded-sm hover:border-[#FF3333] transition-colors group">
              <div className="w-12 h-12 bg-[#FF3333]/20 flex items-center justify-center rounded-sm mb-6 group-hover:bg-[#FF3333] transition-colors">
                <BookOpen className="w-6 h-6 text-[#FF3333] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-wider">LIVRO DIGITAL</h3>
              <p className="text-[#666] font-medium">
                Conteúdo técnico completo do programa com índice navegável e progresso em tempo real.
              </p>
            </div>
            
            <div className="p-8 bg-[#111] border border-[#333] rounded-sm hover:border-[#FF3333] transition-colors group">
              <div className="w-12 h-12 bg-[#FF3333]/20 flex items-center justify-center rounded-sm mb-6 group-hover:bg-[#FF3333] transition-colors">
                <Trophy className="w-6 h-6 text-[#FF3333] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-wider">TRILHA DE APRENDIZADO</h3>
              <p className="text-[#666] font-medium">
                Acompanhe seu progresso capítulo a capítulo e conquiste badges de conclusão.
              </p>
            </div>
            
            <div className="p-8 bg-[#111] border border-[#333] rounded-sm hover:border-[#FF3333] transition-colors group">
              <div className="w-12 h-12 bg-[#FF3333]/20 flex items-center justify-center rounded-sm mb-6 group-hover:bg-[#FF3333] transition-colors">
                <Dumbbell className="w-6 h-6 text-[#FF3333] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-wider">BIBLIOTECA TÉCNICA</h3>
              <p className="text-[#666] font-medium">
                Guia completo de exercícios com técnica, dicas e músculos envolvidos.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-gradient-to-b from-[#111] to-[#0a0a0a] border-t border-[#333]">
          <div className="text-center max-w-2xl mx-auto px-6">
            <h2 className="text-4xl font-bold mb-6 tracking-wider">
              PRONTO PARA A <span className="text-[#FF3333]">TRANSFORMAÇÃO</span>?
            </h2>
            <p className="text-[#666] mb-10 font-medium">
              Comece sua jornada agora e construa costas que impressionam.
            </p>
            <Link 
              href="/livro" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF3333] text-white font-bold tracking-wider rounded-sm hover:bg-[#CC2929] transition-colors"
            >
              COMEÇAR O LIVRO
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#333] py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-[#444] text-sm font-medium tracking-wider">
          <p>© 2026 BACK DISCIPLINE | BASEADO NO MÉTODO JOHN MEADOWS</p>
        </div>
      </footer>
    </div>
  );
}