# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication
*   **POST** `/users/login` - Login user. Returns Token.
*   **POST** `/users` - Register user (Open for demo, restricted in prod).

## Users
*   **GET** `/users/profile` - Get current user profile.
*   **GET** `/users` - Get all users (Admin/Faculty only).

## Attendance
*   **POST** `/attendance` - Mark attendance (Faculty).
*   **GET** `/attendance/student` - Get logged-in student's attendance stats.
*   **GET** `/attendance/class` - Get class attendance report.

## Marks
*   **POST** `/marks` - Upload marks (Faculty).
*   **GET** `/marks/student` - Get student's marks.
*   **GET** `/marks/class` - Get class marks.

## Requests (OD/Leave)
*   **POST** `/requests` - Submit a new request (Student).
*   **GET** `/requests/my` - Get student's request history.
*   **GET** `/requests` - View all requests (Faculty/Admin).
*   **PUT** `/requests/:id` - Approve/Reject request (Faculty/Admin).
    *   Body: `{ "status": "Approved" }`

## Notices
*   **POST** `/notices` - Create announcement (Admin).
*   **GET** `/notices` - Fetch all notices.
