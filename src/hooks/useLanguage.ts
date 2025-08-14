import { useState, useEffect } from 'react';
import { translations, Language, TranslationKey } from '@/i18n/translations';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('monynha-language');
    return (saved as Language) || 'pt';
  });

  useEffect(() => {
    localStorage.setItem('monynha-language', currentLanguage);
  }, [currentLanguage]);

  const t = (key: TranslationKey): string => {
    return translations[currentLanguage][key] || translations.en[key] || key;
  };

  const changeLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  return {
    currentLanguage,
    changeLanguage,
    t,
    languages: Object.keys(translations) as Language[]
  };
};