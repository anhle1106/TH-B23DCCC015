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
    'src/BT03/features/**/*.{ts,tsx}',
    'src/BT03/components/**/*.{ts,tsx}',
    'src/BT03/api/**/*.{ts,tsx}',
    '!src/BT03/**/*.d.ts',
    '!src/BT03/types/**',
    '!src/BT03/components/SubmissionNote/**',
  ],
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],
};
