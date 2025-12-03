import React, { Component } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('Error Boundary caught an error:', error);
      console.error('Error Info:', errorInfo);
    }

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    this.handleReset();
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors">
          <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" strokeWidth={2} />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4">
              Bir Şeyler Yanlış Gitti
            </h1>

            <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
              Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin veya ana sayfaya dönün.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="mb-8 bg-gray-100 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h2 className="text-sm font-bold text-red-600 dark:text-red-400 mb-2">
                  Hata Detayları (Sadece Geliştirme Modunda):
                </h2>
                <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-40 whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                  {this.state.errorInfo && (
                    <>
                      {'\n\n'}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg transition"
              >
                <RefreshCw className="w-5 h-5" />
                Tekrar Dene
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold rounded-xl transition"
              >
                <Home className="w-5 h-5" />
                Ana Sayfaya Dön
              </button>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Sorun devam ederse, lütfen destek ekibiyle iletişime geçin.</p>
              <a 
                href="mailto:arcaglar@gmail.com" 
                className="text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
              >
                arcaglar@gmail.com
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const logErrorToService = (error: Error, errorInfo: React.ErrorInfo): void => {
  if (import.meta.env.PROD) {
    console.error('Production Error:', error, errorInfo);
  }
};
