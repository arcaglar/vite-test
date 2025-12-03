import type { Location, Trip, SeatSchema, BookingRequest, BookingResponse } from '../types';
import { env } from '../config/env';

const API_BASE_URL = env.apiBaseUrl;

const buildUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

export async function fetchLocations(): Promise<Location[]> {
  const response = await fetch(buildUrl('/reference/agencies'));
  if (!response.ok) {
    throw new Error('Failed to fetch locations');
  }
  return response.json();
}

export async function fetchSchedules(from: string, to: string, date: string): Promise<Trip[]> {
  const params = new URLSearchParams({ from, to, date });
  const response = await fetch(buildUrl(`/schedules?${params.toString()}`));
  if (!response.ok) {
    throw new Error('Failed to fetch schedules');
  }
  return response.json();
}

export async function fetchSeatSchema(tripId: string): Promise<SeatSchema> {
  const response = await fetch(buildUrl(`/seatSchemas/${tripId}`));
  if (!response.ok) {
    throw new Error('Failed to fetch seat schema');
  }
  return response.json();
}

export async function createBooking(data: BookingRequest): Promise<BookingResponse> {
  const response = await fetch(buildUrl('/tickets/sell'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Booking failed');
  }
  return response.json();
}
