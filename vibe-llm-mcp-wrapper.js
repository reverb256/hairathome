#!/usr/bin/env node
// HTTP MCP wrapper for vibe-llm with proper Pydantic-style validation
const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors'); // Add CORS support for cross-origin requests

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Simple Pydantic-style validation helper
function validatePayload(payload, requiredFields = []) {
    for (const field of requiredFields) {
        if (!(field in payload)) {
            return { valid: false, error: `Missing required field: ${field}` };
        }
    }
    return { valid: true };
}

// Claude-flow MCP HTTP wrapper
app.post('/claude-flow-mcp', (req, res) => {
    console.log('Received Claude-flow MCP request:', req.body);
    
    // Validate input
    const validation = validatePayload(req.body, ['method', 'params']);
    if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
    }

    // Spawn claude-flow as MCP server
    const claudeProcess = spawn('npx', ['claude-flow@alpha', 'mcp', 'start'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env }
    });

    let response = '';
    let errorResponse = '';

    // Handle stdout
    claudeProcess.stdout.on('data', (data) => {
        response += data.toString();
    });

    // Handle stderr
    claudeProcess.stderr.on('data', (data) => {
        errorResponse += data.toString();
    });

    // Handle process close
    claudeProcess.on('close', (code) => {
        if (code === 0) {
            res.json({ 
                result: response || 'Claude-flow MCP executed successfully',
                status: 'success'
            });
        } else {
            res.status(500).json({ 
                error: errorResponse || `Claude-flow MCP failed with code ${code}`,
                status: 'error'
            });
        }
    });

    // Send the request to claude-flow process
    claudeProcess.stdin.write(JSON.stringify(req.body) + '\n');
    claudeProcess.stdin.end();
});

// Flow-nexus MCP HTTP wrapper
app.post('/flow-nexus-mcp', (req, res) => {
    console.log('Received Flow-nexus MCP request:', req.body);
    
    // Validate input
    const validation = validatePayload(req.body, ['method', 'params']);
    if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
    }

    // Spawn flow-nexus as MCP server
    const flowProcess = spawn('npx', ['flow-nexus@latest', 'mcp', 'start'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env }
    });

    let response = '';
    let errorResponse = '';

    // Handle stdout
    flowProcess.stdout.on('data', (data) => {
        response += data.toString();
    });

    // Handle stderr
    flowProcess.stderr.on('data', (data) => {
        errorResponse += data.toString();
    });

    // Handle process close
    flowProcess.on('close', (code) => {
        if (code === 0) {
            res.json({ 
                result: response || 'Flow-nexus MCP executed successfully',
                status: 'success'
            });
        } else {
            res.status(500).json({ 
                error: errorResponse || `Flow-nexus MCP failed with code ${code}`,
                status: 'error'
            });
        }
    });

    // Send the request to flow-nexus process
    flowProcess.stdin.write(JSON.stringify(req.body) + '\n');
    flowProcess.stdin.end();
});

// Vibe-llm proxy
app.post('/vibe-llm-proxy', (req, res) => {
    console.log('Received Vibe-LLM proxy request:', req.body);
    
    // Forward to actual vibe-llm service
    const http = require('http');
    const options = {
        hostname: 'localhost',
        port: 8000,
        path: req.url,
        method: req.method,
        headers: req.headers
    };

    const vibeReq = http.request(options, (vibeRes) => {
        let data = '';
        vibeRes.on('data', (chunk) => {
            data += chunk;
        });
        vibeRes.on('end', () => {
            res.status(vibeRes.statusCode).send(data);
        });
    });

    vibeReq.on('error', (error) => {
        res.status(500).json({ error: error.message });
    });

    if (req.body) {
        vibeReq.write(JSON.stringify(req.body));
    }
    vibeReq.end();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        services: {
            'claude-flow-mcp': 'ready',
            'flow-nexus-mcp': 'ready',
            'vibe-llm-proxy': 'ready'
        },
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 30090;
app.listen(PORT, () => {
    console.log(`MCP Services Wrapper running on port ${PORT}`);
    console.log(`Available endpoints:`);
    console.log(`  POST /claude-flow-mcp - Claude-flow MCP wrapper`);
    console.log(`  POST /flow-nexus-mcp - Flow-nexus MCP wrapper`);
    console.log(`  POST /vibe-llm-proxy - Vibe-LLM proxy`);
    console.log(`  GET  /health - Health check`);
});