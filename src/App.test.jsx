
global.alert = jest.fn();
import 'whatwg-fetch';
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';
import { act } from 'react';

beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (url === '/api/login') {
      return Promise.resolve({
        json: () => Promise.resolve({ success: true, message: "Logged in!" })
      });
    }

    if (url === '/api/realms') {
      return Promise.resolve({
        json: () => Promise.resolve({ success: true, realms: [] }) // ✅ correct shape
      });
    }

    return Promise.resolve({
      json: () => Promise.resolve({})
    });
  });
});

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

  test('renders quest category buttons', () => {
    render(<App />);
    expect(screen.getByText('Exploration')).toBeInTheDocument();
    expect(screen.getByText('Combat')).toBeInTheDocument();
    expect(screen.getByText('Building')).toBeInTheDocument();
    expect(screen.getByText('Redstone')).toBeInTheDocument();
  });
  test('generates a quest when exploration button is clicked', async () => {
    render(<App />);
    const button = screen.getByText('Exploration');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('generated-quest')).toBeInTheDocument();
    });
  });

  test('marks a quest as completed', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('Combat'));

    await waitFor(() => {
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);
    });
  });

  test('shows completed quests after marking one complete', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('Building'));

    await waitFor(() => {
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
    });

    fireEvent.click(screen.getByText('View Completed Quests'));

    await waitFor(() => {
      expect(screen.getByTestId('completed-quest')).toBeInTheDocument();
    });
  });
});