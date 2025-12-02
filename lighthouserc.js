// Lighthouse CI Configuration
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: 'npm run serve:production',
      startServerReadyPattern: 'Web Server is available',
      url: [
        'http://localhost:1313/',
        'http://localhost:1313/services/',
        'http://localhost:1313/booking/'
      ]
    },
    assert: {
      assertions: {
        'categories:performance': ['error', {minScore: 0.95}],
        'categories:accessibility': ['error', {minScore: 0.95}],
        'categories:best-practices': ['error', {minScore: 0.95}],
        'categories:seo': ['error', {minScore: 0.95}]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};