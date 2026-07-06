# QuakeVision — AI-Powered Earthquake Intelligence Platform

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=flat&logo=react" alt="Frontend: React" />
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=flat&logo=nodedotjs" alt="Backend: Node.js" />
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=flat&logo=mongodb" alt="Database: MongoDB" />
  <img src="https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?style=flat&logo=tailwindcss" alt="Styling: TailwindCSS" />
  <img src="https://img.shields.io/badge/State-Redux_Toolkit-764ABC?style=flat&logo=redux" alt="State: Redux" />
  <img src="https://img.shields.io/badge/Real--time-Socket.IO-010101?style=flat&logo=socketdotio" alt="Real-time: Socket.IO" />
  <img src="https://img.shields.io/badge/Map-Leaflet-199900?style=flat&logo=leaflet" alt="Map: Leaflet" />
</p>

## 🔴 The Problem

Every year, thousands of earthquakes occur globally, causing massive loss of life and infrastructure. However, the existing systems have major flaws:
* **Raw & Complex Data:** Organizations like USGS provide earthquake data, but it is in a raw format that is very difficult for normal people to understand.
* **No Real-time Maps:** There are very few platforms that show live earthquakes on an interactive map in a simple way.
* **No Danger Prediction:** It is hard to look at old earthquake data and predict which areas are in "High Risk" right now.
* **Lack of Instant Alerts:** People do not get instant emergency alerts on their screens when a dangerous earthquake happens.

## 🟢 The Solution

**QuakeVision** was built to solve these exact problems. It is an intelligent platform that makes earthquake tracking simple, visual, and proactive:
* **Interactive Visuals:** We take the complex raw data and show it beautifully on an Interactive World Map and simple charts, making it easy to see the danger zones.
* **AI & Smart Analytics:** Our system automatically analyzes past earthquakes and predicts the Risk Level (Low, Medium, High) for different areas.
* **Real-time Emergency Alerts:** We built a live WebSocket system that instantly flashes emergency alerts on the screen if a severe earthquake hits.
* **Advanced Search:** Users can easily search the history of earthquakes by country, date, depth, or magnitude in just a few clicks.

---

## Project Overview

QuakeVision is an advanced MERN stack based earthquake intelligence and disaster analytics platform.

The platform transforms raw seismic data into meaningful insights through:

* Real-time earthquake monitoring
* Geospatial visualization
* Risk analysis
* Smart analytics dashboards
* Emergency alert systems
* Historical pattern analysis

The main objective of the project is:

```txt
Raw earthquake data → actionable disaster intelligence
```

The dataset already contains important earthquake-related fields such as:

* latitude
* longitude
* magnitude
* depth
* place
* time
* status
* magType
* locationSource
* seismic source information
* update timestamps

---

# API Documentation

The complete API documentation for QuakeVision is available on Postman. It includes all 100+ endpoints with detailed markdown descriptions, parameters, and payloads.

