import App from './src/app.js';
import databaseConfig from './src/config/database.js';
import { config } from './src/config/app.js';

/**
 * Main server startup function
 */
const startServer = async () => {
    try {
        // Connect to Redis
        await databaseConfig.connect();
        
        // Create Express app
        const app = new App();
        const expressApp = app.getApp();

        // Start server
        expressApp.listen(config.PORT, () => {
            console.log(`✅ Server running at http://localhost:${config.PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();