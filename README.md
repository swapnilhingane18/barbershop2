# 💈 Barbershop Queue & Slot Management System

A modern system designed to streamline barbershop operations by managing customer queues and appointment slots efficiently.

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- VS Code (with Java Extension Pack)

### Running the Backend
1. Open this workspace in VS Code: `barbershop.code-workspace`
2. Open the **Command Palette** (`Ctrl+Shift+P`) and select **Tasks: Run Task** -> **Run Backend**
3. The server will start at `http://localhost:8080`

### Accessing the Database
The application uses an in-memory H2 database for development.
- **Console URL**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- **JDBC URL**: `jdbc:h2:mem:barbershop`
- **Username**: `sa`
- **Password**: *(leave empty)*

## 📂 Project Structure

- `backend/` - Spring Boot backend application
- `frontend/` - Frontend application (Planned)
- `docs/` - Comprehensive project documentation
- `scripts/` - Helper scripts for common tasks
- `.vscode/` - Editor configuration files

## 📚 Documentation

- [Backend Setup & Guide](backend/README.md)
- [API Documentation](docs/API.md)
- [Database Schema](docs/DATABASE.md)
