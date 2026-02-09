# Barbershop Frontend

A modern React-based frontend for the Barbershop Queue & Slot Management System. Built with TypeScript, Vite, and real-time WebSocket integration.

## Tech Stack

- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS
- **Routing:** React Router v7
- **WebSocket:** STOMP over SockJS
- **HTTP Client:** Axios
- **Notifications:** react-hot-toast
- **State Management:** React Context API

## Features

- ✅ Customer registration with localStorage persistence
- ✅ Join/leave queue functionality
- ✅ Real-time queue updates via WebSocket
- ✅ Automatic polling fallback when WebSocket fails
- ✅ Barber dashboard for queue management
- ✅ Slot generation and viewing
- ✅ Mobile-responsive design
- ✅ Error handling with retry mechanisms
- ✅ Loading states for all async operations

## Prerequisites

- Node.js 18+ and npm
- Backend server running on `http://localhost:8080`

## Local Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api

# WebSocket Configuration
VITE_WS_URL=http://localhost:8080/ws
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Development Commands

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npx tsc --noEmit

# Lint code
npm run lint
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # React Context providers
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # API service layer
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── constants/       # App constants
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # App entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── .env                 # Environment variables (gitignored)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080/api` | Yes |
| `VITE_WS_URL` | WebSocket endpoint URL | `http://localhost:8080/ws` | Yes |

## Common Issues & Fixes

### Issue: "Failed to connect to backend"

**Cause:** Backend server not running or wrong URL

**Fix:**
```bash
# Check backend is running on port 8080
curl http://localhost:8080/actuator/health

# Verify VITE_API_BASE_URL in .env
cat .env
```

### Issue: "WebSocket connection failed"

**Cause:** WebSocket endpoint not accessible

**Fix:**
- Verify backend WebSocket is enabled
- Check `VITE_WS_URL` in `.env`
- App will automatically fall back to polling

### Issue: "CORS errors in console"

**Cause:** Backend CORS not configured for frontend origin

**Fix:**
- Backend must allow `http://localhost:5173` in CORS config
- See backend `WebConfig.java` for CORS settings

### Issue: "Customer data lost on refresh"

**Cause:** localStorage not working or cleared

**Fix:**
- Check browser localStorage is enabled
- Open DevTools → Application → Local Storage
- Verify `barbershop_customer_*` keys exist

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Notes

- No authentication in MVP (planned for future)
- Customer ID generated client-side (not secure, MVP only)
- CORS must be configured on backend
- Use HTTPS in production for WebSocket security

## License

MIT
