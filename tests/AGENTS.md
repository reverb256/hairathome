# TESTS DIRECTORY KNOWLEDGE BASE

**Generated:** 2026-01-07
**Branch:** main

## OVERVIEW
Playwright E2E testing suite for cross-browser testing and mobile responsiveness validation of the Hair@Home static site.

## STRUCTURE
```
tests/
├── e2e.spec.js      # Main E2E test suite
├── mobile.spec.js   # Mobile-specific tests
├── accessibility.spec.js # WCAG compliance tests
└── performance.spec.js  # Performance benchmarking
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| **Main Tests** | `e2e.spec.js` | Core functionality testing |
| **Mobile Tests** | `mobile.spec.js` | Responsive design validation |
| **Accessibility** | `accessibility.spec.js` | WCAG 2.1 AA compliance |
| **Performance** | `performance.spec.js` | Lighthouse benchmarks |
| **Test Config** | `playwright.config.js` | Browser and environment setup |

## CODE MAP

| File | Type | Purpose | Browsers | Key Tests |
|------|------|---------|----------|-----------|
| `e2e.spec.js` | Test | Core functionality | Chromium, Firefox | Navigation, forms, booking |
| `mobile.spec.js` | Test | Mobile responsiveness | Mobile Chrome, Safari | Touch, layout, PWA |
| `accessibility.spec.js` | Test | WCAG compliance | All browsers | ARIA, keyboard, color |
| `performance.spec.js` | Test | Performance metrics | All browsers | Lighthouse, Core Web Vitals |

## CONVENTIONS

- **Cross-Browser**: Tests run on Chromium, Firefox, and mobile browsers
- **Mobile-First**: Mobile responsiveness is primary focus
- **Accessibility**: WCAG 2.1 AA compliance required
- **Performance**: Lighthouse CI integration
- **Page Object Model**: Reusable page components
- **Test Isolation**: Each test independent

## ANTI-PATTERNS (THIS PROJECT)

- **NO** flaky tests with arbitrary waits
- **NO** hardcoded selectors
- **NO** test dependencies between suites
- **NO** inconsistent test naming
- **NO** missing accessibility validation

## UNIQUE STYLES

- **Beauty Industry Focus**: Tests validate professional appearance
- **Mobile Hair Styling**: Touch interactions for appointment booking
- **Image Gallery**: Lightbox and gallery functionality testing
- **Service Information**: Validation of service descriptions and pricing
- **Performance Critical**: Fast loading requirements for mobile users

## COMMANDS

```bash
npm run test        # Run all tests
npm run test:mobile # Mobile-specific tests
npm run test:performance # Performance benchmarks
```

## NOTES

- Tests validate beauty industry UX standards
- Mobile performance is critical for field technicians
- Gallery and image functionality extensively tested
- Service worker and PWA features validated