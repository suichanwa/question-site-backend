const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors({
    origin: ['http://localhost:3000', 'https://bogdanescu.netlify.app'], // Allow both localhost and Netlify
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.post('/save-answers', (req, res) => {
    const { name, surname, answers } = req.body;
    const data = `Name: ${name}\nSurname: ${surname}\nAnswers:\n${answers.join('\n')}\n\n`;
    const filePath = path.join(__dirname, 'answers.txt');

    fs.appendFile(filePath, data, (err) => {
        if (err) {
            console.error('Failed to save answers:', err);
            return res.status(500).send('Failed to save answers.');
        }
        res.send('Answers saved successfully!');
    });
});

app.post('/get-answers', (req, res) => {
    const { name, surname } = req.body;
    const filePath = path.join(__dirname, 'answers.txt');

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

app.get('/correct-answers', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'correctAnswers.json');
    res.sendFile(filePath);
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});