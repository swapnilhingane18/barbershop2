# API Documentation 📚

Base URL: `http://localhost:8080/api`

## Queue Management (`/queue`)

### Join Queue
Add a customer to a barber's queue.
- **Endpoint**: `POST /queue/join`
- **Parameters**:
  - `barberId` (Long): ID of the barber
  - `customerId` (Long): ID of the customer
- **Response**: `QueueEntry` object

### Cancel Slot
Remove a customer from the queue.
- **Endpoint**: `POST /queue/cancel`
- **Parameters**:
  - `barberId` (Long)
  - `customerId` (Long)
- **Response**: Success message string

### Complete Customer
Mark currently served customer as completed.
- **Endpoint**: `POST /queue/complete`
- **Parameters**:
  - `barberId` (Long)
- **Response**: Success message string

### Mark No-Show
Mark currently served customer as no-show.
- **Endpoint**: `POST /queue/no-show`
- **Parameters**:
  - `barberId` (Long)
- **Response**: Success message string

### Get Queue
Get the current queue for a specific barber.
- **Endpoint**: `GET /queue`
- **Parameters**:
  - `barberId` (Long)
- **Response**: List of `QueueEntry` objects

### Get Position
Get a customer's position and estimated wait time.
- **Endpoint**: `GET /queue/position`
- **Parameters**:
  - `barberId` (Long)
  - `customerId` (Long)
- **Response**: JSON with `position`, `status`, `estimatedWaitTime`

---

## Slot Management (`/slots`)

### Generate Slots
Create appointment slots for a barber.
- **Endpoint**: `POST /slots/generate`
- **Parameters**:
  - `barberId` (Long)
  - `start` (DateTime): ISO 8601 format
  - `end` (DateTime): ISO 8601 format
  - `duration` (int): Minutes
- **Response**: List of generated `Slot` objects

### Get Slots
Retrieve available slots for a barber.
- **Endpoint**: `GET /slots`
- **Parameters**:
  - `barberId` (Long)
  - `date` (DateTime): ISO 8601 format
- **Response**: List of available `Slot` objects

### Book Slot
Book a specific slot for a user.
- **Endpoint**: `POST /slots/{id}/book`
- **Path Variable**: `id` (Long) - Slot ID
- **Parameters**:
  - `userId` (Long)
- **Response**: Booked `Slot` object
