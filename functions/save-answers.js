const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: ['http://localhost:3000', 'https://bogdanescu.netlify.app'], // Allow both localhost and Netlify
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.post('/save-answers', (req, res) => {
    const { name, surname, answers } = req.body;
    const data = `Name: ${name}\nSurname: ${surname}\nAnswers:\n${answers.join('\n')}\n\n`;
    const filePath = path.join(__dirname, '..', '..', 'answers.txt');

    fs.appendFile(filePath, data, (err) => {
        if (err) {
            console.error('Failed to save answers:', err);
            return res.status(500).send('Failed to save answers.');
        }
        res.send('Answers saved successfully!');
    });
});

module.exports.handler = serverless(app);