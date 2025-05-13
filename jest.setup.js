// Add custom jest matchers from jest-dom
import '@testing-library/jest-dom';

// Mock the console.error to avoid noisy component errors in tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    /Warning.*not wrapped in act/i.test(args[0]) ||
    /Warning.*ReactDOM.render is no longer supported/i.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Create a mock file for image imports
// You'll need to create this file
// __mocks__/fileMock.js with: module.exports = 'test-file-stub';
