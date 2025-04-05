const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main page with EJS
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Attendance Calculator',
    copyrightYear: new Date().getFullYear(),
    developers: [
      { name: 'S. Bhargav', rollNumber: '23211A67A7' },
      { name: 'M. Abhiram', rollNumber: '23211A6774' }
    ]
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).render('error', { 
    message: 'Page not found',
    error: { status: 404 }
  });
});

// Set port
const PORT = process.env.PORT || 3001;

// Start server
app.listen(PORT, () => {
  const serverUrl = `http://localhost:${PORT}`;
  console.log(`
========================================================
  Attendance Calculator App Running
  
  Access your application at: ${serverUrl}
  Press Ctrl+C to stop the server
========================================================
`);
  console.log(`Server URL: ${serverUrl}`);
}); 