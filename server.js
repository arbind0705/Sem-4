import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const startPort = 5000;
const maxPort = 5010; // Try ports up to 5010

// Configure CORS to allow all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Accept']
}));

app.use(express.json());

// Endpoint to process travel plan
app.post('/process-travel-plan', (req, res) => {
    try {
        console.log('Received request to /process-travel-plan');
        console.log('Request body:', req.body);

        // Get the path to the C++ executable
        const cppExecutable = path.join(__dirname, 'src', 'backend', 'c++', 'travelplanner.exe');
        console.log('C++ executable path:', cppExecutable);
        
        // Check if executable exists
        if (!fs.existsSync(cppExecutable)) {
            console.error('C++ executable not found at:', cppExecutable);
            res.status(500).json({ error: 'C++ executable not found. Please compile the C++ file first.' });
            return;
        }

        // Spawn the C++ process
        const cppProcess = spawn(cppExecutable);
        
        let outputData = '';
        let errorData = '';

        // Handle stdout
        cppProcess.stdout.on('data', (data) => {
            outputData += data.toString();
            console.log('C++ stdout:', data.toString());
        });

        // Handle stderr
        cppProcess.stderr.on('data', (data) => {
            errorData += data.toString();
            console.error('C++ stderr:', data.toString());
        });

        // Handle process completion
        cppProcess.on('close', (code) => {
            console.log(`C++ process exited with code ${code}`);
            if (code !== 0) {
                console.error('Error:', errorData);
                res.status(500).json({ error: 'Error processing travel plan' });
                return;
            }

            try {
                // Parse the output as JSON
                const result = JSON.parse(outputData);
                console.log('Parsed result:', result);
                res.json(result);
            } catch (error) {
                console.error('Error parsing C++ output:', error);
                res.status(500).json({ error: 'Error parsing results' });
            }
        });

        // Send input data to C++ process
        const inputString = JSON.stringify(req.body);
        console.log('Sending to C++ process:', inputString);
        cppProcess.stdin.write(inputString);
        cppProcess.stdin.end();

    } catch (error) {
        console.error('Error in /process-travel-plan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Function to try starting the server on a specific port
const startServer = (port) => {
    return new Promise((resolve, reject) => {
        const server = app.listen(port)
            .on('listening', () => {
                console.log(`Server running on http://localhost:${port}`);
                // Broadcast the port number to the frontend
                console.log(`PORT:${port}`);
                resolve(server);
            })
            .on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`Port ${port} is busy, trying next port...`);
                    reject(err);
                } else {
                    console.error('Server error:', err);
                    reject(err);
                }
            });
    });
};

// Try to start the server on available ports
const tryStartServer = async () => {
    for (let port = startPort; port <= maxPort; port++) {
        try {
            await startServer(port);
            break; // If successful, break the loop
        } catch (err) {
            if (port === maxPort) {
                console.error(`Could not find an available port between ${startPort} and ${maxPort}`);
                process.exit(1);
            }
        }
    }
};

tryStartServer(); 