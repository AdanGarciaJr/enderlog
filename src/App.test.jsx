global.alert = jest.fn();
import 'whatwg-fetch';
import React from 'react'; 
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

describe('App UI Tests', () => {
  test('renders login button when not logged in', () => {
    render(<App />);
    expect(screen.getByText(/login to minecraft/i)).toBeInTheDocument();
  });

  test('shows loading or empty state when no realms are available', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/no realms found/i)).toBeInTheDocument();
    });
  });

  test('fetchRealms called after login', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ json: async () => ({ success: true }) }) // login
      .mockResolvedValueOnce({ json: async () => [] }); // realms

    render(<App />);
    fireEvent.click(screen.getByText(/login to minecraft/i));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/realms');
    });
  });
});