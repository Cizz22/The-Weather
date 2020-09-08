const map = L.map('map').setView([0, 0], 1);
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">Openstreetmap</a> contributors'

const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, {attribution});
tiles.addTo(map);

getData();

   async function getData(){
        const response = await fetch('/getdata');
        const data = await response.json();
        console.log(data);

        for(item of data){
        const dateString = new Date(item.timestamp).toLocaleString();
        const marker = L.marker([item.lat,item.lon]).addTo(map);
        let popup =  `Cuaca di wilayah ini ${item.weather} dengan suhu ${item.temp}&deg; C, Tanggal : ${dateString}`
        
            if(item.air == null){
                popup += ', Kualitas udara diwilayah ini belum terukur'
                marker.bindPopup(popup);
            }else{
                popup += `, Konsentrasi partikel tertentu(${item.air.parameter}) sebesar ${item.air.value} ${item.air.unit}, Terukur pada tanggal ${item.air.lastUpdated}`
                marker.bindPopup(popup);
            }
            
        }
    };

  