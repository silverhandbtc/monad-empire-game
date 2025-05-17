import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_MONAD_CHAIN_ID: z.string(),
  NEXT_PUBLIC_MONAD_RPC_URL: z.string().url(),
  NEXT_PUBLIC_MONAD_EXPLORER_URL: z.string().url(),
  NEXT_PUBLIC_MONAD_CHAIN_NAME: z.string(),
  NEXT_PUBLIC_MONAD_SYMBOL: z.string(),
  NEXT_PUBLIC_MONAD_NAME: z.string(),
  NEXT_PUBLIC_MONAD_DECIMAL: z.coerce.number(),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_MONAD_CHAIN_ID: process.env.NEXT_PUBLIC_MONAD_CHAIN_ID,
  NEXT_PUBLIC_MONAD_RPC_URL: process.env.NEXT_PUBLIC_MONAD_RPC_URL,
  NEXT_PUBLIC_MONAD_EXPLORER_URL: process.env.NEXT_PUBLIC_MONAD_EXPLORER_URL,
  NEXT_PUBLIC_MONAD_CHAIN_NAME: process.env.NEXT_PUBLIC_MONAD_CHAIN_NAME,
  NEXT_PUBLIC_MONAD_SYMBOL: process.env.NEXT_PUBLIC_MONAD_SYMBOL,
  NEXT_PUBLIC_MONAD_NAME: process.env.NEXT_PUBLIC_MONAD_NAME,
  NEXT_PUBLIC_MONAD_DECIMAL: process.env.NEXT_PUBLIC_MONAD_DECIMAL,
});

export type Env = z.infer<typeof envSchema>;

export default env;
