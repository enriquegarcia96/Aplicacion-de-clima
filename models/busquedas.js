const axios = require('axios');

class Busquedas {

    historial = ['Tegucigalpa', 'Madrid', 'San José'];

    constructor(){
        //Todo: leer Db si existe
    }


    get paramsMapbox (){
        return {
        
            'access_token':process.env.MAPBOX_KEY,
            'limit':5,
            'language':'es'
            
        }
    }


    get paramsMapboxClima(){
        return{
        
            'units':'metric',
            'lang':'es'
        }
    }



    async ciudad(lugar = ''){

        try {

            // Peticion http
            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });

            const resp = await intance.get();

            // console.log(resp.data.features)

            //me viene un objeto asi que lo recorro con un map 
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch (error) {
            return [];
        }

    }

    async climaLugar(lat, lon){

        try {

            //intance axios.create()
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_KEY}`,
                params: this.paramsMapboxClima
            })

            const respuesta = await instance.get();
            const { weather, main }  = respuesta.data;

         
            //console.log(respuesta)
            return{
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
            }    
            
        } catch (error) {
            console.log(error);
        }

    }

}


module.exports = Busquedas;