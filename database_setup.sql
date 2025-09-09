-- =====================================================
-- TRAVEL PLANNER DATABASE SETUP SCRIPT
-- Complete database creation for Travel Planner Web Application
-- =====================================================

-- Step 1: Drop existing database and create fresh
DROP DATABASE IF EXISTS travel_planner;
CREATE DATABASE travel_planner;
USE travel_planner;

-- =====================================================
-- TABLE CREATION
-- =====================================================

-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- Admins table
CREATE TABLE admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('SUPER_ADMIN', 'CONTENT_MANAGER', 'SUPPORT') DEFAULT 'CONTENT_MANAGER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Trips table
CREATE TABLE trips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    destination VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DECIMAL(10,2),
    status ENUM('PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED') DEFAULT 'PLANNED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_destination (destination),
    INDEX idx_start_date (start_date),
    INDEX idx_status (status)
);

-- Flights table
CREATE TABLE flights (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    flight_number VARCHAR(20) NOT NULL,
    airline VARCHAR(100) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration VARCHAR(20),
    seats_available INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_flight_number (flight_number),
    INDEX idx_origin_destination (origin, destination),
    INDEX idx_departure_time (departure_time),
    INDEX idx_price (price)
);

-- Trains table
CREATE TABLE trains (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    train_number VARCHAR(20) NOT NULL,
    train_name VARCHAR(100) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration VARCHAR(20),
    seats_available INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_train_number (train_number),
    INDEX idx_origin_destination (origin, destination),
    INDEX idx_departure_time (departure_time),
    INDEX idx_price (price)
);

-- Buses table
CREATE TABLE buses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(20) NOT NULL,
    operator VARCHAR(100) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration VARCHAR(20),
    amenities TEXT,
    seats_available INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_bus_number (bus_number),
    INDEX idx_origin_destination (origin, destination),
    INDEX idx_departure_time (departure_time),
    INDEX idx_price (price)
);

-- Hotels table
CREATE TABLE hotels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    location VARCHAR(100) NOT NULL,
    description TEXT,
    price_per_night DECIMAL(10,2) NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0.0,
    amenities TEXT,
    rooms_available INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_location (location),
    INDEX idx_price_per_night (price_per_night),
    INDEX idx_rating (rating)
);

-- Flight Bookings table
CREATE TABLE flight_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    flight_id BIGINT NOT NULL,
    trip_id BIGINT,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_email VARCHAR(100) NOT NULL,
    passenger_phone VARCHAR(20),
    seat_number VARCHAR(10),
    status ENUM('CONFIRMED', 'CANCELLED', 'PENDING') DEFAULT 'CONFIRMED',
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_flight_id (flight_id),
    INDEX idx_booking_date (booking_date),
    INDEX idx_status (status)
);

-- Train Bookings table
CREATE TABLE train_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    train_id BIGINT NOT NULL,
    trip_id BIGINT,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_email VARCHAR(100) NOT NULL,
    passenger_phone VARCHAR(20),
    seat_number VARCHAR(10),
    status ENUM('CONFIRMED', 'CANCELLED', 'PENDING') DEFAULT 'CONFIRMED',
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_train_id (train_id),
    INDEX idx_booking_date (booking_date),
    INDEX idx_status (status)
);

-- Bus Bookings table
CREATE TABLE bus_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    bus_id BIGINT NOT NULL,
    trip_id BIGINT,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_email VARCHAR(100) NOT NULL,
    passenger_phone VARCHAR(20),
    seat_number VARCHAR(10),
    status ENUM('CONFIRMED', 'CANCELLED', 'PENDING') DEFAULT 'CONFIRMED',
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_bus_id (bus_id),
    INDEX idx_booking_date (booking_date),
    INDEX idx_status (status)
);

-- Hotel Bookings table
CREATE TABLE hotel_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    hotel_id BIGINT NOT NULL,
    trip_id BIGINT,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guest_name VARCHAR(100) NOT NULL,
    guest_email VARCHAR(100) NOT NULL,
    guest_phone VARCHAR(20),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    room_type VARCHAR(50),
    number_of_guests INT DEFAULT 1,
    status ENUM('CONFIRMED', 'CANCELLED', 'PENDING') DEFAULT 'CONFIRMED',
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_hotel_id (hotel_id),
    INDEX idx_check_in_date (check_in_date),
    INDEX idx_status (status)
);

-- Expenses table
CREATE TABLE expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    trip_id BIGINT,
    category ENUM('TRANSPORT', 'ACCOMMODATION', 'FOOD', 'ENTERTAINMENT', 'SHOPPING', 'MISCELLANEOUS') NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    expense_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_trip_id (trip_id),
    INDEX idx_category (category),
    INDEX idx_expense_date (expense_date)
);

