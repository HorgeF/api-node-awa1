const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

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

app.listen(PUERTO, () => {
    console.log(`SERVIDOR CORRIENDO EN EL PUERTO ${PUERTO}`);
    
    // Define las rutas después de asegurarte de que la conexión se haya establecido
    app.use(ensureConnection); // Aplica el middleware a todas las rutas


    //GETS##############################################################################

    app.get('/', (req, res) => {
        res.send('API OK');
    });


    app.get('/usuarios',(req,res) =>{
        const query = "SELECT * FROM AWA_USUARIOS;"
        connection.query(query,(error,resultado) =>{
            if(error) return console.log(error.message)
            
            if(resultado.length > 0){
                res.json(resultado)
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


    //###################################################################################

    
    app.post('/Awa', (req, res) => {
        const sp_nombre = 'REGISTRAR_LOG';
        const sp_parametro = req.body.id; // Obtiene el valor del parámetro 'id' del cuerpo de la solicitud
    
        // Llama al procedimiento almacenado con el parámetro 'id'
        //const query = `CALL ${sp_nombre}(${sp_parametro})`;
        const query = `CALL ${sp_nombre}(?)`;
        
        connection.query(query,[sp_parametro], (error, resultado) => {
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

    
    
    //-------------------------------------------------------------------

    app.post('/Usuario/Registrar', (req, res) => {
        const sp_nombre = 'REGISTRAR_USUARIO';
        
        const sp_parametro1 = req.body.USUARIO;
        const sp_parametro2 = req.body.CONTRASENIA;
        const sp_parametro3 = req.body.USU_NOMBRE;
        const sp_parametro4 = req.body.USU_SEXO;
        const sp_parametro5 = req.body.USU_FECHA_NACIMIENTO;
        const sp_parametro6 = req.body.USU_EDAD;
        const sp_parametro7 = req.body.USU_PESO;
        const sp_parametro8 = req.body.USU_TALLA;
        const sp_parametro9 = req.body.USU_CORREO;
        const sp_parametro10 = req.body.USU_CELULAR;

        console.log(sp_parametro1)
    
        // Llama al procedimiento almacenado con el parámetro 'id'
        const query = `CALL ${sp_nombre}(?,?,?,?,?,?,?,?,?,?,@RESULTADO)`;    
        connection.query(query,[sp_parametro1,sp_parametro2,
                                sp_parametro3,sp_parametro4,
                                sp_parametro5,sp_parametro6,
                                sp_parametro7,sp_parametro8,
                                sp_parametro9,sp_parametro10], (error, resultado) => {
            if (error) {
                console.error('Error al llamar al procedimiento almacenado:', error.message);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            // Fetch the output parameter value by executing another query
            connection.query('SELECT @RESULTADO as outputValue', (err, result) => {
                if (err) {
                    console.error('Error fetching output parameter:', err.stack);
                    return res.status(500).send('Error fetching data from the database');
                }
                
                if (result && result.length > 0) {
                    res.json(result[0]);
                } else {
                    res.json({ mensaje: 'Ocurrió un error, no se pudo registrar, intente nuevamente' });
                } 
            });

        });
    });

    app.post('/Usuario/Editar', (req, res) => {
        const sp_nombre = 'EDITAR_USUARIO';
        
        const sp_parametro = req.body.id;
        const sp_parametro1 = req.body.USUARIO;
        const sp_parametro2 = req.body.CONTRASENIA;
        const sp_parametro3 = req.body.USU_NOMBRE;
        const sp_parametro4 = req.body.USU_SEXO;
        const sp_parametro5 = req.body.USU_FECHA_NACIMIENTO;
        const sp_parametro6 = req.body.USU_EDAD;
        const sp_parametro7 = req.body.USU_PESO;
        const sp_parametro8 = req.body.USU_TALLA;
        const sp_parametro9 = req.body.USU_CORREO;
        const sp_parametro10 = req.body.USU_CELULAR;
    
        // Llama al procedimiento almacenado con el parámetro 'id'
        const query = `CALL ${sp_nombre}(?,?,?,?,?,?,?,?,?,?,?,@RESULTADO)`;
    
        connection.query(query,[sp_parametro,sp_parametro1,
                                sp_parametro2,sp_parametro3,
                                sp_parametro4,sp_parametro5,
                                sp_parametro6,sp_parametro7,
                                sp_parametro8,sp_parametro9,
                                sp_parametro10], (error, resultado) => {
            if (error) {
                console.error('Error al llamar al procedimiento almacenado:', error.message);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
    
            // Fetch the output parameter value by executing another query
            connection.query('SELECT @RESULTADO as outputValue', (err, result) => {
                if (err) {
                    console.error('Error fetching output parameter:', err.stack);
                    return res.status(500).send('Error fetching data from the database');
                }
                
                if (result && result.length > 0) {
                    res.json(result[0]);
                } else {
                    res.json({ mensaje: 'Ocurrió un error, no se pudo actualizar intente nuevamente' });
                } 
            });

        });
    });

    app.post('/Login', (req, res) => {
        const sp_nombre = 'LOGIN_USUARIO';
        const sp_parametro1 = req.body.USUARIO;
        const sp_parametro2 = req.body.CONTRASENIA; // Obtiene el valor del parámetro 'id' del cuerpo de la solicitud
    
        // Llama al procedimiento almacenado con el parámetro 'id'
        const query = `CALL ${sp_nombre}(?,?,@RESULTADO)`;
    
        connection.query(query,[sp_parametro1,sp_parametro2], (error, resultado) => {
            if (error) {
                console.error('Error al llamar al procedimiento almacenado:', error.message);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
    
           // Fetch the output parameter value by executing another query
           connection.query('SELECT @RESULTADO as outputValue', (err, result) => {
            if (err) {
                console.error('Error fetching output parameter:', err.stack);
                return res.status(500).send('Error fetching data from the database');
            }
            
            if (result && result.length > 0) {
                res.json(result[0]);
            } else {
                res.json({ mensaje: 'Ocurrió un error, no se puede iniciar sesión, intente nuevamente' });
            } 
            });
        });
    });


    app.post('/Login/Reset', (req, res) => {
        const sp_nombre = 'RESET_PASS';
         const sp_parametro1 = req.body.USUARIO;
        const sp_parametro2 = req.body.CONTRASENIA; // Obtiene el valor del parámetro 'id' del cuerpo de la solicitud
    
        // Llama al procedimiento almacenado con el parámetro 'id'
        const query = `CALL ${sp_nombre}(?,?,@RESULTADO)`;
    
        connection.query(query,[sp_parametro1,sp_parametro2], (error, resultado) => {
            if (error) {
                console.error('Error al llamar al procedimiento almacenado:', error.message);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
    
           // Fetch the output parameter value by executing another query
           connection.query('SELECT @RESULTADO as outputValue', (err, result) => {
            if (err) {
                console.error('Error fetching output parameter:', err.stack);
                return res.status(500).send('Error fetching data from the database');
            }
            
            if (result && result.length > 0) {
                res.json(result[0]);
            } else {
                res.json({ mensaje: 'Ocurrió un error, no se puede resetear la clave, intente nuevamente' });
            } 
            });
        });
    });

    app.post('/CalculaAgua', (req, res) => {
        const sp_nombre = 'CALCULA_AGUA';
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





});
