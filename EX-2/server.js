import express from 'express';
import courses from './course.js'; // assuming it's an array of course objects

const app = express();
const PORT = 3000;

// GET /departments/:dept/courses
app.get('/departments/:dept/courses', (req, res) => {
    const { dept } = req.params;
    const { level, minCredits, maxCredits, semester, instructor } = req.query;

    let filtered = courses.filter(course => course.department === dept);

    // Convert credit values to integers if provided
    const min = minCredits ? parseInt(minCredits) : null;
    const max = maxCredits ? parseInt(maxCredits) : null;

    // Handle invalid credit range
    if (min !== null && max !== null && min > max) {
        return res.status(400).json({ error: 'Invalid credit range: minCredits > maxCredits' });
    } 

    // Apply filters if present
    if (level) {
        filtered = filtered.filter(course => course.level === level);
    }

    if (min !== null) {
        filtered = filtered.filter(course => course.credits >= min);
    }

    if (max !== null) {
        filtered = filtered.filter(course => course.credits <= max);
    }

    if (semester) {
        filtered = filtered.filter(course => course.semester === semester);
    }

    if (instructor) {
        filtered = filtered.filter(course =>
            course.instructor.toLowerCase().includes(instructor.toLowerCase())
        );
    }

    if (filtered.length === 0) {
        return res.status(404).json({ message: 'No matching courses found' });
    }

    res.json(filtered);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log( "http://localhost:3000/departments/CSE/courses" );
    console.log("http://localhost:3000/departments/CSE/courses?level=undergraduate "); 
    console.log("http://localhost:3000/departments/CSE/courses?minCredits=4 "); 
    console.log("http://localhost:3000/departments/CSE/courses?instructor=smith&semester =fall "); 
});

