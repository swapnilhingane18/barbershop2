# Frontend Implementation Plan (React + Vite + TypeScript)

## Phase 0 Backend Fix: CORS Configuration ✅
- [x] Create `CorsConfig.java` for global CORS configuration
- [x] Compile and verify backend builds successfully
- [x] Document CORS verification steps
- [ ] Test CORS with browser fetch (requires running backend)

## Phase 0: Backend Verification & Setup
- [x] Verify CORS is enabled on backend controllers → **CRITICAL: NOT CONFIGURED**
- [x] Test WebSocket endpoint `/ws` from browser console → **Documented (backend not running)**
- [x] Document actual API response shapes (QueueEntry, Slot) → **Completed**
- [ ] Create `.env.example` with `VITE_API_BASE_URL` → **Deferred to Phase 1**
- [ ] Create `.env` (gitignored) with local backend URL → **Deferred to Phase 1**

## Phase 1: Project Initialization
- [x] Initialize React + TypeScript project with Vite
- [x] Install core dependencies:
  - [x] `axios` (API calls)
  - [x] `react-router-dom` (routing)
  - [x] `react-hot-toast` (notifications)
  - [x] `@stomp/stompjs` + `sockjs-client` (WebSocket)
- [x] Install Tailwind CSS (optional: skip icons for MVP)
- [x] Configure Tailwind CSS
- [x] Set up folder structure:
  - [x] `src/components/` (UI components)
  - [x] `src/pages/` (route pages)
  - [x] `src/services/` (API integration)
  - [x] `src/hooks/` (custom hooks)
  - [x] `src/context/` (React Context)
  - [x] `src/utils/` (helpers)
  - [x] `src/types/` (TypeScript interfaces)
  - [x] `src/constants/` (constants like BARBER_ID)

## Phase 2: Core Infrastructure
- [x] Create `constants.ts` with `BARBER_ID = 1`, API endpoints
- [x] Create TypeScript interfaces in `types/`:
  - [x] `QueueEntry` interface
  - [x] `Slot` interface
  - [x] `Customer` interface
- [x] Create `utils/localStorage.ts`:
  - [x] `getCustomer()` - retrieve from localStorage
  - [x] `setCustomer(id, name, phone)` - persist customer
  - [x] `generateCustomerId()` - use `Date.now()`
- [x] Create Context providers:
  - [x] `CustomerContext` (customerId, name, phone)
  - [x] `BarberContext` (barberId = 1 for MVP)

## Phase 3: Core UI Components
- [x] Create `ErrorBoundary` component
- [x] Create `LoadingSpinner` component
- [x] Create `Button` component (primary, secondary, danger variants)
- [x] Create `Input` component with validation
- [x] Create `Card` component
- [x] Create `Layout` component (Header, Main)
- [x] Create `Badge` component (WAITING, IN_PROGRESS, COMPLETED)
- [x] Create `Toast` wrapper (react-hot-toast)

## Phase 4: API Integration Layer
- [x] Create `services/api.ts`:
  - [x] Axios instance with base URL from env
  - [x] Error interceptor
  - [x] Request/response logging (dev only)
- [x] Create `services/queueService.ts`:
  - [x] `joinQueue(barberId, customerId)`
  - [x] `getQueue(barberId)`
  - [x] `getPosition(barberId, customerId)`
  - [x] `cancelSlot(barberId, customerId)`
  - [x] `completeCustomer(barberId)` (barber only)
  - [x] `markNoShow(barberId)` (barber only)
- [x] Create `services/slotService.ts`:
  - [x] `generateSlots(barberId, start, end, duration)`
  - [x] `getSlots(barberId, date)`
  - [x] `bookSlot(slotId, userId)` (optional for MVP)
- [x] Create `hooks/useApi.ts`:
  - [x] Generic hook with loading, error, data states
  - [x] Automatic error toast on failure
- [x] Create `utils/formatting.ts`:
  - [x] Date/time formatters
  - [x] Wait time formatter (minutes → "X min")

## Phase 5: Customer Flow Pages
- [x] Create **Welcome Page** (`/`):
  - [x] Check localStorage for existing customer
  - [x] If new: show name/phone form
  - [x] Generate customerId with `Date.now()`
  - [x] Save to localStorage and CustomerContext
  - [x] Redirect to Queue page
- [x] Create **Queue Page** (`/queue`):
  - [x] "Join Queue" button
  - [x] Display current queue list (live)
  - [x] Show customer's position & estimated wait time
  - [x] "Leave Queue" button
  - [x] Queue position indicator
- [x] Create **Slots View** (optional, `/slots`):
  - [x] Display available slots for the day
  - [x] View-only for MVP (no booking)

## Phase 6: Barber Dashboard
- [x] Create **Dashboard Page** (`/dashboard`):
  - [x] Display active queue
  - [x] "Call Next" button (completeCustomer)
  - [x] "Mark No-Show" button
  - [x] Show current customer being served
- [x] Create **Slot Management Panel**:
  - [x] Form to generate slots (date, start, end, duration)
  - [x] Display generated slots

## Phase 7: WebSocket Integration
- [x] Create `hooks/useWebSocket.ts`:
  - [x] Connect to `/ws` endpoint
  - [x] Subscribe to `/topic/barber/1`
  - [x] Auto-reconnect on disconnect (max 5 retries)
  - [x] Connection status indicator
  - [x] Fallback to polling if WebSocket fails
- [x] Integrate WebSocket in Queue Page:
  - [x] Listen for queue updates
  - [x] Update UI in real-time
- [x] Integrate WebSocket in Dashboard:
  - [x] Listen for queue updates
  - [x] Update dashboard in real-time

## Phase 8: Error Handling & UX Polish
- [x] Add input validation:
  - [x] Name: required, 2-50 chars
  - [x] Phone: required, valid format
- [x] Add loading states to all API calls
- [x] Add error states with retry buttons
- [x] Add empty states (no queue, no slots)
- [x] Test error scenarios:
  - [x] Backend down
  - [x] Network timeout
  - [x] WebSocket disconnect
- [x] Add mobile responsiveness checks

## Phase 9: Testing & Validation
- [ ] Test with backend running:
  - Join queue flow
  - View queue updates
  - Barber complete customer
  - Barber mark no-show
- [ ] Test with backend stopped:
  - Error messages display
  - Retry mechanisms work
- [ ] Test WebSocket:
  - Disconnect/reconnect
  - Fallback polling
- [ ] Test on mobile viewport
- [ ] Verify no console errors or warnings
- [ ] Check localStorage persistence

## Phase 10: Documentation & Deployment Prep
- [ ] Create `frontend/README.md`:
  - Setup instructions
  - Environment variables
  - Development commands
  - Build for production
- [ ] Create `docs/DEPLOYMENT.md`:
  - Vercel deployment steps
  - Environment variables for production
  - CORS configuration notes
  - HTTPS requirements
- [ ] Document where auth would be added (future)
- [ ] Update root `README.md` with frontend info

## Security Checklist
- [ ] No secrets in code (use .env)
- [ ] `.env` in `.gitignore`
- [ ] All user inputs sanitized (React handles most)
- [ ] XSS prevention verified
- [ ] CORS properly configured for production
- [ ] HTTPS enforced in production (document)

## Review
*To be completed after implementation...*

---

## Key Decisions (Reference)
- **Customer ID**: `Date.now()` stored in localStorage
- **Barber ID**: Constant `BARBER_ID = 1` for MVP
- **State Management**: React Context API
- **Authentication**: None (open access MVP)
- **Deployment**: Vercel (frontend), separate backend server
- **Slot Booking**: View-only for MVP
