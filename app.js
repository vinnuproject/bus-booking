const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { Op } = require('sequelize');
const db = require('./models');
const { User, Route, Bus, Booking } = db;
const authRoutes = require('./routes/auth.routes');
const { authenticateToken } = require('./middleware/auth.middleware');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bus Booking API',
      version: '1.0.0',
      description: 'API for bus booking system with authentication, real-time seat updates, and operator features.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js', './app.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const requireRole = role => asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ error: 'Access denied. Operator role required.' });
  }
  next();
});

const HOLD_DURATION_MINUTES = 10;

const normalizeDate = date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const buildDateRange = travelDate => {
  const start = normalizeDate(travelDate);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

const buildSeatMap = (capacity, bookings) => {
  const seatMap = Array.from({ length: capacity }, (_, index) => {
    const seatNumber = String(index + 1);
    const booking = bookings.find(b => b.seat_number === seatNumber);
    return {
      seat_number: seatNumber,
      status: booking ? (booking.status === 'held' ? 'held' : 'booked') : 'available'
    };
  });
  return seatMap;
};

const getNeighbourSeats = (seat_number, columns = 2) => {
  const seatNum = parseInt(seat_number, 10);
  if (Number.isNaN(seatNum)) return [];
  const rowStart = Math.floor((seatNum - 1) / columns) * columns + 1;
  const rowSeats = Array.from({ length: columns }, (_, idx) => rowStart + idx).map(String);
  return rowSeats.filter(n => n !== seat_number);
};

const isSeatUnavailable = async (busId, travel_date, seat_number) => {
  const { start, end } = buildDateRange(travel_date);
  const now = new Date();

  return Booking.findOne({
    where: {
      busId,
      seat_number,
      travel_date: {
        [Op.gte]: start,
        [Op.lt]: end
      },
      [Op.or]: [
        { status: 'confirmed' },
        {
          status: 'held',
          held_until: {
            [Op.gt]: now
          }
        }
      ]
    }
  });
};

const checkGenderSeatingRule = async (user, busId, travel_date, seat_number) => {
  if (!user?.gender || user.gender === 'Other') return false;
  const neighbours = getNeighbourSeats(seat_number, 2);
  if (!neighbours.length) return false;

  const { start, end } = buildDateRange(travel_date);
  const now = new Date();
  const adjacentBookings = await Booking.findAll({
    where: {
      busId,
      seat_number: neighbours,
      travel_date: {
        [Op.gte]: start,
        [Op.lt]: end
      },
      [Op.or]: [
        { status: 'confirmed' },
        {
          status: 'held',
          held_until: {
            [Op.gt]: now
          }
        }
      ]
    },
    include: [{ model: User, attributes: ['gender', 'id'] }]
  });

  return adjacentBookings.some(adjacency => {
    const neighbourUser = adjacency.User;
    return neighbourUser && neighbourUser.gender && neighbourUser.gender !== user.gender && adjacency.User.id !== user.id;
  });
};

const createTransitSuggestion = (origin, destination) => {
  const legs = [];
  if (origin.toLowerCase() !== 'hyderabad') {
    legs.push({
      mode: 'City Bus',
      from: origin,
      to: 'Central Bus Terminal',
      duration: '25 mins',
      instruction: `Take the city bus from ${origin} to the nearest inter-city terminal.`
    });
  }
  legs.push({
    mode: 'Inter-city Bus',
    from: 'Central Bus Terminal',
    to: destination,
    duration: '6h 15m',
    instruction: 'Board the express inter-city bus from the main terminal gate.'
  });
  legs.push({
    mode: 'Last-Mile Shuttle',
    from: destination,
    to: `${destination} Arrival Bay`,
    duration: '10 mins',
    instruction: 'Take the terminal shuttle to the final drop-off location.'
  });
  return legs;
};

const buildCarbonSavings = (distance) => {
  const avgBusEmission = 27; // g CO2 per passenger per km
  const avgCarEmission = 171; // g CO2 per passenger per km
  const avgFlightEmission = 255; // g CO2 per passenger per km
  const savedByBusVsCar = ((avgCarEmission - avgBusEmission) * distance) / 1000;
  const savedByBusVsFlight = ((avgFlightEmission - avgBusEmission) * distance) / 1000;
  return {
    co2_saved_vs_car: Number(savedByBusVsCar.toFixed(2)),
    co2_saved_vs_flight: Number(savedByBusVsFlight.toFixed(2)),
    green_points: Math.max(10, Math.floor(distance / 10))
  };
};

const driverStatus = {};

app.get('/users', asyncHandler(async (req, res) => {
  const users = await User.findAll();
  res.json(users);
}));

app.post('/users', asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
}));

