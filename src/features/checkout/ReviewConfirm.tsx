import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useBooking } from '../../context/BookingContext';
import { createBooking } from '../../api';
import { Shield, CreditCard, Calendar, MapPin, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ReviewConfirm = () => {
  const navigate = useNavigate();
  const { trip, selectedSeats, passengers, contact } = useBooking();
  const { t } = useLanguage();

  useEffect(() => {
    if (!trip || selectedSeats.length === 0 || !contact) {
      navigate('/');
    }
  }, [trip, selectedSeats, contact, navigate]);

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      navigate('/success', { state: { pnr: data.pnr, trip, selectedSeats } });
    },
  });

  const handleConfirm = () => {
    if (!trip || !contact) return;

    bookingMutation.mutate({
      tripId: trip.id,
      seats: selectedSeats.map(s => s.no),
      contact: contact,
      passengers: passengers,
    });
  };

  if (!trip || !contact) return null;

  const totalAmount = selectedSeats.reduce((sum, s) => sum + s.unitPrice, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('confirmBooking')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{t('reviewDetails')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><MapPin size={18} /></div>
                    {t('tripInfo')}
                </h3>
                <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">{t('operator')}</p>
                        <p className="font-bold text-gray-900">{trip.company}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">{t('date')}</p>
                        <p className="font-bold text-gray-900 flex items-center gap-1 justify-end">
                            <Calendar size={14} />
                            {new Date(trip.departure).toLocaleDateString('tr-TR')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-6 px-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{new Date(trip.departure).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{t('departure')}</p>
                    </div>
                    <div className="flex-1 border-t-2 border-dashed border-gray-300 mx-6 relative">
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-white px-2 text-gray-400 text-xs">{t('direct')}</div>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{new Date(trip.arrival).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{t('arrival')}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg"><User size={18} /></div>
                    {t('passengers')}
                </h3>
                <div className="divide-y divide-gray-100">
                    {passengers.map((p, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                                {p.seat}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{p.firstName} {p.lastName}</p>
                                <p className="text-xs text-gray-500">{p.gender} • {p.idNo}</p>
                            </div>
                        </div>
                        <div className="font-medium text-gray-900">
                            {selectedSeats.find(s => s.no === p.seat)?.unitPrice} TRY
                        </div>
                    </div>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    {t('contact')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="block text-gray-500 text-xs mb-1">{t('emailAddress')}</span>
                        <span className="font-medium text-gray-900">{contact.email}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="block text-gray-500 text-xs mb-1">{t('phoneNumber')}</span>
                        <span className="font-medium text-gray-900">{contact.phone}</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700 sticky top-24 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('paymentSummary')}</h3>
                
                <div className="space-y-3 mb-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                        <span>{t('baseFare')} ({selectedSeats.length} {t('seat')})</span>
                        <span>{totalAmount} TRY</span>
                    </div>
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>{t('discount')}</span>
                        <span>0 TRY</span>
                    </div>
                    <div className="flex justify-between">
                        <span>{t('serviceFee')}</span>
                        <span>0 TRY</span>
                    </div>
                </div>

                <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900 dark:text-gray-100">{t('totalAmount')}</span>
                        <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{totalAmount} TRY</span>
                    </div>
                </div>

                <button
                    onClick={handleConfirm}
                    disabled={bookingMutation.isPending}
                    className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600 dark:active:bg-green-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition flex items-center justify-center gap-2 mb-4"
                >
                    {bookingMutation.isPending ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <span>{t('paySecurely')}</span>
                            <CreditCard size={18} />
                        </>
                    )}
                </button>

                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <Shield size={12} />
                        <span>{t('paymentsSecure')}</span>
                    </div>
                    <div className="flex justify-center gap-2 opacity-50 grayscale hover:grayscale-0 transition duration-300">
                         <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                         <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                         <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {bookingMutation.isError && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-xl border border-red-200 flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          {t('paymentFailed')}
        </div>
      )}
    </div>
  );
};
