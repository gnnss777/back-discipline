import Link from "next/link";
import { ArrowLeft, Search, Dumbbell, Filter } from "lucide-react";

const exercises = [
  {
    id: "meadows-row",
    name: "Meadows Row",
    category: "Remadas",
    muscles: ["Latíssimo", "Rombóides", "Trapézio Médio"],
    difficulty: "Avançado",
    description: "Remada unilateral com landmine para desenvolvimento de espessura e ângulos variados."
  },
  {
    id: "one-arm-barbell-row",
    name: "Remada Unilateral com Barra",
    category: "Remadas",
    muscles: ["Latíssimo", "Rombóides", "Deltoide Posterior"],
    difficulty: "Intermediário",
    description: "Remada unilateral para focar cada lado individualmente e corrigir desequilíbrios."
  },
  {
    id: "smith-machine-row",
    name: "Smith Machine Row",
    category: "Remadas",
    muscles: ["Latíssimo", "Rombóides", "Eretores"],
    difficulty: "Iniciante",
    description: "Remada na Smith Machine com movimento controlado e descanso no fundo."
  },
  {
    id: "deadstop-dumbbell-row",
    name: "Deadstop Dumbbell Row",
    category: "Remadas",
    muscles: ["Latíssimo", "Rombóides"],
    difficulty: "Intermediário",
    description: "Remada com haltere onde cada repetição começa do zero para eliminar momentum."
  },
  {
    id: "t-bar-row",
    name: "T-Bar Row",
    category: "Remadas",
    muscles: ["Latíssimo", "Trapézio Médio", "Rombóides"],
    difficulty: "Intermediário",
    description: "Remada estilo old school para criar espessura nas costas."
  },
  {
    id: "rack-pull",
    name: "Rack Pull",
    category: "Levantamento",
    muscles: ["Eretores", "Latíssimo", "Trapézio"],
    difficulty: "Avançado",
    description: "Variação do deadlift com a barra iniciando na altura dos joelhos."
  },
  {
    id: "deficit-deadlift",
    name: "Deficit Deadlift",
    category: "Levantamento",
    muscles: ["Eretores", "Latíssimo", "Cadeia Posterior"],
    difficulty: "Avançado",
    description: "Deadlift com os pés elevados para aumentar a amplitude de movimento."
  },
  {
    id: "chin-up",
    name: "Chin-Up (Puxada na Barra)",
    category: "Puxadas",
    muscles: ["Latíssimo", "Rombóides", "Bíceps"],
    difficulty: "Intermediário",
    description: "Puxada com pegada supinada para desenvolvimento do lat."
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    category: "Puxadas",
    muscles: ["Latíssimo"],
    difficulty: "Iniciante",
    description: "Puxada na máquina para trabalhar o lat com foco na conexão mente-músculo."
  },
  {
    id: "underhand-pulldown",
    name: "Underhand Pulldown",
    category: "Puxadas",
    muscles: ["Latíssimo", "Bíceps"],
    difficulty: "Iniciante",
    description: "Pulldown com pegada supinada para ênfase no lat inferior."
  },
  {
    id: "trx-horizontal-chin",
    name: "TRX Horizontal Chin",
    category: "Puxadas",
    muscles: ["Latíssimo", "Rombóides"],
    difficulty: "Iniciante",
    description: "Puxada horizontal no TRX para trabalho profundo do lat."
  },
  {
    id: "face-pull",
    name: "Face Pull",
    category: "Isolamento",
    muscles: ["Trapézio Médio", "Rombóides", "Deltoide Posterior"],
    difficulty: "Iniciante",
    description: "Exercício para saúde do ombro e desenvolvimento do trapézio médio."
  },
  {
    id: "banded-pullover",
    name: "Banded Pullover",
    category: "Isolamento",
    muscles: ["Latíssimo"],
    difficulty: "Iniciante",
    description: "Pullover com banda para trabalho na posição alongada."
  },
  {
    id: "dumbbell-pullover",
    name: "Dumbbell Pullover",
    category: "Isolamento",
    muscles: ["Latíssimo"],
    difficulty: "Iniciante",
    description: "Pullover com haltere para trabalho de alongamento do lat."
  },
  {
    id: "hyperextension-bands",
    name: "Hiperextensão com Bandas",
    category: "Isolamento",
    muscles: ["Eretores", "Glúteos"],
    difficulty: "Iniciante",
    description: "Hiperextensão com resistência progressiva de bandas."
  },
  {
    id: "farmers-walk",
    name: "Farmer's Walk",
    category: "Funcional",
    muscles: ["Trapézio Superior", "Eretores", "Core"],
    difficulty: "Intermediário",
    description: "Carregamento de peso para desenvolvimento de força de preensão e estabilidade."
  }
];

const categories = ["Todas", "Remadas", "Puxadas", "Levantamento", "Isolamento", "Funcional"];

export default function BibliotecaPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-[#333] sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#666] hover:text-white transition-colors font-medium tracking-wider text-sm">
            <ArrowLeft className="w-4 h-4" />
            VOLTAR
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#B8956A] flex items-center justify-center rounded-sm">
              <span className="text-[#0A0A0A] text-sm font-bold">JJ</span>
            </div>
            <span className="font-bold tracking-wider">BIBLIOTECA</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 tracking-wider">BIBLIOTECA <span className="text-[#B8956A]">TÉCNICA</span></h1>
          <p className="text-[#555] text-lg font-medium tracking-wide">GUIA COMPLETO DE EXERCÍCIOS COM TÉCNICA E DICAS</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#555]" />
            <input 
              type="text" 
              placeholder="BUSCAR EXERCÍCIO..." 
              className="w-full pl-12 pr-4 py-3 bg-[#111] border border-[#333] rounded-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#B8956A] font-medium tracking-wider"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#555]" />
            <select className="px-4 py-3 bg-[#111] border border-[#333] rounded-sm text-white focus:outline-none focus:border-[#B8956A] font-medium tracking-wider">
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Exercises Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map(exercise => (
            <div 
              key={exercise.id}
              className="p-6 bg-[#111] border border-[#333] rounded-sm hover:border-[#B8956A] hover:bg-[#151515] transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="px-2 py-1 bg-[#B8956A]/20 text-[#B8956A] text-xs font-bold tracking-wider rounded-sm">
                    {exercise.category.toUpperCase()}
                  </span>
                  <h3 className="text-lg font-bold mt-2 group-hover:text-[#B8956A] transition-colors tracking-wider">
                    {exercise.name}
                  </h3>
                </div>
                <span className={`px-2 py-1 text-xs font-bold tracking-wider rounded-sm ${
                  exercise.difficulty === 'Iniciante' ? 'bg-green-900/50 text-green-500' :
                  exercise.difficulty === 'Intermediário' ? 'bg-yellow-900/50 text-yellow-500' :
                  'bg-red-900/50 text-red-500'
                }`}>
                  {exercise.difficulty.toUpperCase()}
                </span>
              </div>
              
              <p className="text-sm text-[#555] mb-4">{exercise.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {exercise.muscles.map(muscle => (
                  <span key={muscle} className="text-xs text-[#444] bg-[#222] px-2 py-1 rounded-sm tracking-wider">
                    {muscle.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-12 p-8 bg-[#111] rounded-xl border border-[#333] text-center">
          <h3 className="text-xl font-bold mb-2 tracking-wider">VÍDEOS EM BREVE</h3>
          <p className="text-[#555]">Estamos preparando vídeos de demonstração para cada exercício.</p>
        </div>
      </main>
    </div>
  );
}