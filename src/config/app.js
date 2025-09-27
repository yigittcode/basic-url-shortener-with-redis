import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Application configuration constants
 */
export const config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    REDIS: {
        HOST: process.env.REDIS_HOST || 'localhost',
        PORT: process.env.REDIS_PORT || 6379,
        PASSWORD: process.env.REDIS_PASSWORD || '',
        URL: process.env.REDIS_URL || null
    },
    REDIS_KEYS: {
        GLOBAL_NEXT_URL_ID: 'global:next_url_id',
        SHORT_URL_PREFIX: 'short:',
        CLICKS_PREFIX: 'clicks:'
    }
};
