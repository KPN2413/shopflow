import { envSchema } from "./env-schema";

export function configuration() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    // Fail fast with readable errors
    // eslint-disable-next-line no-console
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Environment validation failed");
  }

  const env = parsed.data;

  return {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,

    db: {
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      name: env.DB_NAME,
    },

    redis: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD ?? "",
    },
  };
}

export type AppConfig = ReturnType<typeof configuration>;
