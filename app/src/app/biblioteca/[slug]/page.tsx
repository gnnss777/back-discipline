import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Play, ExternalLink, Dumbbell, AlertTriangle } from 'lucide-react';
import { exercises } from '../../../data/exercises';
import { extractYouTubeId, getYouTubeThumbnail, getYouTubeEmbedUrl } from '../../../types/exercise';

export function generateStaticParams() {
  return exercises.map(ex => ({ slug: ex.id }));
}

export default function ExercisePage({ params }: { params: { slug: string } }) {
  const exercise = exercises.find(ex => ex.id === params.slug);
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

        {videoId && (
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
        )}

        {exercise.fullDescription && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#E8E0D0] tracking-wider mb-4">DESCRIÇÃO TÉCNICA</h2>
            <div className="space-y-4 text-[#bbb] leading-relaxed">
              {exercise.fullDescription.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
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
