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

app.post('/get-answers', (req, res) => {
    const { name, surname } = req.body;
    const filePath = path.join(__dirname, '..', '..', 'answers.txt');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to read answers:', err);
            return res.status(500).send('Failed to read answers.');
        }

        const regex = new RegExp(`Name: ${name}\\nSurname: ${surname}\\nAnswers:\\n([\\s\\S]*?)\\n\\n`, 'g');
        const match = regex.exec(data);

        if (match) {
            res.send(`Your answers:\n${match[1]}`);
        } else {
            res.send('No answers found for the given name and surname.');
        }
    });
});

module.exports.handler = serverless(app);