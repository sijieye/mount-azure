import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './Map';
import '@testing-library/jest-dom/extend-expect';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = document.querySelector('a[href="https://reactjs.org"]');
  expect(linkElement).not.toBeNull();
});
