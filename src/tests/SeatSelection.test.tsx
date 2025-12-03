import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SeatSelection } from '../features/seats/SeatSelection';
import { renderWithProviders } from './utils';
import * as BookingContext from '../context/BookingContext';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ tripId: 'TRIP-1001' }),
    useNavigate: () => vi.fn(),
  };
});

vi.mock('../context/BookingContext', async () => {
  const actual = await vi.importActual('../context/BookingContext');
  return {
    ...actual,
    useBooking: vi.fn(),
  };
});

describe('SeatSelection', () => {
  beforeEach(() => {
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
      selectedSeats: [],
      passengers: [],
      contact: null,
      setTrip: vi.fn(),
      setSelectedSeats: vi.fn(),
      setPassengers: vi.fn(),
      setContact: vi.fn(),
      resetBooking: vi.fn(),
    });
  });

  it('loads seat map', async () => {
    renderWithProviders(<SeatSelection />);
    
    expect(screen.getByText(/loading seat map/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText(/loading seat map/i)).not.toBeInTheDocument();
    }, { timeout: 5000 });
    
    await waitFor(() => {
      expect(screen.getByText(/select your seats/i)).toBeInTheDocument();
    });
  });
});
