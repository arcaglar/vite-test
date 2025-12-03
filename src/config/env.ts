interface EnvConfig {
  apiBaseUrl: string;
  env: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const getEnvVar = (key: string, defaultValue: string = ''): string => {
  const value = import.meta.env[key];
  if (value === undefined) {
    console.warn(`Environment variable ${key} is not defined. Using default: ${defaultValue}`);
    return defaultValue;
  }
  return value;
};

export const env: EnvConfig = {
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', '/api'),
  env: getEnvVar('VITE_ENV', import.meta.env.MODE),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

if (env.isDevelopment) {
  console.log('🔧 Environment Configuration:', {
    apiBaseUrl: env.apiBaseUrl,
    env: env.env,
    mode: import.meta.env.MODE,
  });
}

export default env;
