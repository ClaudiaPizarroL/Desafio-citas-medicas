//Requiriendo los paquetes externos y los deposito en una variable
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const _ = require('lodash');
const chalk = require('chalk'); //intalo la version 4 ya que estoy usando require.
const express = require('express');

//Instancio express y lo llamo app
const app = express();

// Levantar el servidor en el puerto especificado
app.listen(3000, () => {
    console.log(`Servidor en ejecución en el puerto 3000`);
});

// Creo arrays para almacenar a los usuarios por género
let users = {
    male: [],
    female: [],
};

// Función para registrar usuarios utilizando la API Random User
async function registerUser() {
    // Consultar 10 usuarios aleatorios de la API Random User usando axios
    const response = await axios.get('https://randomuser.me/api/?results=10');
    const usersData = response.data.results;

    // Recorrer cada usuario obtenido
    usersData.forEach(userData => {
        // Generar ID único para cada usuario usando UUID considerando los 6 primeros caracteres.
        const id = uuidv4().slice(0, 6);

        // Obtener el timestamp de la fecha actual usando moment
        const timestamp = moment().format('MMMM Do YYYY, h:mm:ss a');

        // Obtener el nombre, apellido y género del usuario
        const nombre = userData.name.first;
        const apellido = userData.name.last;
        const genero = userData.gender;

        // Crear un objeto para el usuario
        const user = {
            nombre,
            apellido,
            id,
            timestamp,
        };

        // Almacenar el usuario en la lista según su género
        users[genero].push(user);
    });
}


// Ruta para consultar todos los usuarios registrados
app.get('/users', async (req, res) => {
    // Dividir la lista de usuarios en hombres y mujeres
    const hombres = users.male;
    const mujeres = users.female;

    // Imprimir en la consola la lista de usuarios con color
    console.log(chalk.blue.bgWhite('Hombres:'));
    hombres.forEach(user => {
        console.log(chalk.blue.bgWhite(`Nombre: ${user.nombre} - Apellido: ${user.apellido} - ID: ${user.id} - Timestamp: ${user.timestamp}`));
    });

    console.log(chalk.blue.bgWhite('Mujeres:'));
    mujeres.forEach(user => {
        console.log(chalk.blue.bgWhite(`Nombre: ${user.nombre} - Apellido: ${user.apellido} - ID: ${user.id} - Timestamp: ${user.timestamp}`));
    });

    // Enviar la lista de usuarios al cliente
    res.json({ hombres, mujeres });
});

// Registrar usuarios cada cierto intervalo (puedes ajustar el tiempo)
setInterval(registerUser, 2000);

//NO PUDE USAR LODASH, AL INTENTAR ESCRIBIR EL CODIGO NO LOGRABA IMPRIMIR EL ARREGLO CON LOS USUARIOS. POR 
//LO QUE LO AGRUPE POR GENERO CON ARREGLOS SIMPLES. 






