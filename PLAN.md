## Phase 2 — Real-time Queue Sync (Backend Only)

### Goal
Enable real-time queue updates so all connected clients receive instant state changes.

### Scope
- Spring Boot backend only
- No frontend code
- No authentication changes

### Technologies
- STOMP over WebSocket
- Spring Messaging
- In-memory message broker

### Components to Implement

1. WebSocket Configuration
- Endpoint: /ws
- Enable STOMP broker
- Application prefix: /app
- Topics:
  - /topic/shop/{shopId}
  - /topic/barber/{barberId}
  - /user/queue/notifications

2. Queue State Machine
Queue states:
- WAITING
- IN_PROGRESS
- COMPLETED
- NO_SHOW

Rules:
- State transitions happen only in service layer
- No hard deletes of queue entries

3. Event Emission
Emit WebSocket events when:
- Slot is booked
- Queue advances
- Status changes
- No-show is marked

4. Estimated Wait Time (EWT)
- Recalculate EWT on every queue mutation
- Formula based on:
  - Queue position
  - Average service duration
  - Current in-progress elapsed time
- Broadcast EWT updates via WebSocket

### Constraints
- Do not change Phase 1 logic
- Do not introduce frontend code
- Follow existing package structure
