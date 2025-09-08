# Travel Planner Web Application

A comprehensive travel planning web application built with Spring Boot backend and vanilla HTML/CSS/JavaScript frontend.

## Features

- **User Authentication**: User registration and login
- **Trip Planning**: Create and manage travel trips
- **Flight Booking**: Search and book flights
- **Train Booking**: Search and book train tickets
- **Bus Booking**: Search and book bus tickets
- **Hotel Booking**: Search and book hotels
- **Expense Tracking**: Track travel expenses
- **Admin Panel**: Administrative functions

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher
- Web browser (Chrome, Firefox, Safari, Edge)

## Setup Instructions

### 1. Database Setup

1. Install MySQL and create a database:
```sql
CREATE DATABASE travel_planner;
```

2. Update the database configuration in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/travel_planner?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build and run the Spring Boot application:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Open the `home.html` file in your web browser or serve it using a local web server:
```bash
# Using Python (if installed)
python -m http.server 8000

# Using Node.js (if installed)
npx http-server -p 8000
```

3. Access the application at `http://localhost:8000`

## Usage

### Getting Started

1. **Home Page**: Visit the home page to see the application overview
2. **Registration**: Click "Get Started" to register a new account
3. **Login**: Use your credentials to log in
4. **Plan Trip**: Create a new trip with destination and dates
5. **Book Services**: Search and book flights, trains, buses, and hotels
6. **Track Expenses**: Monitor your travel expenses

### Sample Data

The application comes with sample data including:
- Sample users (john.doe@example.com, jane.smith@example.com)
- Sample flights, trains, buses, and hotels
- Admin accounts (admin@travelplanner.com)

### API Endpoints

The backend provides RESTful APIs:

- **Authentication**: `/api/auth/register`, `/api/auth/login`
- **Trips**: `/api/trips`
- **Flights**: `/api/flights`
- **Trains**: `/api/trains`
- **Buses**: `/api/buses`
- **Hotels**: `/api/hotels`
- **Expenses**: `/api/expenses`

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Ensure MySQL is running
   - Check database credentials in `application.properties`
   - Verify database exists

2. **CORS Issues**:
   - The application is configured to allow all origins
   - If issues persist, check browser console for CORS errors

3. **Port Conflicts**:
   - Backend runs on port 8080
   - Frontend should run on a different port (8000, 3000, etc.)

4. **JavaScript Errors**:
   - Check browser console for errors
   - Ensure backend is running before testing frontend

### Development

- **Backend**: Spring Boot with JPA/Hibernate
- **Frontend**: Vanilla HTML, CSS, JavaScript with Bootstrap
- **Database**: MySQL with JPA entities
- **Build Tool**: Maven

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