/**
 * @swagger
 * /routes:
 *   get:
 *     summary: Get all routes with optional filters
 *     parameters:
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of routes
 */
app.get('/routes', asyncHandler(async (req, res) => {
  const { source, destination } = req.query;
  const where = {};
  if (source) where.source = source;
  if (destination) where.destination = destination;
  const routes = await Route.findAll({ where, include: Bus });
  res.json(routes);
}));

app.get('/routes/search', asyncHandler(async (req, res) => {
  const { origin, destination, fuel_type, has_wifi, has_toilet, has_charging, is_ac, seating_type, min_fare, max_fare } = req.query;
  if (!origin || !destination) {
    return res.status(400).json({ error: 'origin and destination are required' });
  }

  const route = await Route.findOne({
    where: {
      source: origin,
      destination
    }
  });

  if (!route) {
    return res.json({ route: null, buses: [] });
  }

  const busWhere = { routeId: route.id };
  if (fuel_type) busWhere.fuel_type = fuel_type;
  if (has_wifi !== undefined) busWhere.has_wifi = has_wifi === 'true';
  if (has_toilet !== undefined) busWhere.has_toilet = has_toilet === 'true';
  if (has_charging !== undefined) busWhere.has_charging = has_charging === 'true';
  if (is_ac !== undefined) busWhere.is_ac = is_ac === 'true';
  if (seating_type) busWhere.seating_type = seating_type;
  if (min_fare) busWhere.fare = { ...busWhere.fare, [Op.gte]: parseFloat(min_fare) };
  if (max_fare) busWhere.fare = { ...busWhere.fare, [Op.lte]: parseFloat(max_fare) };

  const buses = await Bus.findAll({ where: busWhere, include: Route });
  res.json({ route, buses });
}));

app.get('/routes/suggestions', asyncHandler(async (req, res) => {
  const { origin, destination } = req.query;
  if (!origin || !destination) {
    return res.status(400).json({ error: 'origin and destination are required.' });
  }

  const legs = createTransitSuggestion(origin, destination);
  res.json({ origin, destination, legs });
}));

app.post('/boardings/nfc-tap', authenticateToken, requireRole('operator'), asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  if (!bookingId) {
    return res.status(400).json({ error: 'bookingId is required.' });
  }

  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  if (booking.userId !== req.user.id) {
    return res.status(403).json({ error: 'You do not have permission to board this booking.' });
  }

  booking.nfc_boarded = true;
  booking.boarding_status = 'boarded';
  await booking.save();

  res.json({ success: true, booking });
}));

app.post('/sos', authenticateToken, requireRole('operator'), asyncHandler(async (req, res) => {
  const { bookingId, location } = req.body;
  if (!bookingId || !location) {
    return res.status(400).json({ error: 'bookingId and location are required.' });
  }

  const booking = await Booking.findByPk(bookingId, { include: [Bus, Route] });
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  res.json({
    status: 'SOS received',
    bookingId,
    location,
    assigned_support: 'Highway Control Room',
    eta_response: '2 mins',
    message: 'Your silent alert has been sent to the nearest operator team.'
  });
}));

app.get('/bookings/:id/carbon', authenticateToken, asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ where: { id: req.params.id, userId: req.user.id }, include: [Route] });
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  const distance = booking.Route?.distance || 200;
  const savings = buildCarbonSavings(distance);
  res.json({ bookingId: booking.id, distance, savings });
}));

app.get('/operators/manifest', authenticateToken, requireRole('operator'), asyncHandler(async (req, res) => {
  const { busId, travel_date } = req.query;
  if (!busId || !travel_date) {
    return res.status(400).json({ error: 'busId and travel_date are required.' });
  }

  const travelDateValue = normalizeDate(new Date(travel_date));
  const manifest = await Booking.findAll({
    where: {
      busId,
      travel_date: travelDateValue,
      status: 'confirmed'
    },
    include: [{ model: User, attributes: ['name', 'phone', 'gender', 'id_type', 'id_number'] }]
  });

  res.json({ busId, travel_date: travelDateValue.toISOString().slice(0, 10), manifest });
}));

app.post('/operators/checkpoint', authenticateToken, asyncHandler(async (req, res) => {
  const { busId, travel_date, checkpoint } = req.body;
  if (!busId || !travel_date || !checkpoint) {
    return res.status(400).json({ error: 'busId, travel_date and checkpoint are required.' });
  }

  const key = `${busId}-${normalizeDate(new Date(travel_date)).toISOString().slice(0, 10)}`;
  driverStatus[key] = {
    checkpoint,
    updatedAt: new Date(),
    eta: '45 mins',
    status: checkpoint.includes('rest') ? 'Rest stop' : 'En route'
  };

  res.json({ success: true, status: driverStatus[key] });
}));

