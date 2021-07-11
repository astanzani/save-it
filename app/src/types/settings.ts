import { Locale } from './languages';
import { ThemeVariant } from './themes';

export interface Preferences {
  theme: ThemeVariant;
  language: Locale;
}
