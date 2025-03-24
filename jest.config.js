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
      setupFilesAfterEnv: ['@testing-library/jest-dom'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    },
    {
      displayName: 'node',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/src/**/?(*.)+(spec|test).ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
    },
  ],
};

module.exports = config;
