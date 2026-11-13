import type { Config } from 'jest';

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
