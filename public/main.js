
let lat, lon, temp, weather,air;

const map = L.map('map').setView([0, 0], 1);
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">Openstreetmap</a> contributors'

const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, {attribution});
tiles.addTo(map);



const button = document.getElementById('submit');
button.addEventListener('click', async event => {   
    const data = {lat, lon, temp, weather, air};
    
    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        };
    
    const response = await fetch('/api', options);
    const json = await response.json();
    console.log(json);
});

if ('geolocation' in navigator) {
navigator.geolocation.getCurrentPosition(async position => {
    try{
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    document.getElementById('lat').textContent = lat;
    document.getElementById('lon').textContent = lon;
        

    const api_url = `/weather/${lat}/${lon}`;
    const response = await fetch(api_url);
    const json = await response.json();
    const {cuaca , udara} = json;
    temp = cuaca.current.temp;
    weather = cuaca.current.weather[0].description;
    console.log(json);
    
    // document.getElementById('cuaca').textContent = cuaca.current.weather[0].description;
    // document.getElementById('temp').textContent = cuaca.current.temp;
    // document.getElementById('udara_para').textContent = aq.parameter;
    // document.getElementById('udara_value').textContent = aq.value;
    // document.getElementById('udara_unit').textContent = aq.unit;
    // document.getElementById('udara_date').textContent = aq.lastUpdated;
    const dt = new Date(cuaca.current.dt).toLocaleString();
    const popup = `Cuaca hari ini adalah ${weather} dengan suhu ${temp}&deg;C`;
    const marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup(popup).openPopup();
    air = udara.results[0].measurements[0];
} catch(error){
    air = null;
    console.log(error);
}
});
    } 
    
    else {
    console.log('geolocation not available');
    }
