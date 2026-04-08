# Bus Booking API Reference

## Base URL

`http://localhost:3000`

## Endpoints

### GET /routes
Returns all available routes.

### GET /buses
Returns all buses.

### GET /buses/:id/seats?travel_date=YYYY-MM-DD
Returns a seat map for the bus and travel date.

Response:
```json
{
  "busId": 1,
  "travel_date": "2026-04-10T00:00:00.000Z",
  "seats": [
    { "seat_number": "1", "status": "available" },
    { "seat_number": "2", "status": "held" },
    { "seat_number": "3", "status": "booked" }
  ]
}
```

### POST /auth/register
Register a new user.

Request body:
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "securepassword",
  "phone": "1234567890"
}
```

Response:
```json
{
  "user": { "id": 1, "name": "Alice", "email": "alice@example.com", "phone": "1234567890", "role": "customer" },
  "accessToken": "...",
  "refreshToken": "..."
}
```

### POST /auth/login
Authenticate and receive tokens.

Request body:
```json
{
  "email": "alice@example.com",
  "password": "securepassword"
}
```

### POST /auth/refresh
Refresh the access token.

Request body:
```json
{
  "refreshToken": "..."
}
```

Response:
```json
{
  "accessToken": "..."
}
```

### POST /auth/logout
Revoke the refresh token.

Request body:
```json
{
  "refreshToken": "..."
}
```

### POST /bookings/hold
Lock a seat for the authenticated user before payment.

Request body:
```json
{
  "busId": 1,
  "routeId": 1,
  "travel_date": "2026-04-10",
  "seat_number": "12",
  "total_price": "749.00"
}
```

### POST /bookings/confirm
Confirm a previously held booking.

Request body:
```json
{
  "bookingId": 1
}
```

### POST /bookings/cancel
Cancel a held booking.

Request body:
```json
{
  "bookingId": 1
}
```
