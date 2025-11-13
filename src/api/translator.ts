import { apiFetch } from './helpers';

export const AUTO_DETECT = 'AUTO_DETECT';

export interface Language {
  language: string;
  name: string;
  swapsTo?: string; // For targets: which base language they swap to as source
  defaultTarget?: string; // For sources: default target variant when swapped
}

// Source languages (what you can translate FROM)
export const SOURCE_LANGUAGES: Language[] = [
  { language: AUTO_DETECT, name: 'Auto Detect' },
  { language: 'AR', name: 'Arabic (العربية)' },
  { language: 'BG', name: 'Bulgarian (Български)' },
  { language: 'CS', name: 'Czech (Čeština)' },
  { language: 'DA', name: 'Danish (Dansk)' },
  { language: 'DE', name: 'German (Deutsch)' },
  { language: 'EL', name: 'Greek (Ελληνικά)' },
  { language: 'EN', name: 'English', defaultTarget: 'EN-GB' },
  { language: 'ES', name: 'Spanish (Español)' },
  { language: 'ET', name: 'Estonian (Eesti)' },
  { language: 'FI', name: 'Finnish (Suomi)' },
  { language: 'FR', name: 'French (Français)' },
  { language: 'HE', name: 'Hebrew (עברית)' },
  { language: 'HU', name: 'Hungarian (Magyar)' },
  { language: 'ID', name: 'Indonesian (Bahasa Indonesia)' },
  { language: 'IT', name: 'Italian (Italiano)' },
  { language: 'JA', name: 'Japanese (日本語)' },
  { language: 'KO', name: 'Korean (한국어)' },
  { language: 'LT', name: 'Lithuanian (Lietuvių)' },
  { language: 'LV', name: 'Latvian (Latviešu)' },
  { language: 'NB', name: 'Norwegian (Norsk)' },
  { language: 'NL', name: 'Dutch (Nederlands)' },
  { language: 'PL', name: 'Polish (Polski)' },
  { language: 'PT', name: 'Portuguese (Português)', defaultTarget: 'PT-BR' },
  { language: 'RO', name: 'Romanian (Română)' },
  { language: 'RU', name: 'Russian (Русский)' },
  { language: 'SK', name: 'Slovak (Slovenčina)' },
  { language: 'SL', name: 'Slovenian (Slovenščina)' },
  { language: 'SV', name: 'Swedish (Svenska)' },
  { language: 'TH', name: 'Thai (ไทย)' },
  { language: 'TR', name: 'Turkish (Türkçe)' },
  { language: 'UK', name: 'Ukrainian (Українська)' },
  { language: 'VI', name: 'Vietnamese (Tiếng Việt)' },
  { language: 'ZH', name: 'Chinese (中文)', defaultTarget: 'ZH' },
];

// Target languages (what you can translate TO)
export const TARGET_LANGUAGES: Language[] = [
  { language: 'AR', name: 'Arabic (العربية)' },
  { language: 'BG', name: 'Bulgarian (Български)' },
  { language: 'CS', name: 'Czech (Čeština)' },
  { language: 'DA', name: 'Danish (Dansk)' },
  { language: 'DE', name: 'German (Deutsch)' },
  { language: 'EL', name: 'Greek (Ελληνικά)' },
  { language: 'EN-GB', name: 'English (British)', swapsTo: 'EN' },
  { language: 'EN-US', name: 'English (American)', swapsTo: 'EN' },
  { language: 'ES', name: 'Spanish (Español)' },
  { language: 'ES-419', name: 'Spanish (Latinoamérica)', swapsTo: 'ES' },
  { language: 'ET', name: 'Estonian (Eesti)' },
  { language: 'FI', name: 'Finnish (Suomi)' },
  { language: 'FR', name: 'French (Français)' },
  { language: 'HE', name: 'Hebrew (עברית)' },
  { language: 'HU', name: 'Hungarian (Magyar)' },
  { language: 'ID', name: 'Indonesian (Bahasa Indonesia)' },
  { language: 'IT', name: 'Italian (Italiano)' },
  { language: 'JA', name: 'Japanese (日本語)' },
  { language: 'KO', name: 'Korean (한국어)' },
  { language: 'LT', name: 'Lithuanian (Lietuvių)' },
  { language: 'LV', name: 'Latvian (Latviešu)' },
  { language: 'NB', name: 'Norwegian (Norsk)' },
  { language: 'NL', name: 'Dutch (Nederlands)' },
  { language: 'PL', name: 'Polish (Polski)' },
  {
    language: 'PT-BR',
    name: 'Portuguese (Português Brasileiro)',
    swapsTo: 'PT',
  },
  { language: 'PT-PT', name: 'Portuguese (Português Europeu)', swapsTo: 'PT' },
  { language: 'RO', name: 'Romanian (Română)' },
  { language: 'RU', name: 'Russian (Русский)' },
  { language: 'SK', name: 'Slovak (Slovenčina)' },
  { language: 'SL', name: 'Slovenian (Slovenščina)' },
  { language: 'SV', name: 'Swedish (Svenska)' },
  { language: 'TH', name: 'Thai (ไทย)' },
  { language: 'TR', name: 'Turkish (Türkçe)' },
  { language: 'UK', name: 'Ukrainian (Українська)' },
  { language: 'VI', name: 'Vietnamese (Tiếng Việt)' },
  { language: 'ZH', name: 'Chinese (中文)' },
  { language: 'ZH-HANS', name: 'Chinese Simplified (简体中文)', swapsTo: 'ZH' },
  {
    language: 'ZH-HANT',
    name: 'Chinese Traditional (繁體中文)',
    swapsTo: 'ZH',
  },
];

export const requestTranslation = async ({
  sourceLang,
  targetLang,
  text,
  onError,
  onSuccess,
}: {
  sourceLang: string;
  targetLang: string;
  text: string;
  onError: (_error: any) => void;
  onSuccess: (_response: any) => void;
}) => {
  try {
    const body: any = {
      target: targetLang,
      text,
    };

    // Only include source if it's not AUTO_DETECT
    if (sourceLang !== AUTO_DETECT) {
      body.source = sourceLang;
    }

    const result = await apiFetch(`/api/translator/translate/`, {
      method: 'POST',
      useTagsOnly: true,
      body,
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
};
