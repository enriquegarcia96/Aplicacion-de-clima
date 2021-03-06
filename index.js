require('dotenv').config( )

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");




const main = async () => {
  const busquedas = new Busquedas();
  let opt;

  do {
    opt = await inquirerMenu();

    switch (opt) {
        case 1:

          //mostrar mensaje
          const termino  = await leerInput('Ciudad: ');

        
          //buscar los lugares
          const lugares =  await busquedas.ciudad(termino);

          
          // seleccionar el lugar
          const id  = await listarLugares(lugares);
          if (id === '0') continue;

          const lugarSel = lugares.find( l => l.id === id );

          // Guardar en DB 
          busquedas.agregarHistorial( lugarSel.nombre );

          // clima
          const obtieneCLima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
          const { desc, max,min,temp } = obtieneCLima;

          //mostrar resultados
          console.clear()
          console.log('\nInformacion de la ciudad\n'.green)
          console.log('Ciudad: ', lugarSel.nombre); 
          console.log('Lat: ', lugarSel.lat );
          console.log('Lng: ', lugarSel.lng);
          console.log('Temperatura: ',temp );
          console.log('Mínima: ', min);
          console.log('Máxima: ', max);
          console.log('Como está el clima: ',desc.green );
            
        break;

        case 2:
          busquedas.historialCapitalizado.forEach((lugar, i) => {
            const idx =  `${i + 1}.`.green;
            console.log(`${ idx } ${lugar}`)
          })
        break;
    

    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
