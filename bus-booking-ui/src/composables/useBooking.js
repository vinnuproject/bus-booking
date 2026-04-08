import { useBookingStore } from '../stores/booking.store';

export function useBooking() {
  const booking = useBookingStore();

  function setSearch(origin, destination, travelDate, filters = {}) {
    booking.origin = origin;
    booking.destination = destination;
    booking.travelDate = travelDate;
    booking.filters = filters;
  }

  return {
    booking,
    setSearch
  };
}
