import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 py-12 mt-auto transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">netBus</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">
              {t('footerTagline')}
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">{t('contact')}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+905316726030" className="hover:text-white transition">+90 531 672 60 30</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:arcaglar@gmail.com" className="hover:text-white transition">arcaglar@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Istanbul, Turkey</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 dark:border-gray-900 pt-8 text-center text-sm text-gray-500 dark:text-gray-600">
          &copy; {new Date().getFullYear()} netBus Inc. {t('allRightsReserved')}.
        </div>
      </div>
    </footer>
  );
};
