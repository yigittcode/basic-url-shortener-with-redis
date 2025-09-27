import databaseConfig from '../config/database.js';
import { toBase62 } from '../utils/base62.js';
import { config } from '../config/app.js';

/**
 * URL service for handling URL shortening operations
 */
class UrlService {
    constructor() {
        this.redis = databaseConfig.getClient();
    }

    /**
     * Create a shortened URL
     * @param {string} longUrl - The original URL to shorten
     * @param {number} ttl - Time to live in seconds (optional)
     * @returns {Promise<Object>} - Object containing shortUrl
     */
    async createShortUrl(longUrl, ttl = null) {
        try {
            // Check if URL already exists
            const existingCode = await this.getShortCodeByUrl(longUrl);
            if (existingCode) {
                const shortUrl = `${config.BASE_URL}/${existingCode}`;
                return { shortUrl, isExisting: true };
            }

            // Generate unique ID
            const urlId = await this.redis.incr(config.REDIS_KEYS.GLOBAL_NEXT_URL_ID);
            // Convert ID to short code
            const shortCode = toBase62(urlId);

            const key = `${config.REDIS_KEYS.SHORT_URL_PREFIX}${shortCode}`;
            const urlKey = `url:${longUrl}`;

            // Use Redis transaction to ensure atomicity
            const multi = this.redis.multi();
            
            if (ttl) {
                // If ttl exists, add EX (seconds) option to SET command
                multi.set(key, longUrl, { EX: parseInt(ttl, 10) });
                multi.set(urlKey, shortCode, { EX: parseInt(ttl, 10) });
            } else {
                // If no ttl, save permanently
                multi.set(key, longUrl);
                multi.set(urlKey, shortCode);
            }
            
            await multi.exec();

            const shortUrl = `${config.BASE_URL}/${shortCode}`;
            return { shortUrl, isExisting: false };
        } catch (error) {
            console.error('Error creating short URL:', error);
            throw error;
        }
    }

    /**
     * Get short code for existing URL
     * @param {string} longUrl - The original URL
     * @returns {Promise<string|null>} - Short code or null if not found
     */
    async getShortCodeByUrl(longUrl) {
        try {
            const urlKey = `url:${longUrl}`;
            return await this.redis.get(urlKey);
        } catch (error) {
            console.error('Error getting short code by URL:', error);
            return null;
        }
    }

    /**
     * Get original URL from short code
     * @param {string} shortCode - The short code to resolve
     * @returns {Promise<string|null>} - Original URL or null if not found
     */
    async getOriginalUrl(shortCode) {
        try {
            const key = `${config.REDIS_KEYS.SHORT_URL_PREFIX}${shortCode}`;
            return await this.redis.get(key);
        } catch (error) {
            console.error('Error getting original URL:', error);
            throw error;
        }
    }

    /**
     * Increment click count for a short code
     * @param {string} shortCode - The short code to increment clicks for
     * @returns {Promise<number>} - New click count
     */
    async incrementClicks(shortCode) {
        try {
            const key = `${config.REDIS_KEYS.CLICKS_PREFIX}${shortCode}`;
            return await this.redis.incr(key);
        } catch (error) {
            console.error('Error incrementing clicks:', error);
            throw error;
        }
    }

    /**
     * Get URL statistics (original URL and click count)
     * @param {string} shortCode - The short code to get stats for
     * @returns {Promise<Object|null>} - Stats object or null if not found
     */
    async getUrlStats(shortCode) {
        try {
            const [longUrl, clicks] = await this.redis.mGet([
                `${config.REDIS_KEYS.SHORT_URL_PREFIX}${shortCode}`,
                `${config.REDIS_KEYS.CLICKS_PREFIX}${shortCode}`
            ]);

            if (!longUrl) {
                return null;
            }

            return {
                longUrl,
                clicks: clicks || 0 // If never clicked, clicks can be null, show as 0
            };
        } catch (error) {
            console.error('Error getting URL stats:', error);
            throw error;
        }
    }
}

export default new UrlService();
