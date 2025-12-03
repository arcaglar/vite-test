import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchSchedules } from '../../api';
import type { Trip } from '../../types';
import { ArrowRight, Clock, Bus, Wifi, Coffee, BatteryCharging } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';

export const ScheduleList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setTrip } = useBooking();
  const { t } = useLanguage();
  
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');

  const { data: schedules, isLoading, error } = useQuery({
    queryKey: ['schedules', from, to, date],
    queryFn: () => fetchSchedules(from!, to!, date!),
    enabled: !!from && !!to && !!date,
  });

  const [sortBy, setSortBy] = useState<'time' | 'price'>('time');
  const [filterCompany, setFilterCompany] = useState<string>('all');

  const processedSchedules = useMemo(() => {
    if (!schedules) return [];
    
    let result = [...schedules];

    if (filterCompany !== 'all') {
      result = result.filter(s => s.company === filterCompany);
    }

    result.sort((a, b) => {
      if (sortBy === 'time') {
        return a.departure.localeCompare(b.departure);
      } else {
        return a.price - b.price;
      }
    });

    return result;
  }, [schedules, sortBy, filterCompany]);

  const companies = useMemo(() => {
    if (!schedules) return [];
    return Array.from(new Set(schedules.map(s => s.company)));
  }, [schedules]);

  if (!from || !to || !date) {
    return (
        <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">{t('whereTo')}</h3>
            <Link to="/" className="text-blue-600 font-semibold hover:underline">{t('newSearch')}</Link>
        </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
        <div className="text-center py-20 bg-red-50 rounded-xl max-w-4xl mx-auto">
            <p className="text-red-600 font-medium">{t('unableToLoad')}</p>
        </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors duration-300">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {processedSchedules.length} {t('tripsAvailable')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
                {from} <ArrowRight className="inline w-4 h-4 mx-1" /> {to} • {date}
            </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select 
            value={filterCompany} 
            onChange={(e) => setFilterCompany(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none text-sm transition-colors"
          >
            <option value="all">{t('allCompanies')}</option>
            {companies.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'time' | 'price')}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none text-sm transition-colors"
          >
            <option value="time">{t('departureTime')}</option>
            <option value="price">{t('priceLowToHigh')}</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {processedSchedules.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noTripsFound')}</p>
              <button onClick={() => setFilterCompany('all')} className="mt-4 text-blue-600 dark:text-blue-400 font-medium">{t('clearFilters')}</button>
          </div>
        ) : (
          processedSchedules.map((trip: Trip) => (
            <div key={trip.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition duration-300 group relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                {/* Left: Company & Times */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300">
                        <Bus className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 leading-none">{trip.company}</h3>
                        <div className="flex gap-2 mt-1 text-xs text-gray-400 dark:text-gray-500">
                            <Wifi className="w-3 h-3" />
                            <Coffee className="w-3 h-3" />
                            <BatteryCharging className="w-3 h-3" />
                            <span>{t('standardSeat')}</span>
                        </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-gray-900 dark:text-gray-100">{new Date(trip.departure).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">{t('departure')}</span>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center px-4">
                        <div className="w-full h-0.5 bg-gray-300 dark:bg-gray-600 relative mb-1">
                            <div className="absolute top-1/2 left-0 w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full -translate-y-1/2"></div>
                            <div className="absolute top-1/2 right-0 w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full -translate-y-1/2"></div>
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {Math.floor((new Date(trip.arrival).getTime() - new Date(trip.departure).getTime()) / (1000 * 60 * 60))}h {Math.floor(((new Date(trip.arrival).getTime() - new Date(trip.departure).getTime()) % (1000 * 60 * 60)) / (1000 * 60))}m
                        </span>
                    </div>

                    <div className="text-center">
                        <span className="block text-2xl font-bold text-gray-900 dark:text-gray-100">{new Date(trip.arrival).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">{t('arrival')}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Price & Action */}
                <div className="flex flex-col items-end justify-between border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 md:pl-8 pt-4 md:pt-0 gap-4 min-w-[180px]">
                    <div className="text-right">
                        <span className="block text-3xl font-extrabold text-blue-600 dark:text-blue-400">{trip.price} <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">TRY</span></span>
                    </div>
                    
                    <div className="w-full">
                        <button
                            onClick={() => {
                                setTrip(trip);
                                navigate(`/seats/${trip.id}`);
                            }}
                            className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-orange-200 dark:shadow-orange-900/50"
                        >
                            {t('selectSeats')}
                        </button>
                        <div className="text-center mt-2 text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/30 py-1 rounded">
                            {trip.availableSeats} {t('seatsLeft')}
                        </div>
                    </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
