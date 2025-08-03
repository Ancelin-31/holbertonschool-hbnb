# HBNB

## Overview

HBNB is a simplified clone of the Airbnb platform, designed as a learning project to demonstrate full-stack web development, RESTful API design, and object-oriented programming in Python. The project is structured to separate concerns between models, services, persistence, and API layers, and a complete front-end interface.

## Features

## Back-end

- User registration and profile management
- Place listing with price, location, and description
- Amenity management and association with places
- User reviews and ratings for places
- RESTful API endpoints for all major resources

## Front-end

- Homepage (index.html): Displays all places with filterable amenities and price ranges
- Login page (login.html): User authentication interface
- Place details (place.html):
- View detailed information about a specific place
- Filter reviews by price
- Add a new review directly from the UI

## Project Structure

### Back-end

```text
part3/hbnb/
├── app/
│   ├── api/           # API namespaces and routes
│   ├── models/        # Data models (User, Place, Amenity, Review)
│   ├── persistence/   # Repository and data storage logic
│   ├── services/      # Business logic and facade
├── config.py          # Configuration settings
├── requirements.txt   # Python dependencies
├── run.py             # Application entry point
├── README.md
```

### Front-end

```text
part4/hbnb/
├── styles.css         # Style for the front-end
├── scripts.js         # Scripts file
├── index.html         # Home Page
├── login.html         # Login Page
├── place.html         # Place Page
├── add_review.html    # Add review page
├── images/            # Folder for images
```

## Getting Started

### Prerequisites

- Python 3.8+
- Flask==3.1.1
- flask-restx==1.3.0
- (Recommended) [virtualenv](https://virtualenv.pypa.io/en/latest/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd part3/hbnb
   ```

2. **Create and activate a virtual environment:**

   ```bash
   python3 -m venv mon_env
   source mon_env/bin/activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

```bash
python run.py
```

The API will be available at `http://localhost:5000/`.
Front-end can be opened by launching index.html, login.html, and place.html from the templates/ directory in your browser
You have to launch an http server by the command :
```bash
python3 -m http.server
```

### Running Tests

```bash
python -m app.api.v1.test
```

## API Endpoints

- `POST /api/v1/users/` — Create a new user
- `GET /api/v1/users/` — List all users
- `GET /api/v1/users/<user_id>` — Get a specific user
- `PUT /api/v1/users/<user_id>` — Update a user
- `DELETE /api/v1/users/<user_id>` — Delete a user

Similar endpoints exist for places, amenities, and reviews.

## Front-End Usage

### Homepage (index.html):
- Displays all available places
- Filter by price range and amenities
- Responsive layout for mobile and desktop

### Login Page (login.html):
- Allows users to log in
- Interacts with back-end authentication endpoints

### Place Details (place.html):
- View extended place information
- Filter reviews by price
- Add reviews through a dynamic form

## Conclusion

This project was built for educational purposes to explore full-stack development using Python and JavaScript, structured APIs, and user-centric UI design.

---

Project by Holberton School students : Ancelin and Dorine.
