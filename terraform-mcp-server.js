#!/usr/bin/env node
// Terraform MCP Server
const http = require('http');
const url = require('url');

// Simple HTTP server to handle Terraform MCP requests
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'GET' && parsedUrl.pathname === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({
      "message": "Terraform MCP Service",
      "version": "1.0.0",
      "endpoints": ["/health", "/plan", "/apply", "/destroy"],
      "capabilities": ["terraform-cli-operations", "infrastructure-as-code", "plan-apply-destroy"]
    }));
  } else if (req.method === 'GET' && parsedUrl.pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ "status": "healthy", "service": "terraform-mcp" }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ "error": "Not found" }));
  }
});

const PORT = process.env.PORT || 30004;
server.listen(PORT, () => {
  console.log(`Terraform MCP Server running on port ${PORT}`);
});