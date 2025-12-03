import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Language = 'en' | 'tr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    home: 'Home',
    myBookings: 'My Bookings',
    help: 'Help',
    contact: 'Contact',
    
    heroTitle: 'Explore the World One Ride at a Time',
    heroSubtitle: 'Book bus tickets instantly with zero booking fees. Safe, reliable, and comfortable travel across 81 cities.',
    safeSecure: 'Safe & Secure',
    safeSecureDesc: 'Verified bus operators and secure payment gateways ensure your safety.',
    onTime: 'On Time',
    onTimeDesc: 'Real-time tracking and punctual departures so you never miss a beat.',
    bestPrices: 'Best Prices',
    bestPricesDesc: 'Compare prices across hundreds of operators and find the best deal.',
    popularDestinations: 'Popular Destinations',
    findTicket: 'Find Your Bus Ticket',
    search: 'Search Tickets',
    from: 'From',
    to: 'To',
    date: 'Date',
    selectDeparture: 'Select Departure',
    selectArrival: 'Select Arrival',
    loadingLocations: 'Loading Locations...',
    whyChoose: 'Why Choose netBus?',
    whyChooseDesc: 'We make your journey comfortable and hassle-free.',
    
    validationDepartureRequired: 'Please select departure location',
    validationArrivalRequired: 'Please select arrival location',
    validationDateRequired: 'Please select travel date',
    validationDatePast: 'Date cannot be in the past',
    validationSameLocation: 'Departure and arrival locations cannot be the same',

    whereTo: 'Where do you want to go?',
    newSearch: 'Start a new search',
    unableToLoad: 'Unable to load schedules. Please try again later.',
    tripsAvailable: 'Trips Available',
    allCompanies: 'All Companies',
    departureTime: 'Departure Time',
    priceLowToHigh: 'Price (Low to High)',
    noTripsFound: 'No trips found for this criteria.',
    clearFilters: 'Clear Filters',
    standardSeat: 'Standard 2+1',
    departure: 'Departure',
    arrival: 'Arrival',
    seatsLeft: 'seats left',
    selectSeats: 'Select Seats',
    
    selectYourSeats: 'Select Your Seats',
    loadingSeatMap: 'Loading seat map...',
    errorSeatMap: 'Error loading seat map.',
    available: 'Available',
    selected: 'Selected',
    occupied: 'Occupied',
    bookingSummary: 'Booking Summary',
    pleaseSelectSeats: 'Please select seats from the map',
    totalAmount: 'Total Amount',
    continue: 'Continue',
    maxSeatsError: 'You can select a maximum of 4 seats.',

    passengerInfo: 'Passenger Information',
    fillDetails: 'Please fill in the details for all passengers.',
    passenger: 'Passenger',
    seat: 'Seat',
    firstName: 'First Name',
    lastName: 'Last Name',
    idNumber: 'ID Number',
    gender: 'Gender',
    selectGender: 'Select Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    contactDetails: 'Contact Details',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    phoneNumber: 'Phone Number',
    acceptTerms: 'I have read and agree to the Terms & Conditions and Privacy Policy.',
    continuePayment: 'Continue to Payment',
    secureTransaction: 'Secure SSL Encrypted Transaction',
    
    validationFirstNameRequired: 'First name is required',
    validationFirstNameMin: 'First name must be at least 2 characters',
    validationLastNameRequired: 'Last name is required',
    validationLastNameMin: 'Last name must be at least 2 characters',
    validationIdRequired: 'Valid ID is required',
    validationIdMin: 'ID must be at least 7 characters',
    validationGenderRequired: 'Please select gender',
    validationFullNameRequired: 'Full name is required',
    validationFullNameMin: 'Full name must be at least 2 characters',
    validationEmailRequired: 'Email is required',
    validationEmailInvalid: 'Invalid email address',
    validationPhoneRequired: 'Phone number is required',
    validationPhoneMin: 'Valid phone number required (min 10 digits)',
    validationTermsRequired: 'You must accept the terms and privacy policy',
    
    placeholderFirstName: 'John',
    placeholderLastName: 'Doe',
    placeholderIdNumber: '11-digit ID',
    placeholderFullName: 'Contact Person',
    placeholderEmail: 'name@example.com',
    placeholderPhone: '+90 555 000 0000',

    confirmBooking: 'Confirm Your Booking',
    reviewDetails: 'Please review your details before proceeding to payment.',
    tripInfo: 'Trip Information',
    operator: 'Operator',
    today: 'Today',
    direct: 'Direct',
    passengers: 'Passengers',
    paymentSummary: 'Payment Summary',
    baseFare: 'Base Fare',
    discount: 'Discount',
    serviceFee: 'Service Fee',
    paySecurely: 'Pay Securely',
    paymentFailed: 'Payment failed. Please try again.',
    paymentsSecure: 'Payments are processed securely',

    bookingConfirmed: 'Booking Confirmed!',
    successMessage: 'Your ticket has been successfully booked and emailed to you.',
    pnrCode: 'PNR Code',
    route: 'Route',
    printTicket: 'Print Ticket',
    downloadPdf: 'Download PDF',
    share: 'Share',
    backToHome: 'Back to Home',
    
    footerTagline: 'The easiest way to book bus tickets online. Comfortable, safe, and affordable travel across the country.',
    quickLinks: 'Quick Links',
    aboutUs: 'About Us',
    termsConditions: 'Terms & Conditions',
    privacyPolicy: 'Privacy Policy',
    careers: 'Careers',
    support: 'Support',
    helpCenter: 'Help Center',
    cancelBooking: 'Cancel Booking',
    refundStatus: 'Refund Status',
    contactUs: 'Contact Us',
    allRightsReserved: 'All rights reserved',
  },
  tr: {
    home: 'Ana Sayfa',
    myBookings: 'Biletlerim',
    help: 'Yardım',
    contact: 'İletişim',

    heroTitle: 'Dünyayı Keşfet, Tek Seferde Bir Yolculuk',
    heroSubtitle: 'Sıfır komisyon ile anında otobüs bileti alın. 81 ilde güvenli, güvenilir ve konforlu seyahat.',
    safeSecure: 'Güvenli & Emniyetli',
    safeSecureDesc: 'Onaylanmış otobüs firmaları ve güvenli ödeme altyapısı ile güvenliğiniz garanti altında.',
    onTime: 'Zamanında',
    onTimeDesc: 'Gerçek zamanlı takip ve dakik kalkışlar ile hiçbir şeyi kaçırmayın.',
    bestPrices: 'En İyi Fiyatlar',
    bestPricesDesc: 'Yüzlerce firma arasından fiyatları karşılaştırın ve en uygun bileti bulun.',
    popularDestinations: 'Popüler Destinasyonlar',
    findTicket: 'Otobüs Biletini Bul',
    search: 'Bilet Ara',
    from: 'Nereden',
    to: 'Nereye',
    date: 'Tarih',
    selectDeparture: 'Kalkış Yeri Seçin',
    selectArrival: 'Varış Yeri Seçin',
    loadingLocations: 'Lokasyonlar Yükleniyor...',
    whyChoose: 'Neden netBus?',
    whyChooseDesc: 'Yolculuğunuzu konforlu ve sorunsuz hale getiriyoruz.',
    
    validationDepartureRequired: 'Lütfen kalkış yeri seçin',
    validationArrivalRequired: 'Lütfen varış yeri seçin',
    validationDateRequired: 'Lütfen seyahat tarihi seçin',
    validationDatePast: 'Tarih geçmişte olamaz',
    validationSameLocation: 'Kalkış ve varış yerleri aynı olamaz',

    whereTo: 'Nereye gitmek istersiniz?',
    newSearch: 'Yeni arama başlat',
    unableToLoad: 'Seferler yüklenemedi. Lütfen daha sonra tekrar deneyin.',
    tripsAvailable: 'Sefer Bulundu',
    allCompanies: 'Tüm Firmalar',
    departureTime: 'Kalkış Saati',
    priceLowToHigh: 'Fiyat (Artan)',
    noTripsFound: 'Bu kriterlere uygun sefer bulunamadı.',
    clearFilters: 'Filtreleri Temizle',
    standardSeat: 'Standart 2+1',
    departure: 'Kalkış',
    arrival: 'Varış',
    seatsLeft: 'koltuk kaldı',
    selectSeats: 'Koltuk Seç',
    
    selectYourSeats: 'Koltuklarınızı Seçin',
    loadingSeatMap: 'Koltuk haritası yükleniyor...',
    errorSeatMap: 'Koltuk haritası yüklenirken hata oluştu.',
    available: 'Müsait',
    selected: 'Seçili',
    occupied: 'Dolu',
    bookingSummary: 'Rezervasyon Özeti',
    pleaseSelectSeats: 'Lütfen haritadan koltuk seçin',
    totalAmount: 'Toplam Tutar',
    continue: 'Devam Et',
    maxSeatsError: 'En fazla 4 koltuk seçebilirsiniz.',

    passengerInfo: 'Yolcu Bilgileri',
    fillDetails: 'Lütfen tüm yolcular için bilgileri doldurun.',
    passenger: 'Yolcu',
    seat: 'Koltuk',
    firstName: 'Ad',
    lastName: 'Soyad',
    idNumber: 'TC Kimlik No',
    gender: 'Cinsiyet',
    selectGender: 'Cinsiyet Seçin',
    male: 'Erkek',
    female: 'Kadın',
    other: 'Diğer',
    contactDetails: 'İletişim Bilgileri',
    fullName: 'Ad Soyad',
    emailAddress: 'E-posta Adresi',
    phoneNumber: 'Telefon Numarası',
    acceptTerms: 'Şartlar & Koşullar ve Gizlilik Politikasını okudum ve kabul ediyorum.',
    continuePayment: 'Ödemeye Geç',
    secureTransaction: 'Güvenli SSL Şifreli İşlem',
    
    validationFirstNameRequired: 'Ad gereklidir',
    validationFirstNameMin: 'Ad en az 2 karakter olmalıdır',
    validationLastNameRequired: 'Soyad gereklidir',
    validationLastNameMin: 'Soyad en az 2 karakter olmalıdır',
    validationIdRequired: 'Geçerli kimlik numarası gereklidir',
    validationIdMin: 'Kimlik numarası en az 7 karakter olmalıdır',
    validationGenderRequired: 'Lütfen cinsiyet seçin',
    validationFullNameRequired: 'Ad soyad gereklidir',
    validationFullNameMin: 'Ad soyad en az 2 karakter olmalıdır',
    validationEmailRequired: 'E-posta gereklidir',
    validationEmailInvalid: 'Geçersiz e-posta adresi',
    validationPhoneRequired: 'Telefon numarası gereklidir',
    validationPhoneMin: 'Geçerli telefon numarası gereklidir (en az 10 hane)',
    validationTermsRequired: 'Şartları ve gizlilik politikasını kabul etmelisiniz',
    
    placeholderFirstName: 'Ahmet',
    placeholderLastName: 'Yılmaz',
    placeholderIdNumber: '11 haneli TC Kimlik',
    placeholderFullName: 'İletişim Kişisi',
    placeholderEmail: 'isim@ornek.com',
    placeholderPhone: '+90 555 000 0000',

    confirmBooking: 'Rezervasyonu Onayla',
    reviewDetails: 'Lütfen ödemeye geçmeden önce bilgilerinizi kontrol edin.',
    tripInfo: 'Sefer Bilgileri',
    operator: 'Firma',
    today: 'Bugün',
    direct: 'Direkt',
    passengers: 'Yolcular',
    paymentSummary: 'Ödeme Özeti',
    baseFare: 'Taban Fiyat',
    discount: 'İndirim',
    serviceFee: 'Hizmet Bedeli',
    paySecurely: 'Güvenli Öde',
    paymentFailed: 'Ödeme başarısız. Lütfen tekrar deneyin.',
    paymentsSecure: 'Ödemeler güvenli bir şekilde işlenir',

    bookingConfirmed: 'Rezervasyon Onaylandı!',
    successMessage: 'Biletiniz başarıyla oluşturuldu ve e-posta adresinize gönderildi.',
    pnrCode: 'PNR Kodu',
    route: 'Güzergah',
    printTicket: 'Bileti Yazdır',
    downloadPdf: 'PDF İndir',
    share: 'Paylaş',
    backToHome: 'Ana Sayfaya Dön',
    
    footerTagline: 'Online otobüs bileti almanın en kolay yolu. Ülke genelinde konforlu, güvenli ve uygun fiyatlı seyahat.',
    quickLinks: 'Hızlı Bağlantılar',
    aboutUs: 'Hakkımızda',
    termsConditions: 'Şartlar & Koşullar',
    privacyPolicy: 'Gizlilik Politikası',
    careers: 'Kariyer',
    support: 'Destek',
    helpCenter: 'Yardım Merkezi',
    cancelBooking: 'Rezervasyon İptali',
    refundStatus: 'İade Durumu',
    contactUs: 'Bize Ulaşın',
    allRightsReserved: 'Tüm hakları saklıdır',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    if (saved === 'en' || saved === 'tr') return saved;
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