app.get('/operators/status', authenticateToken, asyncHandler(async (req, res) => {
  const { busId, travel_date } = req.query;
  if (!busId || !travel_date) {
    return res.status(400).json({ error: 'busId and travel_date are required.' });
  }

  const key = `${busId}-${normalizeDate(new Date(travel_date)).toISOString().slice(0, 10)}`;
  res.json({ status: driverStatus[key] || { checkpoint: 'Not checked in yet', eta: 'Unknown', status: 'Pending' } });
}));


app.get('/buses', asyncHandler(async (req, res) => {
  const { routeId } = req.query;
  const where = {};
  if (routeId) where.routeId = routeId;
  const buses = await Bus.findAll({ where, include: Route });
  res.json(buses);
}));

app.get('/buses/:id', asyncHandler(async (req, res) => {
  const bus = await Bus.findByPk(req.params.id, { include: Route });
  if (!bus) return res.status(404).json({ error: 'Bus not found.' });
  res.json(bus);
}));

app.get('/buses/:id/telemetry', asyncHandler(async (req, res) => {
  const bus = await Bus.findByPk(req.params.id, { include: Route });
  if (!bus) return res.status(404).json({ error: 'Bus not found.' });
  res.json({
    busId: bus.id,
    last_known_latitude: bus.last_known_latitude || 17.3850,
    last_known_longitude: bus.last_known_longitude || 78.4867,
    current_temperature: bus.current_temperature || 22.5,
    washroom_status: bus.washroom_status || 'Vacant',
    aqi: bus.aqi || 25,
    platform_number: bus.platform_number || 'A1',
    route: bus.Route ? `${bus.Route.source} → ${bus.Route.destination}` : null,
    updatedAt: new Date()
  });
}));

app.post('/buses', asyncHandler(async (req, res) => {
  const bus = await Bus.create(req.body);
  res.status(201).json(bus);
}));

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get user's bookings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's bookings
 *       401:
 *         description: Unauthorized
 */
app.get('/bookings', authenticateToken, asyncHandler(async (req, res) => {
  const bookings = await Booking.findAll({
    where: { userId: req.user.id },
    include: [User, Bus, Route]
  });
  res.json(bookings);
}));

app.post('/bookings', authenticateToken, asyncHandler(async (req, res) => {
  const payload = { ...req.body, userId: req.user.id };
  const booking = await Booking.create(payload);
  res.status(201).json(booking);
}));

app.post('/bookings/hold', authenticateToken, asyncHandler(async (req, res) => {
  const { busId, routeId, travel_date, seat_number, total_price } = req.body;
  if (!busId || !routeId || !travel_date || !seat_number) {
    return res.status(400).json({ error: 'busId, routeId, travel_date and seat_number are required.' });
  }

  const bus = await Bus.findByPk(busId);
  if (!bus) {
    return res.status(404).json({ error: 'Bus not found.' });
  }

  const travelDateValue = normalizeDate(new Date(travel_date));
  const existing = await isSeatUnavailable(busId, travelDateValue, seat_number);
  if (existing) {
    return res.status(409).json({ error: 'Seat is already held or booked for this travel date.' });
  }

  const conflict = await checkGenderSeatingRule(req.user, busId, travelDateValue, seat_number);
  if (conflict) {
    return res.status(409).json({ error: 'Seat cannot be held due to gender-safe seating rules near adjacent passengers.' });
  }

  const hold = await Booking.create({
    userId: req.user.id,
    busId,
    routeId,
    travel_date: travelDateValue,
    seat_number,
    status: 'held',
    held_until: new Date(Date.now() + HOLD_DURATION_MINUTES * 60 * 1000),
    total_price,
    luggage_tag: `LT-${Date.now().toString().slice(-6)}`
  });

  // Emit real-time seat update
  const bookings = await Booking.findAll({
    where: {
      busId,
      travel_date: travelDateValue,
      [Op.or]: [
        { status: 'confirmed' },
        { status: 'held', held_until: { [Op.gt]: new Date() } }
      ]
    }
  });
  const seatMap = buildSeatMap(bus.capacity, bookings);
  io.emit('seatUpdate', { busId, travel_date: travelDateValue.toISOString().slice(0, 10), seatMap });

  res.status(201).json(hold);
}));

