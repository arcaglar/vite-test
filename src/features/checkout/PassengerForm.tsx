import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { Mail, Phone, CreditCard, Lock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const createPassengerSchema = (t: (key: string) => string) => z.object({
  seat: z.number(),
  firstName: z.string().min(2, t('validationFirstNameMin')),
  lastName: z.string().min(2, t('validationLastNameMin')),
  idNo: z.string().min(7, t('validationIdMin')),
  gender: z.enum(['male', 'female', 'other']).refine((val) => val !== undefined, {
    message: t('validationGenderRequired'),
  }),
});

const createContactSchema = (t: (key: string) => string) => z.object({
  email: z.string().email(t('validationEmailInvalid')),
  phone: z.string().min(10, t('validationPhoneMin')),
});

const createFormSchema = (t: (key: string) => string) => z.object({
  passengers: z.array(createPassengerSchema(t)),
  contact: createContactSchema(t),
  termsAccepted: z.boolean().refine(val => val === true, t('validationTermsRequired')),
});

type FormValues = {
  passengers: Array<{
    seat: number;
    firstName: string;
    lastName: string;
    idNo: string;
    gender: 'male' | 'female' | 'other';
  }>;
  contact: {
    email: string;
    phone: string;
  };
  termsAccepted: boolean;
};

export const PassengerForm = () => {
  const navigate = useNavigate();
  const { selectedSeats, setPassengers, setContact } = useBooking();
  const { t } = useLanguage();
  const formSchema = createFormSchema(t);

  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passengers: selectedSeats.map(s => ({
        seat: s.no,
        firstName: '',
        lastName: '',
        idNo: '',
        gender: undefined,
      })),
      contact: {
        email: '',
        phone: '',
      },
      termsAccepted: false,
    }
  });

  const { fields } = useFieldArray({
    control,
    name: "passengers"
  });

  useEffect(() => {
    if (selectedSeats.length === 0) {
      navigate('/');
    }
  }, [selectedSeats, navigate]);

  const onSubmit = (data: FormValues) => {
    setPassengers(data.passengers as any); 
    setContact(data.contact);
    navigate('/checkout');
  };

  if (selectedSeats.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('passengerInfo')}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{t('fillDetails')}</p>
        </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
            {/* Passenger Cards */}
            {fields.map((field, index) => (
            <div key={field.id} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group transition-colors">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-500 dark:bg-blue-600"></div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        {t('passenger')} <span className="text-gray-400 dark:text-gray-500 font-normal text-sm ml-2">{t('seat')} {field.seat}</span>
                    </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="hidden" {...register(`passengers.${index}.seat`, { valueAsNumber: true })} />
                
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('firstName')}</label>
                    <input 
                    {...register(`passengers.${index}.firstName`)}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition text-gray-900 dark:text-gray-100"
                    placeholder={t('placeholderFirstName')}
                    />
                    {errors.passengers?.[index]?.firstName && <p className="text-red-500 dark:text-red-400 text-xs">{errors.passengers[index]?.firstName?.message}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('lastName')}</label>
                    <input 
                    {...register(`passengers.${index}.lastName`)}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition text-gray-900 dark:text-gray-100"
                    placeholder={t('placeholderLastName')}
                    />
                    {errors.passengers?.[index]?.lastName && <p className="text-red-500 dark:text-red-400 text-xs">{errors.passengers[index]?.lastName?.message}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('idNumber')}</label>
                    <input 
                    {...register(`passengers.${index}.idNo`)}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition text-gray-900 dark:text-gray-100"
                    placeholder={t('placeholderIdNumber')}
                    />
                    {errors.passengers?.[index]?.idNo && <p className="text-red-500 dark:text-red-400 text-xs">{errors.passengers[index]?.idNo?.message}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('gender')}</label>
                    <div className="relative">
                        <select 
                        {...register(`passengers.${index}.gender`)}
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition appearance-none text-gray-900 dark:text-gray-100"
                        >
                        <option value="">{t('selectGender')}</option>
                        <option value="male">{t('male')}</option>
                        <option value="female">{t('female')}</option>
                        <option value="other">{t('other')}</option>
                        </select>
                        <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400 dark:text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                    {errors.passengers?.[index]?.gender && <p className="text-red-500 dark:text-red-400 text-xs">{errors.passengers[index]?.gender?.message}</p>}
                </div>
                </div>
            </div>
            ))}
        </div>

        <div className="lg:w-96 space-y-6">
            {/* Contact Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24 transition-colors">
                <div className="flex items-center gap-2 mb-6 text-gray-800 dark:text-gray-100">
                    <div className="p-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg">
                        <Mail size={20} />
                    </div>
                    <h3 className="text-xl font-bold">{t('contactDetails')}</h3>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('emailAddress')}</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500 w-4 h-4" />
                        <input 
                            type="email"
                            {...register("contact.email")}
                            className="w-full pl-10 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition text-gray-900 dark:text-gray-100"
                            placeholder={t('placeholderEmail')}
                        />
                    </div>
                    {errors.contact?.email && <p className="text-red-500 dark:text-red-400 text-xs">{errors.contact.email.message}</p>}
                    </div>

                    <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('phoneNumber')}</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500 w-4 h-4" />
                        <input 
                            {...register("contact.phone")}
                            className="w-full pl-10 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition text-gray-900 dark:text-gray-100"
                            placeholder={t('placeholderPhone')}
                        />
                    </div>
                    {errors.contact?.phone && <p className="text-red-500 dark:text-red-400 text-xs">{errors.contact.phone.message}</p>}
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input 
                        type="checkbox" 
                        {...register("termsAccepted")}
                        className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-gray-200 transition">
                        {t('acceptTerms')}
                        </span>
                    </label>
                    {errors.termsAccepted && <p className="text-red-500 dark:text-red-400 text-xs mt-2">{errors.termsAccepted.message}</p>}
                </div>

                <button 
                    type="submit"
                    className="w-full mt-6 bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                    <span>{t('continuePayment')}</span>
                    <CreditCard size={18} />
                </button>
                
                <div className="mt-4 flex justify-center items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                    <Lock size={12} />
                    <span>{t('secureTransaction')}</span>
                </div>
            </div>
        </div>
      </form>
    </div>
  );
};
