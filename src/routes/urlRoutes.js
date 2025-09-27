import express from 'express';
import urlController from '../controllers/urlController.js';

const router = express.Router();

router.get('/', urlController.welcome);

// URL shortening endpoint
router.post('/shorten', urlController.shortenUrl.bind(urlController));

// URL redirection endpoint
router.get('/:shortCode', urlController.redirectUrl.bind(urlController));

// URL statistics endpoint
router.get('/stats/:shortCode', urlController.getUrlStats.bind(urlController));

export default router;
