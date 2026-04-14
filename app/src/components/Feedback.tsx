'use client';

export function LoadingState({ message = 'Carregando...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#B8956A] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-gray-400">{message}</p>
    </div>
  );
}

export function ErrorState({ 
  message = 'Algo deu errado', 
  onRetry 
}: { 
  message?: string; 
  onRetry?: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      <div className="text-red-500 text-4xl mb-4">⚠</div>
      <p className="text-white text-lg mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-[#B8956A] text-[#0A0A0A] font-bold rounded-lg"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}

export function EmptyState({ 
  icon = '📋', 
  title = 'Nenhum item encontrado',
  description = '',
  action,
  actionLabel
}: { 
  icon?: string; 
  title?: string; 
  description?: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-white text-lg font-medium mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-4">{description}</p>}
      {action && actionLabel && (
        <button
          onClick={action}
          className="px-6 py-3 bg-[#B8956A] text-[#0A0A0A] font-bold rounded-lg"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}