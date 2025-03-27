export default {
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.[jt]sx?$': 'babel-jest'
    },
    moduleNameMapper: {
      '\\.(css|less|sass|scss)$': 'identity-obj-proxy'
    },
    extensionsToTreatAsEsm: ['.jsx'],
    transformIgnorePatterns: [
      '/node_modules/(?!(uuid)/)'
    ],
    setupFiles: ['./jest.setup.js']
  };