# Attendance Calculator

A simplified web application that helps students calculate their attendance percentage and determine how many additional classes they need to attend to reach their required attendance percentage.

## Features

- Calculate current attendance percentage
- Determine additional classes needed to reach a required attendance percentage
- Generate a suggested schedule for attending classes
- Fully client-side calculations with no database dependency
- Simple and intuitive interface
- Mobile-responsive design

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation Steps

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/attendance-calculator.git
   cd attendance-calculator
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

4. Access the application:
   Open your browser and visit `http://localhost:3001`

## How to Use

1. Fill in the following information:
   - Total classes held
   - Classes attended
   - Required attendance percentage (e.g., 75)
   - Last updated day (the day of the week when you last updated your attendance)
   - Classes per day for each weekday

2. Click "Calculate" to see:
   - Your current attendance percentage
   - Number of additional classes needed to reach your target
   - A suggested schedule of which classes to attend

## Technologies Used

- Node.js
- Express
- EJS (Embedded JavaScript templates)
- Vanilla JavaScript
- CSS for styling

## Project Structure

```
attendance-calculator/
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── views/
│   ├── partials/
│   │   ├── attendance-form.ejs
│   │   ├── head.ejs
│   │   └── results.ejs
│   ├── error.ejs
│   └── index.ejs
├── server.js
├── package.json
└── README.md
```

## Developers

- S. Bhargav (23211A67A7)
- M. Abhiram (23211A6774) 