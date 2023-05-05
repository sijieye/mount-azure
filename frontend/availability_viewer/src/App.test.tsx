import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom/extend-expect';

describe('Routing', () => {
    test("render starting page", () => {
        render(<App />);
        expect(screen.getByText('Availability Viewer')).toBeInTheDocument();
    })
})