app.post('/bookings/confirm', authenticateToken, asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  if (!bookingId) {
    return res.status(400).json({ error: 'bookingId is required.' });
  }

  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  if (booking.userId !== req.user.id) {
    return res.status(403).json({ error: 'You do not have permission to confirm this booking.' });
  }

  if (booking.status !== 'held') {
    return res.status(400).json({ error: 'Only held bookings can be confirmed.' });
  }

  if (booking.held_until && new Date(booking.held_until) < new Date()) {
    booking.status = 'cancelled';
    await booking.save();
    return res.status(400).json({ error: 'Booking hold has expired.' });
  }

  booking.status = 'confirmed';
  booking.held_until = null;
  await booking.save();

  // Emit real-time seat update
  const bus = await Bus.findByPk(booking.busId);
  const bookings = await Booking.findAll({
    where: {
      busId: booking.busId,
      travel_date: booking.travel_date,
      [Op.or]: [
        { status: 'confirmed' },
        { status: 'held', held_until: { [Op.gt]: new Date() } }
      ]
    }
  });
  const seatMap = buildSeatMap(bus.capacity, bookings);
  io.emit('seatUpdate', { busId: booking.busId, travel_date: booking.travel_date.toISOString().slice(0, 10), seatMap });

  res.json(booking);
}));

app.post('/bookings/cancel', authenticateToken, asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  if (!bookingId) {
    return res.status(400).json({ error: 'bookingId is required.' });
  }

  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  if (booking.userId !== req.user.id) {
    return res.status(403).json({ error: 'You do not have permission to cancel this booking.' });
  }

  booking.status = 'cancelled';
  booking.held_until = null;
  await booking.save();

  // Emit real-time seat update
  const bus = await Bus.findByPk(booking.busId);
  const bookings = await Booking.findAll({
    where: {
      busId: booking.busId,
      travel_date: booking.travel_date,
      [Op.or]: [
        { status: 'confirmed' },
        { status: 'held', held_until: { [Op.gt]: new Date() } }
      ]
    }
  });
  const seatMap = buildSeatMap(bus.capacity, bookings);
  io.emit('seatUpdate', { busId: booking.busId, travel_date: booking.travel_date.toISOString().slice(0, 10), seatMap });

  res.json(booking);
}));

app.post('/bookings/reschedule', authenticateToken, asyncHandler(async (req, res) => {
  const { bookingId, newTravelDate, newBusId } = req.body;
  if (!bookingId || !newTravelDate) {
    return res.status(400).json({ error: 'bookingId and newTravelDate are required.' });
  }

  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  if (booking.userId !== req.user.id) {
    return res.status(403).json({ error: 'You do not have permission to reschedule this booking.' });
  }

  if (booking.status !== 'confirmed') {
    return res.status(400).json({ error: 'Only confirmed bookings can be rescheduled.' });
  }

  const newDate = normalizeDate(new Date(newTravelDate));
  const targetBusId = newBusId || booking.busId;

  // Check if seat is available on new date/bus
  const existing = await isSeatUnavailable(targetBusId, newDate, booking.seat_number);
  if (existing) {
    return res.status(409).json({ error: 'Seat is not available on the new date/bus.' });
  }

  // Cancel old booking
  booking.status = 'cancelled';
  await booking.save();

  // Create new booking
  const newBooking = await Booking.create({
    userId: req.user.id,
    busId: targetBusId,
    routeId: booking.routeId,
    travel_date: newDate,
    seat_number: booking.seat_number,
    status: 'confirmed',
    total_price: booking.total_price
  });

  res.json(newBooking);
}));

app.get('/buses/:id/seats', asyncHandler(async (req, res) => {
  const bus = await Bus.findByPk(req.params.id);
  if (!bus) {
    return res.status(404).json({ error: 'Bus not found.' });
  }

  const travelDate = req.query.travel_date ? normalizeDate(new Date(req.query.travel_date)) : normalizeDate(new Date());
  const { start, end } = buildDateRange(travelDate);
  const now = new Date();

  const bookings = await Booking.findAll({
    where: {
      busId: bus.id,
      travel_date: {
        [Op.gte]: start,
        [Op.lt]: end
      },
      [Op.or]: [
        { status: 'confirmed' },
        {
          status: 'held',
          held_until: {
            [Op.gt]: now
          }
        }
      ]
    }
  });

  res.json({
    busId: bus.id,
    travel_date: travelDate.toISOString(),
    seats: buildSeatMap(bus.capacity, bookings)
  });
}));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;

db.sequelize.authenticate()
  .then(() => {
    console.log('Database connection established.');
    server.listen(PORT, () => {
      console.log(`Bus Booking API running at http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  });
