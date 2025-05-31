'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';

interface IntlProviderProps {
  children: React.ReactNode;
  locale: string;
}

export function IntlProvider({ children, locale }: IntlProviderProps) {
  const [messages, setMessages] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messages = await import(`../locales/${locale}/common.json`);
        setMessages(messages);
      } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`, error);
      }
    };

    loadMessages();
  }, [locale]);

  if (!messages) {
    return null; // Or a loading indicator
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
