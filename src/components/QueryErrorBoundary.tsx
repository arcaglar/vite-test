import { AlertCircle, RefreshCw } from 'lucide-react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from './ErrorBoundary';
import type { ReactNode } from 'react';

interface QueryErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const QueryErrorFallback = ({ error, resetErrorBoundary }: QueryErrorFallbackProps) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" strokeWidth={2} />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Veri Yüklenemedi
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
          {error.message || 'Veriler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.'}
        </p>

        <button
          onClick={resetErrorBoundary}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg transition mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Yeniden Dene
        </button>
      </div>
    </div>
  );
};

interface QueryErrorBoundaryProps {
  children: ReactNode;
}

export const QueryErrorBoundary = ({ children }: QueryErrorBoundaryProps) => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Query Error Boundary caught:', error, errorInfo);
      }}
      fallback={
        <QueryErrorFallback
          error={new Error('Bir hata oluştu')}
          resetErrorBoundary={reset}
        />
      }
    >
      {children}
    </ErrorBoundary>
  );
};

