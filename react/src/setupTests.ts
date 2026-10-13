import '@testing-library/jest-dom';

// Global window.confirm mock for JSDOM
if (typeof window !== 'undefined') {
  window.confirm = jest.fn(() => true);
}
