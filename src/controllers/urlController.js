import { createShortUrl, getOriginalUrl, incrementClicks, getUrlStats as getUrlStatsService } from '../services/urlService.js';

/**
 * Handle URL shortening request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const shortenUrl = async (req, res) => {
    try {
        // Get long URL and optional TTL from request body
        const { longUrl, ttl } = req.body;

        if (!longUrl) {
            return res.status(400).json({ error: 'longUrl is required.' });
        }

        const result = await createShortUrl(longUrl, ttl);
        
        if (result.isExisting) {
            res.status(200).json({ 
                ...result, 
                message: 'URL already shortened' 
            });
        } else {
            res.status(201).json(result);
        }

    } catch (error) {
        console.error('Error shortening URL:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Handle URL redirection request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const redirectUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;

        // Find the long URL corresponding to this code in Redis
        const longUrl = await getOriginalUrl(shortCode);

        if (longUrl) {
            // Atomically increment click counter by 1
            await incrementClicks(shortCode);
            // Redirect user to that address
            res.redirect(longUrl);
        } else {
            // If URL not found (or expired), return 404 error
            res.status(404).send('URL not found or expired');
        }
    } catch (error) {
        console.error('Redirection error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Handle URL statistics request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUrlStats = async (req, res) => {
    try {
        const { shortCode } = req.params;

        const stats = await getUrlStatsService(shortCode);

        if (!stats) {
            return res.status(404).send('URL not found');
        }

        // Return response in JSON format
        res.status(200).json(stats);
    } catch (error) {
        console.error('Error getting statistics:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Handle welcome page request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const welcome = (req, res) => {
    res.send('URL Shortening Service is Running! 🚀');
};
