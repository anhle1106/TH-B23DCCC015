/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        diagnostics: false,
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          allowJs: true,
          moduleResolution: 'node',
          target: 'ES2022',
          skipLibCheck: true,
          isolatedModules: true,
        },
      },
    ],
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{spec,test}.{ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{ts,tsx}',
  ],
  collectCoverageFrom: [
    'src/TH01/features/**/*.{ts,tsx}',
    'src/TH01/utils/**/*.{ts,tsx}',
    'src/TH01/hooks/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    './src/TH01/features/': {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],
};
