import urlService from '../services/urlService.js';

/**
 * URL controller for handling HTTP requests
 */
class UrlController {
    /**
     * Handle URL shortening request
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async shortenUrl(req, res) {
        try {
            // Get long URL and optional TTL from request body
            const { longUrl, ttl } = req.body;

            if (!longUrl) {
                return res.status(400).json({ error: 'longUrl is required.' });
            }

            const result = await urlService.createShortUrl(longUrl, ttl);
            res.status(200).json(result);

        } catch (error) {
            console.error('Error shortening URL:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    /**
     * Handle URL redirection request
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async redirectUrl(req, res) {
        try {
            const { shortCode } = req.params;

            // Find the long URL corresponding to this code in Redis
            const longUrl = await urlService.getOriginalUrl(shortCode);

            if (longUrl) {
                // Atomically increment click counter by 1
                await urlService.incrementClicks(shortCode);
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
    }

    /**
     * Handle URL statistics request
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getUrlStats(req, res) {
        try {
            const { shortCode } = req.params;

            const stats = await urlService.getUrlStats(shortCode);

            if (!stats) {
                return res.status(404).send('URL not found');
            }

            // Return response in JSON format
            res.status(200).json(stats);
        } catch (error) {
            console.error('Error getting statistics:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    /**
     * Handle welcome page request
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    welcome(req, res) {
        res.send('URL Shortening Service is Running! 🚀');
    }
}

export default new UrlController();
