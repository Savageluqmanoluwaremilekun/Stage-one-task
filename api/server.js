const http = require ("http");
const express = require('express');
const requestIp = require('request-ip');
const axios = require('axios');
const app = express();
const port = 3000;

const server = http.createServer(app);


const getLocationByIp = async (ip) => {
    try {
        const response = await axios.get(`https://ipinfo.io/${ip}/json?token=${'f8a1c9ec02f29c'}`);
        const { city } = response.data;
        return city;
        
    } catch (error) {
        console.error('Error fetching location:', error.message);
        return 'Unknown Location';
    }
};

const getCurrentTemperature = async (cityName) => {
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${"8dde891ed18be0230b3d93d6cf2459a7"}&units=metric`);
        const temperature = response.data.main.temp;
        return temperature;
    } catch (error) {
        console.error('Error fetching weather:', error.message);
     return 'Unknown';
    }
};

app.get('/api/hello', async (req, res) => {
    const clientIp = requestIp.getClientIp(req);
    const cityName = await getLocationByIp(clientIp);
    const visitorName = req.query.visitor_name;
    const temperature = await getCurrentTemperature(cityName)

    res.json({
        'client ip': clientIp,
        'location': cityName,
        'greeting': `Hello, ${visitorName}!, the temperature is ${temperature} degrees celcius in ${cityName}`
      
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
