import express from 'express';
import databaseConfig from './config/database.js';
import urlRoutes from './routes/urlRoutes.js';

/**
 * Express application setup and configuration
 */
class App {
    constructor() {
        this.app = express();
        this.setupMiddleware();
        this.setupRoutes();
    }

    /**
     * Setup Express middleware
     */
    setupMiddleware() {
        // Middleware for Express to read JSON bodies
        this.app.use(express.json());
    }

    /**
     * Setup application routes
     */
    setupRoutes() {
        // Use URL routes
        this.app.use('/', urlRoutes);
    }

    /**
     * Get Express app instance
     * @returns {Object} - Express app
     */
    getApp() {
        return this.app;
    }
}

export default App;
