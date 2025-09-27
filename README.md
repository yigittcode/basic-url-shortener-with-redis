# URL Shortener Service

A modular URL shortener service built with Express.js and Redis.

## Features

- Create short URLs from long URLs
- URL redirection with click tracking
- URL statistics (click count)
- TTL (Time To Live) support for URLs
- Modular architecture for better maintainability

## Project Structure

```
src/
├── config/
│   ├── app.js          # Application configuration
│   └── database.js     # Redis database configuration
├── controllers/
│   └── urlController.js # HTTP request handlers
├── services/
│   └── urlService.js   # Business logic for URL operations
├── routes/
│   └── urlRoutes.js    # Express route definitions
├── utils/
│   └── base62.js       # Base62 encoding utilities
└── app.js              # Express application setup
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env` file

4. Make sure Redis is running on your system

5. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### POST /shorten
Create a short URL from a long URL.

**Request Body:**
```json
{
  "longUrl": "https://example.com/very-long-url",
  "ttl": 3600  // Optional: Time to live in seconds
}
```

**Response:**
```json
{
  "shortUrl": "http://localhost:3000/abc123"
}
```

### GET /:shortCode
Redirect to the original URL and track clicks.

### GET /stats/:shortCode
Get statistics for a short URL.

**Response:**
```json
{
  "longUrl": "https://example.com/very-long-url",
  "clicks": 42
}
```

## Configuration

Environment variables (`.env` file):
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `BASE_URL`: Base URL for short links (default: http://localhost:3000)
- `REDIS_HOST`: Redis server host (default: localhost)
- `REDIS_PORT`: Redis server port (default: 6379)
- `REDIS_PASSWORD`: Redis password (optional)
- `REDIS_URL`: Complete Redis URL (alternative to individual settings)

## Architecture

The application follows a modular architecture:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and data operations
- **Config**: Application and database configuration
- **Utils**: Utility functions (Base62 encoding)
- **Routes**: Express route definitions

