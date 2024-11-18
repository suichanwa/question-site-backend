const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'https://bogdanescu.netlify.app'], // Allow both localhost and Netlify
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.get('/correct-answers', (req, res) => {
    const filePath = path.join(__dirname, '..', '..', 'public', 'correctAnswers.json');
    res.sendFile(filePath);
});

module.exports.handler = serverless(app);