👉 **[View Postman API Documentation](https://documenter.getpostman.com/view/50840515/2sBY4Jv2vS)**

---

# Core Features

## 1. Earthquake Monitoring System

Users can monitor and explore real-time earthquake activity across the world.

Features:

* Real-time earthquake records
* Magnitude tracking
* Depth analysis
* Location tracking
* Earthquake details page

---

## 2. Smart Analytics Dashboard

The analytics dashboard provides visual insights and statistical analysis of seismic activity.

Charts:

* Most affected countries
* Highest magnitude earthquakes
* Monthly earthquake trends
* Magnitude distribution
* Yearly comparison
* Deep vs shallow earthquakes

---

## 3. Interactive World Map

Earthquake events are visualized on an interactive global map.

Features:

* Live earthquake points
* Color-based severity
* Zoom support
* Risk zones
* Heatmap visualization

---

## 4. Earthquake Search System

Users can search and filter earthquake records using advanced filters.

Search filters:

* country
* region
* magnitude
* year
* depth
* status
* type

Example:

```txt
Magnitude > 6
Country = Japan
Depth < 100km
```

---

## 5. AI Risk Prediction System

The platform analyzes seismic activity to estimate regional risk levels and potential danger zones.

Features:

* Low risk
* Medium risk
* High risk
* Danger prediction
* Risk heatmap

---

## 6. Emergency Alert System

The system generates alerts for high-severity seismic events.

Example:

```txt
⚠ High Seismic Activity Detected
```

---

## 7. Safe Zone Recommendation

The platform can recommend safer nearby regions during seismic activity.

---

## 8. Historical Pattern Analysis

Historical seismic records are analyzed to identify recurring risk zones and long-term activity patterns.

Features:

* Repeated danger zones
* Historical comparisons
* Region activity tracking

---

## 9. PDF Report Export

Users can export earthquake analytics and reports in downloadable formats.

---

# Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Redux Toolkit
* Axios
* React Router DOM
* Recharts
* Leaflet Maps

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Socket.IO
* Express Validator
* bcrypt

---

# Backend Folder Structure

```txt
backend/
│
├── src/
│   │
│   ├── config/                # Database, JWT, Socket and app configurations
│   │   ├── db.js              # MongoDB connection setup
│   │   ├── jwt.js             # JWT token configuration
│   │   └── socket.js          # Socket.IO configuration
│   │
│   ├── controllers/           # Main business logic/controllers
│   │   ├── auth.controller.js
│   │   ├── earthquake.controller.js
│   │   ├── analytics.controller.js
│   │   ├── alert.controller.js
│   │   └── admin.controller.js
│   │
│   ├── middlewares/           # Request middlewares
│   │   ├── auth.middleware.js         # JWT authentication middleware
│   │   ├── error.middleware.js        # Global error handling
│   │   ├── logger.middleware.js       # API request logging
│   │   ├── validation.middleware.js   # Request validation
│   │   └── rateLimit.middleware.js    # API rate limiting
│   │
│   ├── models/                # MongoDB schemas/models
│   │   ├── User.js
│   │   ├── Earthquake.js
│   │   ├── Alert.js
│   │   ├── Report.js
│   │   └── Notification.js
│   │
│   ├── routes/                # API route definitions
│   │   ├── auth.routes.js
│   │   ├── earthquake.routes.js
│   │   ├── analytics.routes.js
│   │   ├── alert.routes.js
│   │   └── admin.routes.js
│   │
│   ├── services/              # Reusable business/service logic
│   │   ├── analytics.service.js
│   │   ├── prediction.service.js
│   │   ├── alert.service.js
│   │   └── map.service.js
│   │
│   ├── utils/                 # Helper utility functions
│   │   ├── apiFeatures.js     # Search, filter, sort utilities
│   │   ├── pagination.js      # Pagination utility
│   │   ├── generateToken.js   # JWT token generator
│   │   └── riskCalculator.js  # Risk score calculation logic
│   │
│   ├── validations/           # Input validation schemas
│   │   ├── auth.validation.js
│   │   └── earthquake.validation.js
│   │
│   ├── sockets/               # Real-time socket events
│   │   └── earthquake.socket.js
│   │
│   ├── app.js                 # Express app configuration
│   └── server.js              # Main server entry point
│
├── package.json               # Dependencies and scripts
├── .env                       # Environment variables
├── README.md                  # Project documentation
└── .gitignore                 # Ignored files/folders
```

---

# MongoDB Schema Example

## Earthquake Schema

```js
{
  time,
  latitude,
  longitude,
  depth,
  magnitude,
  magType,
  place,
  status,
  locationSource,
  riskLevel
}
```

---

# Main APIs

## Authentication APIs

```txt
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/profile
```

---

## Earthquake APIs

```txt
GET    /api/v1/earthquakes
GET    /api/v1/earthquakes/:id
GET    /api/v1/earthquakes/filter
GET    /api/v1/earthquakes/search
```

---

## Analytics APIs

```txt
GET /api/v1/analytics/magnitude
GET /api/v1/analytics/countries
GET /api/v1/analytics/risk-zones
GET /api/v1/analytics/yearly-trends
```

---

## Alert APIs

```txt
GET /api/v1/alerts
POST /api/v1/alerts/create
```

---

# Backend Architecture & Concepts

## JWT Authentication

JWT authentication is used to secure protected routes and user sessions.

---

## Aggregation Pipelines

MongoDB aggregation pipelines are used for analytics, trends, and reporting systems.

---

## Geospatial Queries

Geospatial queries are implemented for location-based seismic analysis.

Use:

```js
2dsphere indexing
```

---

## Socket.IO

Socket.IO is used for real-time earthquake alerts and live event updates.

---

# Frontend Pages

## User Pages

* Home
* Dashboard
* Earthquake Details
* Analytics
* Risk Zones
* Reports
* Login/Register

---

## Admin Pages

* Admin Dashboard
* User Management
* Alert Management
* Analytics Overview
* Reports

---

# Deployment

## Frontend

* Vercel

## Backend

* Render / Railway

## Database

* MongoDB Atlas

---

# Future Improvements

* Machine learning prediction
* SMS alerts
* Mobile app
* Government API integration
* Disaster recovery recommendations
* Satellite visualization

---

# Final Goal

QuakeVision is designed to become a scalable disaster intelligence platform capable of:

* Real-time earthquake monitoring
* AI-assisted seismic risk analysis
* Geospatial data visualization
* Emergency alert management
* Historical earthquake analytics
* Advanced dashboard reporting
* Secure and scalable backend architecture

This project is not a basic CRUD application.

It is a full-scale industry-level analytics and disaster monitoring platform built using modern MERN stack technologies.