-- Budgets table
CREATE TABLE budgets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    trip_id BIGINT,
    category ENUM('TRANSPORT', 'ACCOMMODATION', 'FOOD', 'ENTERTAINMENT', 'SHOPPING', 'MISCELLANEOUS') NOT NULL,
    allocated_amount DECIMAL(10,2) NOT NULL,
    spent_amount DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_trip_id (trip_id),
    INDEX idx_category (category)
);

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample users
INSERT INTO users (name, email, phone, password) VALUES
('John Doe', 'john.doe@example.com', '+1234567890', 'password123'),
('Jane Smith', 'jane.smith@example.com', '+1234567891', 'password123'),
('Demo User', 'demo@travelplanner.com', '+1234567892', 'demo123'),
('Alice Johnson', 'alice.johnson@example.com', '+1234567893', 'password123'),
('Bob Wilson', 'bob.wilson@example.com', '+1234567894', 'password123');

-- Insert sample admins
INSERT INTO admins (name, email, password, role) VALUES
('System Admin', 'admin@travelplanner.com', 'admin123', 'SUPER_ADMIN'),
('Content Manager', 'content@travelplanner.com', 'content123', 'CONTENT_MANAGER'),
('Support Agent', 'support@travelplanner.com', 'support123', 'SUPPORT');

-- Insert sample trips
INSERT INTO trips (user_id, name, description, destination, start_date, end_date, budget, status) VALUES
(1, 'Mumbai to Delhi Business Trip', 'Important business meeting in Delhi', 'Delhi', '2025-02-15', '2025-02-18', 25000.00, 'PLANNED'),
(1, 'Goa Vacation', 'Family vacation to Goa beaches', 'Goa', '2025-03-01', '2025-03-07', 40000.00, 'PLANNED'),
(2, 'Bangalore Tech Conference', 'Attending tech conference in Bangalore', 'Bangalore', '2025-02-20', '2025-02-23', 15000.00, 'PLANNED'),
(3, 'Kerala Backwaters Tour', 'Exploring Kerala backwaters and culture', 'Kerala', '2025-04-10', '2025-04-17', 35000.00, 'PLANNED');

-- Insert sample flights
INSERT INTO flights (flight_number, airline, origin, destination, departure_time, arrival_time, price, duration, seats_available) VALUES
('AI101', 'Air India', 'Mumbai', 'Delhi', '2025-02-15 08:00:00', '2025-02-15 10:30:00', 5000.00, '2h 30m', 50),
('6E202', 'IndiGo', 'Mumbai', 'Delhi', '2025-02-15 14:00:00', '2025-02-15 16:30:00', 4500.00, '2h 30m', 45),
('SG303', 'SpiceJet', 'Delhi', 'Mumbai', '2025-02-18 10:00:00', '2025-02-18 12:30:00', 4800.00, '2h 30m', 40),
('UK404', 'Vistara', 'Mumbai', 'Bangalore', '2025-02-20 09:00:00', '2025-02-20 11:00:00', 3500.00, '2h 00m', 60),
('G8505', 'GoAir', 'Delhi', 'Bangalore', '2025-02-20 15:00:00', '2025-02-20 17:30:00', 4200.00, '2h 30m', 35),
('AI106', 'Air India', 'Mumbai', 'Goa', '2025-03-01 07:00:00', '2025-03-01 08:30:00', 3000.00, '1h 30m', 80),
('6E207', 'IndiGo', 'Goa', 'Mumbai', '2025-03-07 19:00:00', '2025-03-07 20:30:00', 3200.00, '1h 30m', 75);

-- Insert sample trains
INSERT INTO trains (train_number, train_name, origin, destination, departure_time, arrival_time, price, duration, seats_available) VALUES
('12951', 'Rajdhani Express', 'Mumbai', 'Delhi', '2025-02-15 16:00:00', '2025-02-16 08:00:00', 2500.00, '16h 00m', 100),
('12002', 'Shatabdi Express', 'Delhi', 'Mumbai', '2025-02-18 06:00:00', '2025-02-18 22:00:00', 2200.00, '16h 00m', 80),
('12273', 'Duronto Express', 'Mumbai', 'Bangalore', '2025-02-20 20:00:00', '2025-02-21 10:00:00', 1800.00, '14h 00m', 120),
('12216', 'Garib Rath', 'Delhi', 'Bangalore', '2025-02-20 18:00:00', '2025-02-21 14:00:00', 1500.00, '20h 00m', 150),
('10103', 'Mandovi Express', 'Mumbai', 'Goa', '2025-03-01 22:00:00', '2025-03-02 10:00:00', 800.00, '12h 00m', 200);

-- Insert sample buses
INSERT INTO buses (bus_number, operator, origin, destination, departure_time, arrival_time, price, duration, amenities, seats_available) VALUES
('RB001', 'RedBus', 'Mumbai', 'Delhi', '2025-02-15 20:00:00', '2025-02-16 12:00:00', 1200.00, '16h 00m', 'AC, WiFi, Charging Port', 40),
('VB002', 'Volvo Bus', 'Delhi', 'Mumbai', '2025-02-18 18:00:00', '2025-02-19 10:00:00', 1100.00, '16h 00m', 'AC, Sleeper', 35),
('SB003', 'Sleeper Bus', 'Mumbai', 'Bangalore', '2025-02-20 22:00:00', '2025-02-21 08:00:00', 800.00, '10h 00m', 'Sleeper, AC', 50),
('AB004', 'AC Bus', 'Delhi', 'Bangalore', '2025-02-20 19:00:00', '2025-02-21 15:00:00', 900.00, '20h 00m', 'AC, WiFi', 45),
('GB005', 'Goa Express', 'Mumbai', 'Goa', '2025-03-01 23:00:00', '2025-03-02 11:00:00', 600.00, '12h 00m', 'AC, Entertainment', 48);

