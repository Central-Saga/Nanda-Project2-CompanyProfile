module.exports = { ci: {
  collect: { url: ['http://127.0.0.1:3100/admin/login'], numberOfRuns: 1, settings: { chromeFlags: '--no-sandbox' } },
  assert: { assertions: { 'categories:accessibility': ['error', { minScore: 0.9 }], 'categories:best-practices': ['error', { minScore: 0.9 }], 'first-contentful-paint': ['error', { maxNumericValue: 3000 }] } },
  upload: { target: 'filesystem', outputDir: './test-results/lighthouse' }
} };
