const config = {
  projects: [
    {
      displayName: 'react',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/src/**/?(*.)+(spec|test).tsx'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tests/react-tsconfig.json' }],
      },
      setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/tests/setupReactTests.js'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    },
    {
      displayName: 'node',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/src/**/?(*.)+(spec|test).ts',
        // TODO: framework-agnostic API route tests
        // '<rootDir>/tests/**/?(*.)+(spec|test).ts'
      ],
      // setupFilesAfterEnv: ['<rootDir>/tests/setupNodeTests.ts'],
      // globalTeardown: '<rootDir>/tests/teardown.js',
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
    },
  ],
};

module.exports = config;
