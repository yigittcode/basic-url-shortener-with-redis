import { createClient } from 'redis';
import { config } from './app.js';

/**
 * Redis client configuration and connection management
 */
class DatabaseConfig {
    constructor() {
        // Use Redis URL if provided, otherwise use individual settings
        const redisConfig = config.REDIS.URL || {
            socket: {
                host: config.REDIS.HOST,
                port: config.REDIS.PORT
            },
            password: config.REDIS.PASSWORD || undefined
        };

        this.client = createClient(redisConfig);
        this.setupErrorHandling();
    }

    /**
     * Setup Redis error handling
     */
    setupErrorHandling() {
        this.client.on('error', (err) => console.log('Redis Client Error', err));
    }

    /**
     * Connect to Redis server
     */
    async connect() {
        await this.client.connect();
        console.log('✅ Successfully connected to Redis server.');
    }

    /**
     * Get Redis client instance
     * @returns {Object} - Redis client
     */
    getClient() {
        return this.client;
    }
}

// Export singleton instance
export default new DatabaseConfig();