-- Insert sample hotels
INSERT INTO hotels (name, location, description, price_per_night, rating, amenities, rooms_available) VALUES
('Taj Palace', 'Delhi', 'Luxury hotel in the heart of New Delhi with world-class amenities', 8000.00, 4.5, 'Pool, Spa, Restaurant, WiFi, Gym', 25),
('Oberoi Mumbai', 'Mumbai', 'Premium hotel with stunning views of Marine Drive', 12000.00, 4.8, 'Pool, Spa, Restaurant, WiFi, Business Center', 20),
('ITC Gardenia', 'Bangalore', 'Elegant hotel in the IT capital with modern facilities', 6000.00, 4.3, 'Pool, Restaurant, WiFi, Gym, Conference Rooms', 30),
('Le Meridien', 'Delhi', 'Contemporary hotel with excellent location and service', 7000.00, 4.2, 'Restaurant, WiFi, Gym, Business Center', 35),
('JW Marriott', 'Mumbai', 'Beachfront luxury hotel with exceptional dining', 9000.00, 4.6, 'Pool, Spa, Restaurant, WiFi, Beach Access', 28),
('Taj West End', 'Bangalore', 'Heritage hotel with beautiful gardens and classic charm', 7500.00, 4.4, 'Pool, Restaurant, WiFi, Garden, Spa', 22),
('Taj Exotica', 'Goa', 'Beachfront resort with stunning ocean views', 10000.00, 4.7, 'Beach Access, Pool, Spa, Restaurant, Water Sports', 40),
('Grand Hyatt', 'Goa', 'Luxury resort with world-class amenities', 8500.00, 4.5, 'Pool, Spa, Restaurant, Beach Access, Golf', 35),
('Backwater Resort', 'Kerala', 'Traditional Kerala houseboat experience', 5000.00, 4.2, 'Backwater View, Traditional Cuisine, Ayurveda Spa', 15),
('Spice Village', 'Kerala', 'Eco-friendly resort in spice plantations', 4500.00, 4.0, 'Nature Walks, Spice Tours, Organic Food', 20);

-- Insert sample expenses
INSERT INTO expenses (user_id, trip_id, category, description, amount, expense_date) VALUES
(1, 1, 'TRANSPORT', 'Flight booking Mumbai to Delhi', 5000.00, '2025-01-15'),
(1, 1, 'ACCOMMODATION', 'Hotel booking in Delhi', 8000.00, '2025-01-15'),
(1, 2, 'TRANSPORT', 'Flight booking Mumbai to Goa', 3000.00, '2025-01-20'),
(2, 3, 'FOOD', 'Restaurant dinner', 1200.00, '2025-01-18'),
(2, 3, 'ENTERTAINMENT', 'Movie tickets', 800.00, '2025-01-18'),
(3, 4, 'SHOPPING', 'Souvenirs and gifts', 2500.00, '2025-01-22');

-- Insert sample budgets
INSERT INTO budgets (user_id, trip_id, category, allocated_amount, spent_amount) VALUES
(1, 1, 'TRANSPORT', 10000.00, 5000.00),
(1, 1, 'ACCOMMODATION', 12000.00, 8000.00),
(1, 1, 'FOOD', 3000.00, 0.00),
(1, 2, 'TRANSPORT', 8000.00, 3000.00),
(1, 2, 'ACCOMMODATION', 20000.00, 0.00),
(1, 2, 'ENTERTAINMENT', 5000.00, 0.00),
(2, 3, 'TRANSPORT', 8000.00, 0.00),
(2, 3, 'ACCOMMODATION', 5000.00, 0.00),
(2, 3, 'FOOD', 2000.00, 1200.00);

-- =====================================================
-- PERFORMANCE OPTIMIZATIONS
-- =====================================================

-- Additional indexes for better query performance
CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_trips_dates ON trips(start_date, end_date);
CREATE INDEX idx_flights_route_time ON flights(origin, destination, departure_time);
CREATE INDEX idx_trains_route_time ON trains(origin, destination, departure_time);
CREATE INDEX idx_buses_route_time ON buses(origin, destination, departure_time);
CREATE INDEX idx_hotels_location_price ON hotels(location, price_per_night);
CREATE INDEX idx_expenses_user_date ON expenses(user_id, expense_date);
CREATE INDEX idx_bookings_user_status ON flight_bookings(user_id, status);

-- =====================================================
-- DATABASE SETUP COMPLETE
-- =====================================================

SELECT 'Travel Planner Database Setup Complete!' as Status;
SELECT COUNT(*) as Total_Users FROM users;
SELECT COUNT(*) as Total_Flights FROM flights;
SELECT COUNT(*) as Total_Hotels FROM hotels;
SELECT COUNT(*) as Total_Trips FROM trips;
