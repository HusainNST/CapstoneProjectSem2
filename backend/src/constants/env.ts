const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} not found`);
  }

  return value;
};

const getEnvNumber = (key: string, defaultValue?: string): number => {
  const value = getEnv(key, defaultValue);
  const numberValue = parseInt(value, 10);
  if (isNaN(numberValue)) {
    throw new Error(`Environment variable ${key} must be a number`);
  }
  return numberValue;
};

export const NODE_ENV = getEnv("NODE_ENV", "development");
export const PORT = getEnvNumber("PORT", "8080");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const FRONTEND_URL = getEnv("FRONTEND_URL");
