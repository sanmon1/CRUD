const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


require('dotenv').config();

// Traemos el modelo de la Tarea (la receta) para poder usarlo en las rutas
const Tarea = require('./models/Item');

const app = express();



//Indicamos que todo lo que este adentro de public es contenido estatico, es decir, que eso se va a ver en el navegador

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});


//Puerto en el que corre el servidor

const PORT = process.env.PORT || 3000;

// Middleware que permite recibir datos en formato JSON desde el cliente como un formulario.

app.use(express.json());

// ==========================================
//          RUTAS DEL CRUD (Endpoints)
// ==========================================


// 1. CREAR (POST): Guarda una nueva tarea en la base de datos

app.post('/tareas', async (req, res) => {
    try {
        // Creamos la tarea con los datos que nos manda el cliente (req.body)

        const nuevaTarea = new Tarea({
            titulo: req.body.titulo,
            descripcion: req.body.descripcion
        });

        // La guardamos en MongoDB

        const tareaGuardada = await nuevaTarea.save();
        
        // Le devolvemos al cliente la tarea que creo
        res.status(201).json(tareaGuardada);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear la tarea', detalle: error.message });
    }
});

// 2. LEER TODAS (GET): Trae todas las tareas guardadas

app.get('/tareas', async (req, res) => {
    try {
        const tareas = await Tarea.find();
        res.json(tareas); // Devolvemos la lista completa en JSON
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las tareas', detalle: error.message });
    }
});

// 3. ACTUALIZAR (PUT): Modifica una tarea específica usando su ID

app.put('/tareas/:id', async (req, res) => {
    try {
        const tareaActualizada = await Tarea.findByIdAndUpdate(
            req.params.id,       // El ID que viene en la URL
            req.body,            // Los nuevos datos a cambiar
            { new: true }        // Esta opción devuelve la tarea ya modificada
        );
        res.json(tareaActualizada);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar', detalle: error.message });
    }
});

// 4. BORRAR (DELETE): Elimina una tarea usando su ID

app.delete('/tareas/:id', async (req, res) => {
    try {
        await Tarea.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Tarea eliminada correctamente 🗑️' });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al borrar', detalle: error.message });
    }
});

// Conexion a la base de datos mongoDB.


const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mi_primer_crud';

mongoose.connect(mongoURI)
    .then(() => {
        console.log('¡Conexión exitosa a MongoDB! 🍃');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Error al conectar a MongoDB:', err.message);
    });