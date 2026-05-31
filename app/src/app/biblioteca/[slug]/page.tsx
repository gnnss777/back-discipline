import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Play, ExternalLink, Dumbbell, Lightbulb, AlertTriangle, Info } from 'lucide-react';
import { exercises } from '../../../data/exercises';
import { extractYouTubeId, getYouTubeThumbnail, getYouTubeEmbedUrl, getExercisePlaceholders } from '../../../types/exercise';

// ─── Bloco parser (mesmo padrão do ContentRenderer) ───

const LABEL_RE = /^\*\*(Técnica|Setup|Por que funciona|Benefício|Meta|Quando usar|Execução|Função|Melhor|Recomendação|Progressão|Prevenção|Fatores|Estudo|Variação|Efeito)\b/i;
const DICA_RE = /^\*\*(Dica|Dica técnica|Dica avançada|Dica de Meadows):/i;
const WARNING_RE = /^\*\*(Cuidado|Aviso):/i;
const OVERVIEW_RE = /^\*\*O que/i;

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let last = 0, match: RegExpExecArray | null, key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[2]) parts.push(<strong key={key++} className="text-[#E8E0D0] font-bold">{match[2]}</strong>);
    else if (match[3]) parts.push(<em key={key++} className="italic text-[#E8E0D0]">{match[3]}</em>);
    last = regex.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function DescriptionBlocks({ text }: { text: string }) {
  const rawBlocks = text.split('\n\n').filter(b => b.trim());
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < rawBlocks.length; i++) {
    const block = rawBlocks[i].trim();

    // Tip
    if (DICA_RE.test(block)) {
      const content = block.replace(DICA_RE, '').trim();
      elements.push(
        <div key={key++} className="flex gap-3 p-4 bg-[#0F0F0F] border border-[#B8956A]/20 rounded-sm my-4">
          <Lightbulb className="w-5 h-5 text-[#B8956A] flex-shrink-0 mt-0.5" />
          <div className="text-[#bbb] text-sm leading-relaxed">{renderInline(content)}</div>
        </div>
      );
      continue;
    }

    // Warning
    if (WARNING_RE.test(block)) {
      const content = block.replace(WARNING_RE, '').trim();
      elements.push(
        <div key={key++} className="flex gap-3 p-4 bg-[#0F0F0F] border border-[#D4A574]/30 rounded-sm my-4">
          <AlertTriangle className="w-5 h-5 text-[#D4A574] flex-shrink-0 mt-0.5" />
          <div className="text-[#bbb] text-sm leading-relaxed">{renderInline(content)}</div>
        </div>
      );
      continue;
    }

    // Label group
    if (LABEL_RE.test(block)) {
      const m = block.match(LABEL_RE);
      const label = m ? m[1] : '';
      const content = block.replace(/^\*\*.*?:\*\*/, '').trim();
      elements.push(
        <div key={key++} className="p-4 bg-[#0F0F0F] border border-[#3A2E22] rounded-sm my-4">
          <span className="font-bold text-[#B8956A] text-sm tracking-wider">{label}:</span>
          <div className="mt-1 text-[#bbb] leading-relaxed">{renderInline(content)}</div>
        </div>
      );
      continue;
    }

    // Overview
    if (OVERVIEW_RE.test(block)) {
      const lines = block.split('\n').filter(l => l.trim());
      const title = lines[0].replace(/\*\*/g, '').replace(/:$/, '');
      const items = lines.slice(1).filter(l => l.trim().startsWith('- ') || l.trim().startsWith('* '));
      elements.push(
        <div key={key++} className="p-5 bg-[#0F0F0F] border border-[#3A2E22] rounded-sm my-6">
          <h4 className="font-bold text-[#B8956A] mb-3 tracking-wider flex items-center gap-2 text-sm">
            <Info className="w-4 h-4" />
            {title}
          </h4>
          <ul className="space-y-2">
            {items.map((item, idx) => (
              <li key={idx} className="flex gap-2 text-[#bbb] leading-relaxed">
                <span className="text-[#B8956A] mt-1 flex-shrink-0">•</span>
                <span>{renderInline(item.replace(/^[-*]\s*/, ''))}</span>
              </li>
            ))}
          </ul>
        </div>
      );
      continue;
    }

    // Bullet list
    if (/^[-*]\s/.test(block)) {
      const items = block.split('\n').filter(s => s.trim());
      elements.push(
        <ul key={key++} className="space-y-1.5 ml-5 my-4">
          {items.map((item, idx) => (
            <li key={idx} className="text-[#bbb] leading-relaxed list-disc">{renderInline(item.replace(/^[-*]\s*/, ''))}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(block)) {
      const steps = block.split('\n').filter(s => s.trim());
      elements.push(
        <ol key={key++} className="space-y-3 my-6">
          {steps.map((step, idx) => (
            <li key={idx} className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#B8956A]/10 text-[#B8956A] flex items-center justify-center text-sm font-bold mt-0.5">{idx + 1}</span>
              <span className="text-[#bbb] leading-relaxed pt-0.5">{renderInline(step.replace(/^\d+\.\s*/, ''))}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Plain paragraph
    elements.push(
      <p key={key++} className="text-[#bbb] leading-[2.0] text-lg font-light">{renderInline(block)}</p>
    );
  }

  return <div className="space-y-4">{elements}</div>;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return exercises.map(ex => ({ slug: ex.id }));
}

export default async function ExercisePage({ params }: PageProps) {
  const { slug } = await params;
  const exercise = exercises.find(ex => ex.id === slug);
  if (!exercise) notFound();

  const videoId = exercise.videoUrl ? extractYouTubeId(exercise.videoUrl) : null;
  const difficultyColors: Record<string, string> = {
    Iniciante: 'bg-green-900/50 text-green-500',
    Intermediário: 'bg-yellow-900/50 text-yellow-500',
    Avançado: 'bg-red-900/50 text-red-500',
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      <header className="border-b border-[#2A2A2A] sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/biblioteca" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-medium tracking-wider text-sm">
            <ArrowLeft className="w-4 h-4" />
            BIBLIOTECA
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#B8956A] flex items-center justify-center rounded-sm">
              <span className="text-[#0A0A0A] text-sm font-bold">JJ</span>
            </div>
            <span className="font-bold tracking-wider">{exercise.name.split('(')[0].trim()}</span>
          </div>
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-white font-medium tracking-wider">
            PAINEL
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-6">
          <span className="px-3 py-1 bg-[#B8956A]/20 text-[#B8956A] text-sm font-bold tracking-wider rounded-sm">
            {exercise.category.toUpperCase()}
          </span>
          <span className={`px-3 py-1 text-xs font-bold tracking-wider rounded-sm ${difficultyColors[exercise.difficulty] || 'bg-gray-900/50 text-gray-500'}`}>
            {exercise.difficulty.toUpperCase()}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-wider">{exercise.name}</h1>
        <p className="text-[#bbb] text-lg mb-8">{exercise.description}</p>

        <div className="flex flex-wrap gap-2 mb-10">
          {exercise.muscles.map(muscle => (
            <span key={muscle} className="text-xs text-[#444] bg-[#222] px-3 py-1.5 rounded-sm tracking-wider">
              {muscle.toUpperCase()}
            </span>
          ))}
        </div>

        {videoId ? (
          <div className="mb-10">
            <div className="relative aspect-video bg-[#111] rounded-sm overflow-hidden border border-[#2A2A2A] group">
              <img
                src={getYouTubeThumbnail(videoId)}
                alt={exercise.name}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <a
                href={exercise.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-16 h-16 bg-[#B8956A]/90 hover:bg-[#B8956A] rounded-full flex items-center justify-center transition-colors">
                  <Play className="w-8 h-8 text-[#0A0A0A] fill-[#0A0A0A] ml-1" />
                </div>
              </a>
            </div>
            <a
              href={exercise.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-1 text-xs text-gray-500 hover:text-[#B8956A] transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              ASSISTIR NO YOUTUBE
            </a>
          </div>
        ) : (
          <div className="mb-10">
            <div className="aspect-video bg-[#111] rounded-sm border border-[#2A2A2A] flex items-center justify-center">
              <div className="text-center">
                <Play className="w-12 h-12 text-[#333] mx-auto mb-3" />
                <p className="text-[#444] text-sm tracking-wider">VÍDEO EM BREVE</p>
              </div>
            </div>
          </div>
        )}

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#E8E0D0] tracking-wider mb-4">GALERIA</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(exercise.images || getExercisePlaceholders(exercise.name)).map((url, i) => (
              <div key={i} className="aspect-[4/3] bg-[#111] rounded-sm overflow-hidden border border-[#2A2A2A]">
                <img
                  src={url}
                  alt={`${exercise.name} — ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {exercise.fullDescription && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#E8E0D0] tracking-wider mb-4">DESCRIÇÃO TÉCNICA</h2>
            <DescriptionBlocks text={exercise.fullDescription} />
          </section>
        )}

        {exercise.tips && exercise.tips.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#E8E0D0] tracking-wider mb-4">DICAS TÉCNICAS</h2>
            <div className="bg-[#111] border border-[#2A2A2A] rounded-sm p-6">
              <ul className="space-y-3">
                {exercise.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#bbb]">
                    <span className="w-6 h-6 bg-[#B8956A]/20 text-[#B8956A] rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {exercise.chapterSlugs && exercise.chapterSlugs.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#E8E0D0] tracking-wider mb-4">CAPÍTULOS RELACIONADOS</h2>
            <div className="flex flex-wrap gap-3">
              {exercise.chapterSlugs.map(slug => (
                <Link
                  key={slug}
                  href={`/livro/${slug}`}
                  className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-[#2A2A2A] rounded-sm text-sm text-gray-400 hover:border-[#B8956A] hover:text-[#B8956A] transition-colors"
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  {slug
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, c => c.toUpperCase())
                    .replace(/Semana/g, 'Semana')
                    .replace(/Visao Geral/g, 'Visão Geral')
                  }
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="border-t border-[#2A2A2A] pt-6 flex justify-between items-center">
          <Link
            href="/biblioteca"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            VOLTAR PARA BIBLIOTECA
          </Link>
          <Link
            href="/planilha"
            className="flex items-center gap-2 text-sm text-[#B8956A] hover:text-white transition-colors tracking-wider"
          >
            VER NA PLANILHA
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
