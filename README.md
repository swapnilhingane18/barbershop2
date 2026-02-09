# 💈 Barbershop Queue & Slot Management System

A modern full-stack system designed to streamline barbershop operations by managing customer queues and appointment slots efficiently with real-time updates.

## 🚀 Quick Start

### Prerequisites
- **Backend:** Java 17 or higher
- **Frontend:** Node.js 18+ and npm
- **IDE:** VS Code (recommended)

### Running the Application

#### 1. Start the Backend
```bash
cd backend
.\mvnw.cmd spring-boot:run
```
Backend will start at `http://localhost:8080`

#### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will start at `http://localhost:5173`

#### 3. Access the Application
- **Customer Interface:** http://localhost:5173
- **Barber Dashboard:** http://localhost:5173/dashboard
- **API Docs:** http://localhost:8080/swagger-ui.html
- **H2 Console:** http://localhost:8080/h2-console

### Database Access
The application uses an in-memory H2 database for development.
- **Console URL**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- **JDBC URL**: `jdbc:h2:mem:barbershop`
- **Username**: `sa`
- **Password**: *(leave empty)*

## 🏗️ Architecture

### Frontend → Backend Communication

```
┌─────────────────┐         HTTP/REST          ┌─────────────────┐
│                 │ ────────────────────────▶  │                 │
│  React Frontend │                            │  Spring Boot    │
│  (Port 5173)    │ ◀────────────────────────  │  Backend        │
│                 │      JSON Responses         │  (Port 8080)    │
└─────────────────┘                             └─────────────────┘
         │                                               │
         │          WebSocket (STOMP)                    │
         │ ◀─────────────────────────────────────────▶  │
         │        Real-time Queue Updates               │
         │                                               │
         ▼                                               ▼
  localStorage                                    H2 Database
  (Customer Data)                                 (Queue & Slots)
```

### Key Technologies

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- React Router (routing)
- STOMP over SockJS (WebSocket)
- Axios (HTTP client)

**Backend:**
- Spring Boot 3
- Spring Data JPA
- H2 Database (dev)
- WebSocket (STOMP)
- Lombok

### Real-time Updates

The system uses **dual-mode communication**:
1. **Primary:** WebSocket (STOMP) for instant updates
2. **Fallback:** HTTP polling (10s interval) if WebSocket fails

## 📂 Project Structure

```
barbershop2/
├── backend/              # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/     # Java source code
│   │       └── resources/# Application config
│   ├── pom.xml
│   └── README.md
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API integration
│   │   ├── hooks/        # Custom React hooks
│   │   └── context/      # State management
│   ├── package.json
│   └── README.md
├── docs/                 # Documentation
│   ├── API.md           # API documentation
│   ├── DATABASE.md      # Database schema
│   └── DEPLOYMENT.md    # Deployment guide
├── scripts/             # Helper scripts
└── .vscode/             # VS Code configuration
```

## 📚 Documentation

- **[Backend Setup & Guide](backend/README.md)** - Backend development guide
- **[Frontend Setup & Guide](frontend/README.md)** - Frontend development guide
- **[API Documentation](docs/API.md)** - REST API reference
- **[Database Schema](docs/DATABASE.md)** - Database design
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment

## 🔐 Authentication (Future)

**Current State (MVP):**
- No authentication implemented
- Customer ID generated client-side
- Open access to all endpoints

**Future Implementation:**
Where authentication would be added:

1. **Backend:**
   - Add Spring Security
   - Implement JWT token generation
   - Protect endpoints with `@PreAuthorize`
   - Add user roles (CUSTOMER, BARBER, ADMIN)

2. **Frontend:**
   - Add login/register pages
   - Store JWT in localStorage
   - Add Authorization header to all API calls
   - Implement protected routes
   - Add role-based UI rendering

3. **WebSocket:**
   - Validate JWT before WebSocket connection
   - Subscribe to user-specific topics
   - Filter messages by user permissions

## 🚀 Features

- ✅ Customer registration (localStorage)
- ✅ Join/leave queue
- ✅ Real-time queue position updates
- ✅ Barber dashboard for queue management
- ✅ Call next customer
- ✅ Mark no-show
- ✅ Generate appointment slots
- ✅ View available slots
- ✅ Mobile-responsive design
- ✅ Error handling & retry mechanisms
- ✅ WebSocket with polling fallback

## 🛠️ Development

### Backend Development
```bash
cd backend
.\mvnw.cmd spring-boot:run
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Build for Production
```bash
# Backend
cd backend
.\mvnw.cmd clean package

# Frontend
cd frontend
npm run build
```

## 📝 License

MIT

