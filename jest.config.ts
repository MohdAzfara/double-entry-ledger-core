export interface JestCoverageThreshold {
  readonly branches: number;
  readonly functions: number;
  readonly lines: number;
  readonly statements: number;
}

export interface LedgerJestConfig {
  readonly displayName: string;
  readonly preset: string;
  readonly testEnvironment: 'node';
  readonly roots: readonly string[];
  readonly testMatch: readonly string[];
  readonly collectCoverageFrom: readonly string[];
  readonly coverageThreshold: {
    readonly global: JestCoverageThreshold;
  };
  readonly verbose: boolean;
  readonly clearMocks: boolean;
  readonly restoreMocks: boolean;
}

const config: LedgerJestConfig = {
  displayName: 'double-entry-ledger-core',
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  collectCoverageFrom: [
    'src/concurrency/**/*.ts',
    'src/crypto/**/*.ts',
    'src/domain/**/*.ts',
    'src/errors/**/*.ts',
    'src/guards/**/*.ts',
    'src/journal/**/*.ts',
    'src/reconciliation/**/*.ts',
    'src/revaluation/**/*.ts',
    'src/security/**/*.ts',
    'src/snapshots/**/*.ts',
    'src/telemetry/**/*.ts',
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  verbose: true,
  clearMocks: true,
  restoreMocks: true
};

export default config;
