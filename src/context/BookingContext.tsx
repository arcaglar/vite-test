import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Trip, Seat, Passenger, ContactInfo } from '../types';

export interface SelectedSeat extends Seat {
  unitPrice: number;
}

interface BookingContextType {
  trip: Trip | null;
  setTrip: (trip: Trip) => void;
  selectedSeats: SelectedSeat[];
  setSelectedSeats: (seats: SelectedSeat[]) => void;
  passengers: Passenger[];
  setPassengers: (passengers: Passenger[]) => void;
  contact: ContactInfo | null;
  setContact: (contact: ContactInfo) => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [contact, setContact] = useState<ContactInfo | null>(null);

  const resetBooking = useCallback(() => {
    setTrip(null);
    setSelectedSeats([]);
    setPassengers([]);
    setContact(null);
  }, []);

  return (
    <BookingContext.Provider value={{
      trip, setTrip,
      selectedSeats, setSelectedSeats,
      passengers, setPassengers,
      contact, setContact,
      resetBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
