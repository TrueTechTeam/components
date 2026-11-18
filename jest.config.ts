import type { Config } from 'jest';

// One time zone for every run, so date tests behave the same on a developer machine and on CI
// (UTC). West of UTC on purpose: a date-only string parsed as UTC midnight would show the
// previous day here, which FieldValue's tests rely on catching. Set before workers start so they
// inherit it; assigning process.env.TZ inside a test file only changes Jest's sandboxed copy.
process.env.TZ = 'America/Los_Angeles';

const config: Config = {
  displayName: 'ui-components',
  testEnvironment: 'jsdom',
  // Multi-step interaction tests can exceed the 5s default when CI runs suites in parallel.
  testTimeout: 15000,
  testPathIgnorePatterns: ['/node_modules/', '/.claude/', '\\.template\\.'],
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      { tsconfig: '<rootDir>/tsconfig.spec.json', isolatedModules: true },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/index.ts',
    '!src/test-setup.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 45,
      functions: 40,
      lines: 45,
      statements: 45,
    },
  },
};

export default config;
