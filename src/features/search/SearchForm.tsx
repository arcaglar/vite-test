import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { format, isBefore, startOfDay } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { fetchLocations } from '../../api';
import type { Location } from '../../types';
import { MapPin, Calendar, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Autocomplete } from '../../components/Autocomplete';

const createSearchSchema = (t: (key: string) => string) => z.object({
  from: z.string().min(1, t('validationDepartureRequired')),
  to: z.string().min(1, t('validationArrivalRequired')),
  date: z.string().min(1, t('validationDateRequired')).refine((date) => {
    const selected = new Date(date);
    const today = startOfDay(new Date());
    return !isBefore(selected, today);
  }, {
    message: t('validationDatePast'),
  }),
}).refine((data) => data.from !== data.to, {
  message: t('validationSameLocation'),
  path: ["to"],
});

type SearchFormValues = {
  from: string;
  to: string;
  date: string;
};

export const SearchForm = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const searchSchema = createSearchSchema(t);
  
  const { data: locations, isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: fetchLocations,
  });

  const { register, control, handleSubmit, formState: { errors } } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      from: '',
      to: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    }
  });

  const onSubmit = (data: SearchFormValues) => {
    navigate(`/schedules?from=${data.from}&to=${data.to}&date=${data.date}`);
  };

  const locationOptions = locations?.map((loc: Location) => ({
    id: loc.id,
    name: loc.name,
  })) || [];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto relative z-10 -mt-20 md:-mt-32 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-6 border-b dark:border-gray-700 pb-4">
        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400">
          <Search className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('findTicket')}</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        {/* From Autocomplete */}
        <div className="md:col-span-4">
          <Controller
            name="from"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={locationOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder={t('selectDeparture')}
                label={t('from')}
                error={errors.from?.message}
                icon={<MapPin className="w-5 h-5" />}
                disabled={isLoading}
              />
            )}
          />
        </div>

        <div className="hidden md:flex md:col-span-1 pt-10 justify-center items-center text-gray-300">
            <span className="border-t-2 border-dashed w-8 mx-auto"></span>
        </div>

        {/* To Autocomplete */}
        <div className="md:col-span-4">
          <Controller
            name="to"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={locationOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder={t('selectArrival')}
                label={t('to')}
                error={errors.to?.message}
                icon={<MapPin className="w-5 h-5" />}
                disabled={isLoading}
              />
            )}
          />
        </div>

        {/* Date Input */}
        <div className="md:col-span-3 relative group">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 ml-1">{t('date')}</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-4 text-gray-400 dark:text-gray-500 w-5 h-5 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition pointer-events-none z-10" />
            <input 
              type="date" 
              {...register("date")}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-base rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent block pl-10 p-3 transition hover:bg-gray-100 dark:hover:bg-gray-600 font-medium"
            />
          </div>
          {errors.date && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.date.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-12 mt-2">
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-600 dark:active:bg-blue-800 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-lg font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/50 transition transform hover:-translate-y-0.5 flex justify-center items-center gap-2"
          >
            <Search className="w-5 h-5" />
            {isLoading ? t('loadingLocations') : t('search')}
          </button>
        </div>
      </form>
    </div>
  );
};
