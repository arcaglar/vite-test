import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { SearchForm } from './features/search/SearchForm';
import { ScheduleList } from './features/schedules/ScheduleList';
import { SeatSelection } from './features/seats/SeatSelection';
import { PassengerForm } from './features/checkout/PassengerForm';
import { ReviewConfirm } from './features/checkout/ReviewConfirm';
import { SuccessPage } from './features/checkout/SuccessPage';
import { BookingProvider } from './context/BookingContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorBoundaryTest } from './components/ErrorBoundaryTest';
import { Layout } from './components/Layout';
import { ShieldCheck, Clock, CreditCard } from 'lucide-react';

const HomePageContent = () => {
  const { t } = useLanguage();
  
  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-800 dark:from-blue-800 dark:to-indigo-950 pt-20 pb-32 px-4 text-center md:text-left relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
               <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 0 L100 100 L100 0 Z" fill="white" />
               </svg>
          </div>

        <div className="container mx-auto relative z-10 max-w-6xl">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-blue-100 dark:text-blue-200 text-lg md:text-xl mb-8 max-w-xl leading-relaxed">
              {t('heroSubtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <SearchForm />
      </div>

      <div className="container mx-auto px-4 mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('whyChoose')}</h2>
          <p className="text-gray-600 dark:text-gray-400">{t('whyChooseDesc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 dark:border-gray-700 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">{t('safeSecure')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('safeSecureDesc')}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 dark:border-gray-700 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">{t('onTime')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('onTimeDesc')}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 dark:border-gray-700 text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">{t('bestPrices')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('bestPricesDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SchedulesPage = () => (
  <div className="container mx-auto py-12 px-4 min-h-screen">
    <ScheduleList />
  </div>
);

const SeatsPage = () => (
  <div className="container mx-auto py-12 px-4 min-h-screen">
    <SeatSelection />
  </div>
);

const PassengerInfoPage = () => (
  <div className="container mx-auto py-12 px-4 min-h-screen">
    <PassengerForm />
  </div>
);

const CheckoutPage = () => (
  <div className="container mx-auto py-12 px-4 min-h-screen">
    <ReviewConfirm />
  </div>
);

const ResultPage = () => (
  <div className="container mx-auto py-12 px-4 min-h-screen">
    <SuccessPage />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <ErrorBoundary>
              <BookingProvider>
                <BrowserRouter>
                  <ErrorBoundary>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<HomePageContent />} />
                        <Route path="/schedules" element={<SchedulesPage />} />
                        <Route path="/seats/:tripId" element={<SeatsPage />} />
                        <Route path="/passenger-info" element={<PassengerInfoPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/success" element={<ResultPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                      <ErrorBoundaryTest />
                    </Layout>
                  </ErrorBoundary>
                </BrowserRouter>
              </BookingProvider>
            </ErrorBoundary>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
