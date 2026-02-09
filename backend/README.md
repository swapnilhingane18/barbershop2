# Barbershop Backend

Spring Boot application managing the core business logic, database interactions, and real-time updates.

## 🛠 Setup & Configuration

### Prerequisites
- JDK 17+
- Maven (wrapper included)

### Database Configuration
The application is configured to use **H2 In-Memory Database** by default for development.
- **Configuration File**: `src/main/resources/application.properties`
- **H2 Console**: Enabled at `/h2-console`

To switch to MySQL:
1. Uncomment MySQL configuration in `application.properties`
2. Comment out H2 configuration
3. Update `pom.xml` to swap H2 dependency with MySQL driver

## 🚀 Running the Application

### Using VS Code (Recommended)
Use the predefined tasks:
1. `Ctrl+Shift+P` -> **Tasks: Run Task**
2. Select **Run Backend**

### Using Terminal
```bash
# Windows
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

## 🧪 Testing

Run standard unit and integration tests:
```bash
mvnw.cmd test
```
