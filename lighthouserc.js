// Lighthouse CI Configuration
module.exports = {
  ci:
  collect:
    numberOfRuns: 3
    startServerCommand: npm run serve:production
    startServerReadyPattern: "Web Server is available"
    url:
      - http://localhost:1313/
      - http://localhost:1313/services/
      - http://localhost:1313/booking/
  assert:
    assertions:
      "categories:performance": ["warn", {"minScore": 0.9}]
      "categories:accessibility": ["error", {"minScore": 0.9}]
      "categories:best-practices": ["warn", {"minScore": 0.9}]
      "categories:seo": ["warn", {"minScore": 0.9}]
  upload:
    target: temporary-public-storage
};