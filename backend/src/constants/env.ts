import dotenv from "dotenv";

dotenv.config();

const getEnv = (value: string, required: boolean = false) => {
  if (required && !process.env[value]) {
    throw new Error(`Environment variable ${value} is not defined`);
  }
  return process.env[value];
};

export const PORT = getEnv("PORT") || 5261;
export const FRONTEND = getEnv("FRONTEND", true);
