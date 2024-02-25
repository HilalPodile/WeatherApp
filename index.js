const express = require('express');
const app = express();
const https = require('https');
require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const BASE_URL = process.env.URL; // Accessing URL from .env file

app.listen(3000, () => {
    console.log('Server is running at port: 3000');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.post('/', (req, res) =>{
    const { cityName } = req.body;
    const URL = `${BASE_URL}&q=${encodeURIComponent(cityName)}`;
    https.get(URL, (response) => {
        response.on('data', (data) =>{
            const weatherData = JSON.parse(data);

            fs.readFile(path.join(__dirname, 'result.html'), 'utf8', (err, htmlContent) => {
                if (err) {
                    console.error('Error reading HTML file:', err);
                    return res.status(500).send('Error reading HTML file');
                }

                // Replace placeholders with dynamic data
                htmlContent = htmlContent.replace('<span id="cityname"></span>', cityName);
                htmlContent = htmlContent.replace('<span id="temp"></span>', weatherData.current.temp_c);

                // Send the modified HTML content as the response
                res.send(htmlContent);
            });
        })
    })
})

module.exports = app;
