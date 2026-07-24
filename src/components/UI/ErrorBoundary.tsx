import { Component, ReactNode, ErrorInfo } from 'react';

export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  state = {
    hasError: false,
    error: null as Error | null,
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-[#1A1A1A] text-[#FDF6E3] font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="max-w-md w-full bg-[#2D2D2D] p-6 rounded-2xl border border-[#D4AF37]/50 text-center shadow-2xl">
            <h1 className="text-xl font-bold text-[#D4AF37] font-['Cinzel',serif] mb-2">
              Ошибка загрузки / Loading Error
            </h1>
            <p className="text-sm text-amber-100/80 mb-4">
              {this.state.error?.message || 'Произошла непредвиденная ошибка при запуске игры.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:brightness-110 text-[#1A1A1A] font-bold rounded-xl transition-all shadow-lg active:scale-95"
            >
              Перезагрузить страницу / Reload Page
            </button>
          </div>
        </div>
      );
    }

    return (this.props as { children: ReactNode }).children;
  }
}
