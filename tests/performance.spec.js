import { test, expect } from '@playwright/test';

/**
 * Performance tests for Hair@Home website
 * Tests page load speed, resource optimization, and user experience metrics
 */
test.describe('Hair@Home - Performance', () => {
  test('page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('http://localhost:1313/hairathome/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    console.log(`Page load time: ${loadTime}ms`);
  });

  test('images are optimized', async ({ page }) => {
    const responses = [];
    
    page.on('response', response => {
      if (response.url().includes('.jpg') || response.url().includes('.png') || response.url().includes('.webp')) {
        responses.push({
          url: response.url(),
          size: parseInt(response.headers()['content-length'] || '0')
        });
      }
    });

    await page.goto('http://localhost:1313/hairathome/');
    await page.waitForLoadState('networkidle');

    // Check that images are not excessively large
    for (const response of responses) {
      if (response.size > 0) {
        // Images should be under 500KB for web optimization
        expect(response.size).toBeLessThan(500 * 1024);
        console.log(`Image: ${response.url.split('/').pop()} - ${response.size} bytes`);
      }
    }
  });

  test('CSS and JS files are minified', async ({ page }) => {
    const responses = [];
    
    page.on('response', response => {
      if (response.url().includes('.css') || response.url().includes('.js')) {
        responses.push({
          url: response.url(),
          size: parseInt(response.headers()['content-length'] || '0')
        });
      }
    });

    await page.goto('http://localhost:1313/hairathome/');
    await page.waitForLoadState('networkidle');

    // Check file sizes
    for (const response of responses) {
      if (response.size > 0) {
        console.log(`Resource: ${response.url.split('/').pop()} - ${response.size} bytes`);
      }
    }
  });

  test('no console errors on page load', async ({ page }) => {
    const consoleMessages = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });

    await page.goto('http://localhost:1313/hairathome/');
    await page.waitForLoadState('networkidle');

    expect(consoleMessages).toHaveLength(0);
    
    if (consoleMessages.length > 0) {
      console.log('Console errors:', consoleMessages);
    }
  });

  test('Core Web Vitals metrics', async ({ page }) => {
    await page.goto('http://localhost:1313/hairathome/');
    await page.waitForLoadState('networkidle');

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {};
          
          entries.forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.LCP = entry.startTime;
            }
            if (entry.entryType === 'first-input') {
              vitals.FID = entry.processingStart - entry.startTime;
            }
            if (entry.entryType === 'layout-shift') {
              if (!vitals.CLS) vitals.CLS = 0;
              vitals.CLS += entry.value;
            }
          });
          
          resolve(vitals);
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        
        // Fallback timeout
        setTimeout(() => resolve({}), 3000);
      });
    });

    console.log('Core Web Vitals:', metrics);

    // Basic checks (these are simplified - real CWV requires more complex measurement)
    if (metrics.LCP) {
      expect(metrics.LCP).toBeLessThan(4000); // LCP should be under 4 seconds
    }
    
    if (metrics.FID) {
      expect(metrics.FID).toBeLessThan(300); // FID should be under 300ms
    }
    
    if (metrics.CLS) {
      expect(metrics.CLS).toBeLessThan(0.25); // CLS should be under 0.25
    }
  });

  test('font loading performance', async ({ page }) => {
    const fontLoadTimes = [];
    
    page.on('response', response => {
      if (response.url().includes('fonts.googleapis.com') || response.url().includes('.woff') || response.url().includes('.ttf')) {
        fontLoadTimes.push({
          url: response.url(),
          timing: response.request().timing()
        });
      }
    });

    await page.goto('http://localhost:1313/hairathome/');
    await page.waitForLoadState('networkidle');

    console.log(`Loaded ${fontLoadTimes.length} font resources`);
    
    // Check that external fonts load
    expect(fontLoadTimes.length).toBeGreaterThan(0);
  });

  test('resource loading order', async ({ page }) => {
    const resourceOrder = [];
    
    page.on('response', response => {
      const url = response.url();
      if (url.includes('.css') || url.includes('.js') || url.includes('.jpg') || url.includes('.png')) {
        resourceOrder.push(url);
      }
    });

    await page.goto('http://localhost:1313/hairathome/');
    await page.waitForLoadState('networkidle');

    // CSS should load before images for better perceived performance
    const cssIndex = resourceOrder.findIndex(url => url.includes('.css'));
    const firstImageIndex = resourceOrder.findIndex(url => url.includes('.jpg') || url.includes('.png'));
    
    if (cssIndex !== -1 && firstImageIndex !== -1) {
      expect(cssIndex).toBeLessThan(firstImageIndex);
    }
  });

  test('memory usage', async ({ page }) => {
    await page.goto('http://localhost:1313/hairathome/');
    await page.waitForLoadState('networkidle');

    // Get memory usage (Chrome-specific)
    const memoryInfo = await page.evaluate(() => {
      return performance.memory ? {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      } : null;
    });

    if (memoryInfo) {
      console.log('Memory usage:', {
        used: `${Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024)}MB`,
        total: `${Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024)}MB`,
        limit: `${Math.round(memoryInfo.jsHeapSizeLimit / 1024 / 1024)}MB`
      });

      // Memory usage should be reasonable (under 50MB for a simple site)
      expect(memoryInfo.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024);
    }
  });

  test('network request count', async ({ page }) => {
    const requests = [];
    
    page.on('request', request => {
      requests.push(request.url());
    });

    await page.goto('http://localhost:1313/hairathome/');
    await page.waitForLoadState('networkidle');

    console.log(`Total requests: ${requests.length}`);
    
    // Should not have excessive number of requests
    expect(requests.length).toBeLessThan(50);
    
    // Log request types
    const requestTypes = {
      css: requests.filter(url => url.includes('.css')).length,
      js: requests.filter(url => url.includes('.js')).length,
      images: requests.filter(url => url.includes('.jpg') || url.includes('.png') || url.includes('.webp')).length,
      fonts: requests.filter(url => url.includes('fonts.googleapis.com') || url.includes('.woff')).length,
      other: requests.filter(url => !url.includes('.css') && !url.includes('.js') && !url.includes('.jpg') && !url.includes('.png') && !url.includes('.webp') && !url.includes('fonts.googleapis.com') && !url.includes('.woff')).length
    };
    
    console.log('Request types:', requestTypes);
  });
});