const fs = require('fs');

const axios = require('axios');



class Busquedas {

    historial = [];

    dbPath = './db/database.json';
    

    constructor(){
        // leer Db si existe
        this.leerDB();
    }


    get historialCapitalizado(){
        //capitalizar cada palabra
        return this.historial.map( lugar =>{

            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) )

            return palabras.join(' ')

        } )
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

    //.- encargado de hacer la grabacion del historial .-//
    agregarHistorial( lugar = '' ) {

        // prevvenir duplicados
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }

        this.historial = this.historial.splice(0,5)

        this.historial.unshift( lugar.toLocaleLowerCase() );

        //Grabar en DB
        this.guardarDB();



    }


    guardarDB(){

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));

    }

    //.- leer el archivo JSON .-//
    leerDB(){

        //Debe de existir
        if (!fs.existsSync(this.dbPath)) return ;
        

        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});

        //.- transforma el String  a un formato JSON 
        const data = JSON.parse(info);
        
        this.historial = data.historial
    }


}


module.exports = Busquedas;