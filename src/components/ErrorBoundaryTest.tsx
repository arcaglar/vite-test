import { useState } from 'react';
import { Bug } from 'lucide-react';

export const ErrorBoundaryTest = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Test Error: Bu bir test hatasıdır. Error Boundary çalışıyor!');
  }

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShouldThrow(true)}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg shadow-lg transition"
        title="Error Boundary'yi test et"
      >
        <Bug className="w-4 h-4" />
        Test Error
      </button>
    </div>
  );
};
