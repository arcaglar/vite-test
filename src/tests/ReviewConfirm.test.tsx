import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReviewConfirm } from '../features/checkout/ReviewConfirm';
import { renderWithProviders } from './utils';
import * as BookingContext from '../context/BookingContext';

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

vi.mock('../context/BookingContext', async () => {
  const actual = await vi.importActual('../context/BookingContext');
  return {
    ...actual,
    useBooking: vi.fn(),
  };
});

describe('ReviewConfirm', () => {
  it('displays booking information and computes total price correctly', () => {
    const mockUseBooking = vi.mocked(BookingContext.useBooking);
    mockUseBooking.mockReturnValue({
      trip: {
        id: 'TRIP-1001',
        company: 'Test Bus Company',
        from: 'ist-alibeykoy',
        to: 'ank-asti',
        departure: '2025-11-02T10:00:00+03:00',
        arrival: '2025-11-02T14:00:00+03:00',
        price: 100,
        availableSeats: 10
      },
      selectedSeats: [
        { no: 1, row: 1, col: 1, status: 'empty' as const, unitPrice: 100 },
        { no: 2, row: 1, col: 2, status: 'empty' as const, unitPrice: 100 }
      ],
      passengers: [
        { seat: 1, firstName: 'Alice', lastName: 'Smith', idNo: '123', gender: 'female' as const },
        { seat: 2, firstName: 'Bob', lastName: 'Johnson', idNo: '124', gender: 'male' as const }
      ],
      contact: {
        email: 'charlie@example.com',
        phone: '1234567890'
      },
      setTrip: vi.fn(),
      setSelectedSeats: vi.fn(),
      setPassengers: vi.fn(),
      setContact: vi.fn(),
      resetBooking: vi.fn(),
    });

    renderWithProviders(<ReviewConfirm />);
    
    expect(screen.getByText(/confirm your booking/i)).toBeInTheDocument();
    expect(screen.getByText(/payment summary/i)).toBeInTheDocument();
    
    expect(screen.getByText(/test bus company/i)).toBeInTheDocument();
    
    expect(screen.getByText(/alice smith/i)).toBeInTheDocument();
    expect(screen.getByText(/bob johnson/i)).toBeInTheDocument();
    
    expect(screen.getByText(/charlie@example.com/i)).toBeInTheDocument();
    
    expect(screen.getByText(/payment summary/i)).toBeInTheDocument();
    
    const priceElements = screen.getAllByText(/200/);
    expect(priceElements.length).toBeGreaterThan(0);
  });
});
