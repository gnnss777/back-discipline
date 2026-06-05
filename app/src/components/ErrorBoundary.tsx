'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
          <div className="text-red-500 text-4xl mb-4">⚠</div>
          <p className="text-white text-lg mb-2">Algo deu errado</p>
          <p className="text-gray-500 text-sm mb-6 max-w-md text-center">
            {this.state.error?.message || 'Erro inesperado'}
          </p>
          <button
            onClick={this.handleRetry}
            className="px-6 py-3 bg-primary text-background font-bold rounded-lg uppercase tracking-wider"
          >
            Tentar novamente
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
