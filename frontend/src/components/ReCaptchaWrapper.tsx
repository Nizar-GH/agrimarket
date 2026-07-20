import React from 'react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export const ReCaptchaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reCaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || 'YOUR_RECAPTCHA_V3_SITE_KEY';
  
  return (
    <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey}>
      {children}
    </GoogleReCaptchaProvider>
  );
};

export const useReCaptcha = () => {
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

  return { getRecaptchaToken };
};
