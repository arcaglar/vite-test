import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchForm } from '../features/search/SearchForm';
import { renderWithProviders } from './utils';

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('SearchForm', () => {
  it('validates required fields', async () => {
    renderWithProviders(<SearchForm />);
    
    const button = await screen.findByRole('button', { name: /search tickets/i }, { timeout: 3000 });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/please select departure location/i)).toBeInTheDocument();
      expect(screen.getByText(/please select arrival location/i)).toBeInTheDocument();
    });
  });

  it('renders search form with all fields', async () => {
    renderWithProviders(<SearchForm />);
    
    await screen.findByRole('button', { name: /search tickets/i }, { timeout: 3000 });
    
    expect(screen.getByText(/from/i)).toBeInTheDocument();
    expect(screen.getByText(/to/i)).toBeInTheDocument();
    expect(screen.getByText(/date/i)).toBeInTheDocument();
    expect(screen.getByText(/find your bus ticket/i)).toBeInTheDocument();
    
    const inputs = screen.getAllByRole('combobox');
    expect(inputs).toHaveLength(2);
  });

  it('allows typing in autocomplete fields', async () => {
    renderWithProviders(<SearchForm />);
    
    await screen.findByRole('button', { name: /search tickets/i }, { timeout: 3000 });
    
    const inputs = screen.getAllByRole('combobox');
    const fromInput = inputs[0];
    
    fireEvent.change(fromInput, { target: { value: 'Istanbul' } });
    
    await waitFor(() => {
      expect(fromInput).toHaveValue('Istanbul');
    });
  });

  it('validates that departure and arrival cannot be the same', async () => {
    renderWithProviders(<SearchForm />);
    
    const button = await screen.findByRole('button', { name: /search tickets/i }, { timeout: 3000 });
    
    const inputs = screen.getAllByRole('combobox');
    const fromInput = inputs[0];
    const toInput = inputs[1];
    
    fireEvent.change(fromInput, { target: { value: 'İstanbul' } });
    fireEvent.click(fromInput);
    
    await waitFor(() => {
      const options = screen.getAllByText(/İstanbul – Alibeyköy/i);
      fireEvent.click(options[0]);
    }, { timeout: 3000 });
    
    await waitFor(() => {
      expect(fromInput).toHaveValue('İstanbul – Alibeyköy');
    });
    
    fireEvent.change(toInput, { target: { value: 'İstanbul' } });
    fireEvent.click(toInput);
    
    await waitFor(() => {
      const options = screen.getAllByText(/İstanbul – Alibeyköy/i);
      fireEvent.click(options[options.length - 1]);
    }, { timeout: 3000 });
    
    await waitFor(() => {
      expect(toInput).toHaveValue('İstanbul – Alibeyköy');
    });
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/departure and arrival locations cannot be the same/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
