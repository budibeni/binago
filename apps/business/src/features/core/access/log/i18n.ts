import { dictionaries } from '@/i18n';
import { Locale } from '@adatrack/types';

export function getLogTranslation(locale: Locale) {
  return dictionaries[locale].log;
}
