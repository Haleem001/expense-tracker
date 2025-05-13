module.exports = {
  // The root directory where Jest should scan for files
  rootDir: '.',
  
  // The test environment that will be used for testing
  testEnvironment: 'jsdom',
  
  // The glob patterns Jest uses to detect test files
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  
  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  
  // A map from regular expressions to module names that allow to stub out resources
  moduleNameMapper: {
    // Handle CSS/SCSS imports (if applicable)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Handle image imports (if applicable)
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    // Handle module aliases (if you're using them)
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  // Setup files to run before each test
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Indicates whether each individual test should be reported during the run
  verbose: true,
  
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  
  // Collect coverage information
  collectCoverage: true,
  
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  
  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/'],
  
  // Transform files with babel-jest
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  
  // Ignore transforming node_modules except for specific packages if needed
  transformIgnorePatterns: [
    '/node_modules/(?!(@mui|react-router-dom)/)'
  ]
};
