export interface Location {
  id: string;
  name: string;
}

export interface Trip {
  id: string;
  company: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  price: number;
  availableSeats: number;
}

export interface SearchParams {
  from: string;
  to: string;
  date: string;
}

export interface Seat {
  no: number;
  row: number;
  col: number;
  status: 'empty' | 'taken';
}

export interface SeatSchema {
  tripId: string;
  layout: {
    rows: number;
    cols: number;
    cells: number[][];
  };
  seats: Seat[];
  unitPrice: number;
}

export interface Passenger {
  seat: number;
  firstName: string;
  lastName: string;
  idNo: string;
  gender: 'male' | 'female' | 'other';
}

export interface ContactInfo {
  email: string;
  phone: string;
}

export interface BookingRequest {
  tripId: string;
  seats: number[];
  contact: ContactInfo;
  passengers: Passenger[];
}

export interface BookingResponse {
  ok: boolean;
  pnr: string;
  message: string;
}
