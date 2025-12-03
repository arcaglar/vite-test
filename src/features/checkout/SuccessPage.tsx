import { useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { CheckCircle, Download, Home, Printer, Share2 } from 'lucide-react';
import type { Trip, Seat } from '../../types';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../context/LanguageContext';

export const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetBooking } = useBooking();
  const { t } = useLanguage();
  
  const state = location.state as { pnr: string; trip: Trip; selectedSeats: Seat[] } | null;

  useEffect(() => {
    resetBooking();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, [resetBooking]);

  if (!state || !state.pnr) {
    return <Navigate to="/" replace />;
  }

  const { pnr, trip, selectedSeats } = state;

  return (
    <div className="max-w-3xl mx-auto pt-10 pb-20 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-2xl text-center relative overflow-hidden transition-colors">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
        
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center shadow-inner">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" strokeWidth={3} />
          </div>
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">{t('bookingConfirmed')}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-10">{t('successMessage')}</p>
        
        <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl mb-10 border border-gray-100 dark:border-gray-700 relative transition-colors">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-4 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500 dark:text-gray-400 tracking-widest uppercase transition-colors">
              {t('pnrCode')}
          </div>
          <div className="text-5xl font-mono font-bold text-blue-600 dark:text-blue-400 tracking-widest mb-8 mt-2 select-all">{pnr}</div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-gray-200 dark:border-gray-700 pt-8">
            <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold mb-1">{t('operator')}</p>
                <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">{trip.company}</p>
            </div>
            <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold mb-1">{t('route')}</p>
                <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">{new Date(trip.departure).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} <span className="text-gray-400 dark:text-gray-500 font-normal mx-1">→</span> {new Date(trip.arrival).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold mb-1">{t('seat')}</p>
                <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                    {selectedSeats.map(s => s.no).join(', ')}
                </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button onClick={() => window.print()} className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition">
                <Printer size={18} /> {t('printTicket')}
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition">
                <Download size={18} /> {t('downloadPdf')}
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition">
                <Share2 size={18} /> {t('share')}
            </button>
        </div>

        <div className="mt-12">
             <button 
                onClick={() => navigate('/')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold flex items-center justify-center gap-2 mx-auto transition hover:underline"
            >
                <Home size={18} /> {t('backToHome')}
            </button>
        </div>
      </div>
    </div>
  );
};
