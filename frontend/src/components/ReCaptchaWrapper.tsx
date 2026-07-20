import React, { createContext, useContext } from 'react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

type ReCaptchaContextValue = {
  getRecaptchaToken: (action?: string) => Promise<string | null>;
};

const ReCaptchaContext = createContext<ReCaptchaContextValue>({
  getRecaptchaToken: async () => null,
});

const DevRecaptchaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getRecaptchaToken = async (): Promise<string | null> => {
    console.warn('reCAPTCHA non configuré localement : utilisation d\'un jeton de développement.');
    return 'dev-recaptcha-token';
  };

  return (
    <ReCaptchaContext.Provider value={{ getRecaptchaToken }}>
      {children}
    </ReCaptchaContext.Provider>
  );
};

const RealReCaptchaProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getRecaptchaToken = async (action: string = 'submit'): Promise<string | null> => {
    if (!executeRecaptcha) {
      console.error('reCAPTCHA non disponible');
      return null;
    }

    try {
      const token = await executeRecaptcha(action);
      return token;
    } catch (error) {
      console.error('Erreur lors de l\'exécution de reCAPTCHA:', error);
      return null;
    }
  };

  return (
    <ReCaptchaContext.Provider value={{ getRecaptchaToken }}>
      {children}
    </ReCaptchaContext.Provider>
  );
};

export const ReCaptchaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reCaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const isDevelopment = import.meta.env.DEV === true;
  const hasRealKey = Boolean(reCaptchaKey && reCaptchaKey !== 'YOUR_RECAPTCHA_V3_SITE_KEY');

  if (!hasRealKey) {
    if (isDevelopment) {
      return <DevRecaptchaProvider>{children}</DevRecaptchaProvider>;
    }

    console.error('reCAPTCHA site key missing in production. La validation ne peut pas fonctionner.');
    return (
      <ReCaptchaContext.Provider value={{ getRecaptchaToken: async () => null }}>
        {children}
      </ReCaptchaContext.Provider>
    );
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey}>
      <RealReCaptchaProviderInner>{children}</RealReCaptchaProviderInner>
    </GoogleReCaptchaProvider>
  );
};

export const useReCaptcha = () => useContext(ReCaptchaContext);
