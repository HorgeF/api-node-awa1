const express = require('express')
//const mysql = require('mysql')
const mysql = require('mysql2');
const bodyparser = require('body-parser')

const app = express()
app.use(bodyparser.json())

const PUERTO = process.env.PORT || 3977;

const connection = mysql.createConnection({
    port: 13472,
    host: 'viaduct.proxy.rlwy.net',
    database: 'railway',
    user: 'root',
    password: 'gamYKMBstzcxKDyoNfGEyRNPhgvlgTGt',
});

// Middleware para verificar y abrir la conexión
const ensureConnection = (req, res, next) => {
    if (connection.state === 'disconnected') {
        connection.connect((err) => {
            if (err) {
                console.error('Error al conectar con la base de datos:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            console.log('Conexión abierta');
            next();
        });
    } else {
        next();
    }
};

app.listen(PUERTO, ()=>{
    console.log(`SERVIDOR CORRIENDO EN EL PUERTO ${PUERTO}`)
})

app.use(ensureConnection); // Aplica el middleware a todas las rutas

conexion.connect(error =>{
    if(error) throw error
    console.log(`CONEXION EXITOSA A LA BASE DE DATOS`);
})

app.get('/',(req,res) =>{
    res.send('API OK')
})


app.get('/usuarios',(req,res) =>{
    const query = "SELECT * FROM AWA_USUARIOS;"
    connection.query(query,(error,resultado) =>{
        if(error) return console.log(error.message)
        
        if(resultado.length > 0){
            res.json(resultado[0])
        }
    })
})

app.get('/Awa', (req, res) => {
    const sp_nombre = 'DASHBOARD_AWA_CAB';
    const sp_parametro = req.query.id; // Suponiendo que recibes el parámetro desde la consulta HTTP

    // Llama al procedimiento almacenado con el parámetro
    const query = `CALL ${sp_nombre}(${sp_parametro})`;

    connection.query(query, (error, resultado) => {
        if (error) {
            console.error('Error al llamar al procedimiento almacenado:', error.message);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (resultado && resultado.length > 0) {
            res.json(resultado[0]);
        } else {
            res.json({ mensaje: 'No se encontraron resultados' });
        }
    });
});


app.post('/Awa', (req, res) => {
    const sp_nombre = 'REGISTRAR_LOG';
    const sp_parametro = req.body.id; // Obtiene el valor del parámetro 'id' del cuerpo de la solicitud

    // Llama al procedimiento almacenado con el parámetro 'id'
    const query = `CALL ${sp_nombre}(${sp_parametro})`;

    connection.query(query, (error, resultado) => {
        if (error) {
            console.error('Error al llamar al procedimiento almacenado:', error.message);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (resultado && resultado.length > 0) {
            res.json(resultado[0]);
        } else {
            res.json({ mensaje: 'No se encontraron resultados' });
        }
    });
});

app.get('/AwaDetail', (req, res) => {
    const sp_nombre = 'DASHBOARD_AWA_DET';
    const sp_parametro = req.query.id; // Suponiendo que recibes el parámetro desde la consulta HTTP

    // Llama al procedimiento almacenado con el parámetro
    const query = `CALL ${sp_nombre}(${sp_parametro})`;

    connection.query(query, (error, resultado) => {
        if (error) {
            console.error('Error al llamar al procedimiento almacenado:', error.message);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (resultado && resultado.length > 0) {
            res.json(resultado[0]);
        } else {
            res.json({ mensaje: 'No se encontraron resultados' });
        }
    });
});
