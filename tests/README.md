# Playwright Testing for Hair@Home

This directory contains the complete Playwright testing suite for the Hair@Home mobile hair stylist website, configured with MCP integration for k3s cluster environments.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests with UI mode
npm run test:ui

# Run tests in headed mode
npm run test:headed

# Run MCP-enhanced tests
npm run test:mcp

# Run tests for k3s environment
npx playwright test --config=playwright.k3s.config.js
```

## 📁 Test Structure

```
tests/
├── basic-functionality.spec.js    # Core page functionality tests
├── navigation.spec.js             # Navigation and smooth scrolling tests
├── booking-form.spec.js           # Booking form validation and interaction
├── responsive-design.spec.js      # Mobile and responsive design tests
├── accessibility.spec.js          # WCAG accessibility compliance tests
├── performance.spec.js            # Page load and performance metrics
├── mcp-integration.spec.js         # MCP tool integration tests
├── mcp-runner.js                  # MCP-enhanced test runner
├── global-setup.js               # MCP global setup
└── global-teardown.js            # MCP global teardown
```

## 🎯 Test Coverage

### Basic Functionality
- Page load verification
- Navigation menu presence
- Hero section display
- Mobile hamburger menu
- All sections visibility
- Contact information display

### Navigation
- Smooth scrolling to sections
- Hero button navigation
- Footer link functionality
- Active section highlighting
- Scroll behavior

### Booking Form
- Form field presence
- Validation testing
- Service dropdown options
- Time slot availability
- Form submission handling
- Booking information display

### Responsive Design
- Mobile layout (375px)
- Tablet layout (768px)
- Desktop layout (1920px)
- Mobile navigation
- Form usability on mobile
- Image responsiveness

### Accessibility
- HTML structure validation
- Image alt text
- Form labels
- Keyboard navigation
- Focus indicators
- Heading hierarchy
- Link descriptions
- Semantic HTML

### Performance
- Page load time (< 5s)
- Image optimization
- Resource minification
- Console error checking
- Core Web Vitals
- Font loading
- Memory usage
- Request optimization

### MCP Integration
- Hook execution
- Memory storage
- Session management
- Performance tracking
- Neural training
- GitHub integration
- Multi-agent coordination

## 🔧 Configuration

### Standard Environment
- **Config**: `playwright.config.js`
- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile**: Pixel 5, iPhone 12, iPad Pro

### k3s Cluster Environment
- **Config**: `playwright.k3s.config.js`
- **Optimized**: Containerized testing
- **Launch Options**: No-sandbox, shared memory settings
- **Timeouts**: Increased for network latency

## 🤖 MCP Integration

### Environment Variables
```bash
export MCP_ENABLED=true
export BASE_URL=http://your-service.k3s.local
export GITHUB_ACTIONS=true  # For CI/CD integration
```

### MCP Features
- **Pre/Post Hooks**: Automated test coordination
- **Memory Storage**: Test result persistence
- **Session Management**: Cross-session state
- **Neural Training**: Pattern learning from results
- **GitHub Integration**: Automated reporting
- **Multi-Agent**: Coordinated testing workflows

### MCP Commands
```bash
# Run MCP-enhanced tests
npm run test:mcp

# Initialize MCP session
npx claude-flow@alpha hooks pre-task --description "Testing setup"

# Store test results
npx claude-flow@alpha hooks post-edit --file "results.json" --memory-key "tests/latest"

# Export metrics
npx claude-flow@alpha hooks session-end --export-metrics true
```

## 📊 Reports

### HTML Report
```bash
npm run test:report
```
Opens interactive HTML report with screenshots and videos.

### JSON Results
- **File**: `test-results.json`
- **Format**: Machine-readable test results
- **Integration**: MCP memory storage

### JUnit XML
- **File**: `test-results.xml`
- **Format**: CI/CD integration
- **Compatibility**: GitHub Actions, GitLab CI

## 🐳 Docker/k3s Support

### Dockerfile Example
```dockerfile
FROM mcr.microsoft.com/playwright:v1.48.0-focal

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npx playwright install

CMD ["npm", "run", "test:ci"]
```

### k8s Deployment
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: playwright-tests
spec:
  template:
    spec:
      containers:
      - name: playwright
        image: hairathome-testing:latest
        env:
        - name: MCP_ENABLED
          value: "true"
        - name: BASE_URL
          value: "http://hairathome-service:3000"
```

## 🔍 Debugging

### Debug Mode
```bash
npm run test:debug
```
Opens Playwright Inspector for step-by-step debugging.

### Trace Viewer
```bash
npx playwright show-trace trace.zip
```
View detailed execution traces.

### Headed Mode
```bash
npm run test:headed
```
Run tests with visible browser windows.

## 📈 Performance Metrics

The performance suite tracks:
- **LCP** (Largest Contentful Paint): < 4s
- **FID** (First Input Delay): < 300ms
- **CLS** (Cumulative Layout Shift): < 0.25
- **Memory Usage**: < 50MB
- **Request Count**: < 50 requests
- **Image Sizes**: < 500KB per image

## 🚨 CI/CD Integration

### GitHub Actions
```yaml
- name: Run Playwright tests
  run: |
    npm ci
    npx playwright install
    npm run test:ci
  env:
    MCP_ENABLED: true
    BASE_URL: ${{ steps.deploy.outputs.url }}
```

### GitLab CI
```yaml
test:playwright:
  script:
    - npm ci
    - npx playwright install
    - npm run test:ci
  artifacts:
    reports:
      junit: test-results.xml
    paths:
      - playwright-report/
```

## 🔧 Customization

### Adding New Tests
1. Create `.spec.js` file in `tests/` directory
2. Use Playwright test syntax
3. Include MCP hooks if needed
4. Update this README

### MCP Integration
1. Add hooks in `global-setup.js`
2. Store results in `global-teardown.js`
3. Use `mcp-runner.js` for enhanced features

### Browser Configuration
Modify `playwright.config.js` projects section:
```javascript
projects: [
  {
    name: 'custom-browser',
    use: { ...devices['Custom Device'] },
  },
]
```

## 📝 Best Practices

1. **Test Isolation**: Each test should be independent
2. **Page Objects**: Use page object patterns for complex interactions
3. **Wait Strategies**: Use Playwright's auto-waiting features
4. **Error Handling**: Include proper error messages
5. **MCP Integration**: Store relevant data in MCP memory
6. **Performance**: Monitor test execution times
7. **Accessibility**: Include a11y tests in every feature

## 🐛 Troubleshooting

### Common Issues
- **Timeouts**: Increase timeouts in k3s environments
- **Memory**: Use `--disable-dev-shm-usage` for containers
- **Network**: Check `BASE_URL` configuration
- **MCP**: Verify `MCP_ENABLED=true` and claude-flow installation

### Debug Commands
```bash
# Check MCP installation
npx claude-flow@alpha --version

# Test MCP hooks
npx claude-flow@alpha hooks pre-task --description "test"

# Verify Playwright installation
npx playwright --version
```

## 📞 Support

For issues with:
- **Playwright**: Check [Playwright Docs](https://playwright.dev/)
- **MCP Integration**: Check [Claude Flow Docs](https://github.com/ruvnet/claude-flow)
- **k3s Environment**: Check cluster configuration and networking

---

Generated for Hair@Home mobile hair stylist website testing.