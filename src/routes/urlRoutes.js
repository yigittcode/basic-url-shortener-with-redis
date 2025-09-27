import express from 'express';
import { welcome, shortenUrl, redirectUrl, getUrlStats } from '../controllers/urlController.js';

const router = express.Router();

router.get('/', welcome);

// URL shortening endpoint
router.post('/shorten', shortenUrl);

// URL redirection endpoint
router.get('/:shortCode', redirectUrl);

// URL statistics endpoint
router.get('/stats/:shortCode', getUrlStats);

export default router;
