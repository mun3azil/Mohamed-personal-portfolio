'use client';

import { ThemeProvider } from './ThemeProvider';
import { IntlProvider } from './IntlProvider';
import { useState } from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [locale, setLocale] = useState<string>('en');

  return (
    <ThemeProvider>
      <IntlProvider locale={locale}>
        <LocaleContext.Provider value={{ locale, setLocale }}>
          {children}
        </LocaleContext.Provider>
      </IntlProvider>
    </ThemeProvider>
  );
}

// Create a context for locale management
import { createContext, useContext } from 'react';

interface LocaleContextType {
  locale: string;
  setLocale: (locale: string) => void;
}

export const LocaleContext = createContext<LocaleContextType>({
  locale: 'en',
  setLocale: () => {},
});

export const useLocale = () => useContext(LocaleContext);
