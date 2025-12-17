import dotenv from 'dotenv';
import path from 'path';

// Try standard config
// dotenv.config();

// Explicitly point to .env in root of server
const envPath = path.resolve(__dirname, '..', '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('Dotenv error loading:', envPath, result.error);
} else {
    console.log('Dotenv loaded successfully from:', envPath);
}

import http from 'http';
import app from './app';
import { initSocket } from './socket/socket';


const server = http.createServer(app);
const io = initSocket(server);

export { io };

const PORT = process.env.PORT || 4000;

async function main() {
    try {
        // Supabase client is stateless/http-based, no specific "connect" step needed here
        // unless verification is desired.
        console.log('Backend initialized');

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

main();
