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


This plan transitions the system from a "pull-based" API to a "push-based" architecture using WebSockets (STOMP) to ensure clients see live queue updates without manual refreshes.

1. Core Component Additions
WebSocket Configuration: * Register a STOMP endpoint with SockJS fallback.

Configure an internal Message Broker for topic-based broadcasting (e.g., /topic/queue).

Domain Event Layer: * Introduce a QueueUpdatedEvent (POJO) to decouple business logic from notification logic.

Event Publisher: * Integration of ApplicationEventPublisher within existing Service layers.

Async Event Listener: * A dedicated @EventListener component that intercepts internal events and triggers the SimpMessagingTemplate.

2. The Sync Workflow
State Change: A CRUD operation (Join/Cancel/Complete) occurs in the QueueService.

Internal Dispatch: The service publishes a QueueUpdatedEvent containing the Shop ID.

Broadcast: The Listener catches the event and pushes the updated queue payload to the specific WebSocket topic: /topic/shop/{shopId}.

3. Execution Roadmap
Step 1: Infrastructure Setup
Add spring-boot-starter-websocket dependency.

Define WebSocketConfig to enable the simple broker and set allowed origins.

Step 2: Event Definition
Create QueueUpdatedEvent to carry the context (Shop ID, affected Customer ID, Action Type).

Step 3: Service Instrumentation
Inject ApplicationEventPublisher into QueueService.

Update "Join Queue," "Cancel Slot," and "Next Customer" methods to publish the event after the MySQL transaction commits successfully.

Step 4: Broadcast Implementation
Create a QueueNotifyService (The Listener).

Inject SimpMessagingTemplate.

Implement a method to fetch the latest queue snapshot for the affected Shop and send it to the WebSocket destination.

Step 5: Security & Concurrency (Final Polish)
(Optional) Configure a ChannelInterceptor to validate JWTs on the initial WebSocket handshake.

Ensure the Event Listener is marked as @Async to prevent notification overhead from blocking the main transaction thread.