// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse URL-encoded data from POST requests
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
});

// Home route
app.get('/', (req, res) => {
    res.type('text/plain');
    res.send('Welcome to the Home Page');
});

// Contact form route
app.get('/contact', (req, res) => {
    res.type('html');
    res.send(`
        <form method="POST" action="/contact">
            <input type="text" name="name" placeholder="Your name" required />
            <button type="submit">Submit</button>
        </form>
    `);
});

// Form submission handler
app.post('/contact', (req, res) => {
    const name = req.body.name;
    const filepath = path.join(__dirname, 'submissions.txt');

    fs.appendFile(filepath, `Name: ${name}\n`, (err) => {
        if (err) {
            console.error('Error saving submission:', err);
            res.status(500).type('text').send('Server error while saving submission.');
        } else {
            res.type('text').send('Thank you for your submission!');
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).type('text').send('404 Not Found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Contact form available at http://localhost:${PORT}/contact`);
});
