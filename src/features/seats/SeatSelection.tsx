import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchSeatSchema } from '../../api';
import { useBooking } from '../../context/BookingContext';
import type { Seat } from '../../types';
import { User, Check, Users } from 'lucide-react';
import clsx from 'clsx';
import { useLanguage } from '../../context/LanguageContext';

interface SelectedSeat extends Seat {
  unitPrice: number;
}

export const SeatSelection = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { trip, selectedSeats, setSelectedSeats } = useBooking();
  const { t } = useLanguage();

  const { data: schema, isLoading, error } = useQuery({
    queryKey: ['seatSchema', tripId],
    queryFn: () => fetchSeatSchema(tripId!),
    enabled: !!tripId,
  });

  const getAdjacentSeats = (seat: Seat): Seat[] => {
    if (!schema) return [];
    
    const adjacentSeats: Seat[] = [];
    const { row, col } = seat;
    
    const leftSeat = schema.seats.find(s => s.row === row && s.col === col - 1);
    const rightSeat = schema.seats.find(s => s.row === row && s.col === col + 1);
    
    if (leftSeat && leftSeat.status === 'empty') {
      adjacentSeats.push(leftSeat);
    }
    if (rightSeat && rightSeat.status === 'empty') {
      adjacentSeats.push(rightSeat);
    }
    
    return adjacentSeats;
  };

  const getSuggestedSeats = (): number[] => {
    if (selectedSeats.length !== 1) return [];
    
    const selectedSeat = selectedSeats[0];
    const adjacentSeats = getAdjacentSeats(selectedSeat);
    
    return adjacentSeats.map(s => s.no);
  };

  const suggestedSeatNumbers = getSuggestedSeats();

  const toggleSeat = (seat: Seat) => {
    if (seat.status === 'taken') return;

    const isSelected = selectedSeats.some(s => s.no === seat.no);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.no !== seat.no));
    } else {
      if (selectedSeats.length >= 4) {
        alert(t('maxSeatsError'));
        return;
      }
      const seatWithPrice: SelectedSeat = { ...seat, unitPrice: schema?.unitPrice || 0 };
      setSelectedSeats([...selectedSeats, seatWithPrice as any]);
    }
  };

  const handleContinue = () => {
    navigate('/passenger-info');
  };

  if (isLoading) return <div className="text-center p-12">{t('loadingSeatMap')}</div>;
  if (error || !schema) return <div className="text-center text-red-500 p-12">{t('errorSeatMap')}</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('selectYourSeats')}</h1>
        {trip && <p className="text-gray-600 dark:text-gray-400">{trip.company} • {new Date(trip.departure).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} {t('departure')}</p>}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Seat Map Container */}
        <div className="flex-1 w-full bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
            <div className="flex justify-center gap-8 mb-10 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl flex-wrap">
                <div className="flex items-center gap-2"><div className="w-6 h-6 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm"></div> {t('available')}</div>
                <div className="flex items-center gap-2"><div className="w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-md shadow-sm border-2 border-blue-600 dark:border-blue-500"></div> {t('selected')}</div>
                <div className="flex items-center gap-2"><div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-md opacity-50 border-2 border-gray-300 dark:border-gray-700"></div> {t('occupied')}</div>
                {suggestedSeatNumbers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900 border-2 border-green-400 dark:border-green-600 rounded-md shadow-sm"></div> 
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Önerilen
                    </span>
                  </div>
                )}
            </div>

            <div className="bg-gray-100 dark:bg-gray-900 rounded-[3rem] p-12 pb-20 relative shadow-inner border-4 border-gray-200 dark:border-gray-700 mx-auto max-w-md transition-colors">
                {/* Driver Area */}
                <div className="absolute top-8 left-8">
                     <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 shadow-sm">
                         <User size={24} />
                     </div>
                </div>
                
                {/* Bus Front/Windshield Effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-4 bg-gray-300 rounded-b-xl"></div>

                <div className="mt-16 flex flex-col gap-3">
                    {schema.layout.cells.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex justify-center gap-4">
                            {row.map((cellType, colIndex) => {
                                if (cellType === 2) {
                                    return <div key={`${rowIndex}-${colIndex}`} className="w-10 h-10 flex items-center justify-center text-gray-300 text-xs font-bold">
                                        {rowIndex + 1}
                                    </div>; 
                                }

                                if (cellType === 3) {
                                    return <div key={`${rowIndex}-${colIndex}`} className="w-10 h-10"></div>;
                                }

                                const seat = schema.seats.find(s => s.row === rowIndex + 1 && s.col === colIndex + 1);
                                
                                if (!seat) return <div key={`${rowIndex}-${colIndex}`} className="w-10 h-10"></div>;

                                const isSelected = selectedSeats.some(s => s.no === seat.no);
                                const isOccupied = seat.status === 'taken';
                                const isSuggested = suggestedSeatNumbers.includes(seat.no);

                                return (
                                    <button
                                        key={seat.no}
                                        disabled={isOccupied}
                                        onClick={() => toggleSeat(seat)}
                                        className={clsx(
                                            "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200 shadow-sm relative",
                                            isOccupied && "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed border-2 border-gray-300 dark:border-gray-600",
                                            isSelected && "bg-blue-600 dark:bg-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-900 scale-110 z-10 border-2 border-blue-600 dark:border-blue-500",
                                            isSuggested && !isSelected && "bg-green-100 dark:bg-green-900 border-2 border-green-400 dark:border-green-600 text-green-700 dark:text-green-400 ring-2 ring-green-200 dark:ring-green-900 animate-pulse",
                                            !isOccupied && !isSelected && !isSuggested && "bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md"
                                        )}
                                    >
                                        {isSelected ? <Check size={16} strokeWidth={3} /> : seat.no}
                                        {isSuggested && !isSelected && (
                                          <Users className="absolute -top-1 -right-1 w-3 h-3 text-green-600 dark:text-green-400" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Suggestion Hint */}
            {suggestedSeatNumbers.length > 0 && (
              <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-start gap-3">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-green-900 dark:text-green-300 mb-1">Yan Yana Koltuk Önerisi</p>
                  <p className="text-green-700 dark:text-green-400">
                    Seçtiğiniz koltuğun yanındaki {suggestedSeatNumbers.length === 1 ? 'koltuk' : 'koltuklar'} ({suggestedSeatNumbers.join(', ')}) müsait. 
                    Birlikte seyahat için ideal!
                  </p>
                </div>
              </div>
            )}
        </div>

        {/* Summary Sidebar */}
        <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 sticky top-24 transition-colors">
                <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    {t('bookingSummary')}
                </h3>
                
                {trip && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-6">
                        <div className="flex justify-between mb-2">
                            <span className="text-blue-800 dark:text-blue-300 font-medium">{trip.company}</span>
                            <span className="font-bold text-blue-900 dark:text-blue-200">{trip.price} TRY</span>
                        </div>
                        <div className="flex justify-between text-sm text-blue-600 dark:text-blue-400">
                            <span>{new Date(trip.departure).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                            <span>→</span>
                            <span>{new Date(trip.arrival).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                )}

                <div className="mb-6">
                    <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">{t('selected')} ({selectedSeats.length})</h4>
                    {selectedSeats.length === 0 ? (
                        <div className="text-gray-400 dark:text-gray-500 text-sm text-center py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                            {t('pleaseSelectSeats')}
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {selectedSeats.map(s => (
                                <div key={s.no} className="bg-gray-900 dark:bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg font-medium shadow-sm flex items-center gap-2">
                                    <span>{t('seat')} {s.no}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-6 mt-6">
                    <div className="flex justify-between items-end mb-6">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">{t('totalAmount')}</span>
                        <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                            {selectedSeats.length * (schema?.unitPrice || 0)} <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">TRY</span>
                        </span>
                    </div>

                    <button
                        onClick={handleContinue}
                        disabled={selectedSeats.length === 0}
                        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition shadow-lg shadow-blue-200 dark:shadow-blue-900/50 text-lg"
                    >
                        {t('continue')}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
