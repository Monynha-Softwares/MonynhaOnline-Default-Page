export type LanguageCode = "pt" | "en" | "fr" | "es";

export type LanguageFlyweight = Readonly<{
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}>;

const languageDefinitions: Record<LanguageCode, Omit<LanguageFlyweight, "code">> = Object.freeze({
  pt: {
    label: "Portuguese",
    nativeLabel: "Português",
  },
  en: {
    label: "English",
    nativeLabel: "English",
  },
  fr: {
    label: "French",
    nativeLabel: "Français",
  },
  es: {
    label: "Spanish",
    nativeLabel: "Español",
  },
});

const languageCache = new Map<LanguageCode, LanguageFlyweight>();

export const getLanguage = (code: LanguageCode): LanguageFlyweight => {
  const cached = languageCache.get(code);
  if (cached) return cached;
  const definition = languageDefinitions[code];
  const language = Object.freeze({ code, ...definition });
  languageCache.set(code, language);
  return language;
};

const supportedLanguageCodes = Object.freeze(Object.keys(languageDefinitions) as LanguageCode[]);
const supportedLanguages = Object.freeze(
  supportedLanguageCodes.map((code) => getLanguage(code))
);

export const getSupportedLanguageCodes = () => supportedLanguageCodes;
export const getSupportedLanguages = () => supportedLanguages;
