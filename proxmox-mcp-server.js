#!/usr/bin/env node
// Proxmox MCP Server
const http = require('http');
const url = require('url');

// Simple HTTP server to handle Proxmox MCP requests
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'GET' && parsedUrl.pathname === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({
      "message": "Proxmox MCP Service",
      "version": "1.0.0",
      "endpoints": ["/health", "/nodes", "/vms", "/containers"],
      "capabilities": ["proxmox-api-integration", "vm-management", "container-management", "cluster-info"]
    }));
  } else if (req.method === 'GET' && parsedUrl.pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ "status": "healthy", "service": "proxmox-mcp" }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ "error": "Not found" }));
  }
});

const PORT = process.env.PORT || 30006;
server.listen(PORT, () => {
  console.log(`Proxmox MCP Server running on port ${PORT}`);
});