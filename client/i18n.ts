import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // Default to English locale
  const locale = 'en';

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
}); 