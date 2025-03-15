import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config();

// Load the appropriate .env file based on NODE_ENV
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Base schema with common validations
const baseEnvSchema = z.object({
  PORT: z.string().transform(Number).default('5000'),
  MONGODB_URI: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string(),
  ID_ENCRYPTION_KEY: z.string().length(32),
  CORS_ORIGIN: z.string(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']),
});

// Development/Test specific schema
const nonProductionSchema = baseEnvSchema.extend({
  NODE_ENV: z.enum(['development', 'test']),
  MONGODB_URI: z.string().url().default('mongodb://localhost:27017/playground_dev'),
  JWT_SECRET: z.string().min(32).default('development-jwt-secret-at-least-32-chars!!'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('debug'),
});

// Production specific schema
const productionSchema = baseEnvSchema.extend({
  NODE_ENV: z.literal('production'),
  MONGODB_URI: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  LOG_LEVEL: z.enum(['error', 'warn', 'info']).default('info'),
}).strict(); // No unknown fields allowed in production

// Combined schema with environment-specific validation
const envSchema = z.discriminatedUnion('NODE_ENV', [
  nonProductionSchema,
  productionSchema,
]);

// Parse and validate environment variables
const env = envSchema.parse(process.env);

// Derived configuration
const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  mongoUri: env.MONGODB_URI,
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
  googleClientId: env.GOOGLE_CLIENT_ID,
  googleClientSecret: env.GOOGLE_CLIENT_SECRET,
  idEncryptionKey: env.ID_ENCRYPTION_KEY,
  corsOrigin: env.CORS_ORIGIN.split(','),
  logLevel: env.LOG_LEVEL,
  isDevelopment: env.NODE_ENV === 'development',
  isTest: env.NODE_ENV === 'test',
  isProduction: env.NODE_ENV === 'production',
} as const;

// Type for the config object
type Config = typeof config;

// Export both the config object and its type
export { config as default, type Config }; 