const express = require('express');
const app = express();
const fs = require('fs');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config()


app.listen(3000, () => console.log('listening 3000'));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}))
app.set('view engine', 'ejs');

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/', (req,res) => {
    res.render('index');
})

app.post('/api', (req,res) => {
    const data = req.body;
    console.log(data);
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    res.json(data);
});

app.get('/api', (req,res) => {
    res.render('all');
})

app.get('/getdata' ,(req,res) => {
    database.find({}, (err,data) => {
        if(err){
            res.end()
            return;
        }
        res.json(data); 
    })  
});

app.get('/weather/:lat/:lon' ,async (req,res) => {
const lat = req.params.lat;
const lon = req.params.lon;

const api_key = process.env.API_KEY;
const cuaca_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&lang=id&units=metric&
exclude=hourly,daily&appid=${api_key}`;
const cuaca_response = await fetch(cuaca_url);
const cuaca_data = await cuaca_response.json();

const udara_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
const udara_response = await fetch(udara_url);
const udara_data = await udara_response.json();

const data = {
    cuaca : cuaca_data,
    udara : udara_data
};

res.json(data);
});
