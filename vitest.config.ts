import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use globals to match Storybook's testing patterns
    globals: true,
    
    // Include story test files
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    
    // Use jsdom for fast unit tests (Storybook test-runner uses Playwright for component tests)
    environment: 'jsdom',
    
    // Setup files
    setupFiles: ['./vitest.setup.ts'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.stories.ts', 'src/**/*.spec.ts', 'src/**/*.test.ts'],
    },
    
    // Timeouts
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
