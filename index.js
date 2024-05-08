const express = require('express')
//const mysql = require('mysql')
const mysql = require('mysql2');
const bodyparser = require('body-parser')

const app = express()
app.use(bodyparser.json())

const PUERTO = 3977
const conexion = mysql.createConnection(
    {
        host:'viaduct.proxy.rlwy.net',
        database: 'railway',
        user: 'root',
        password: 'gamYKMBstzcxKDyoNfGEyRNPhgvlgTGt',
    }
)

app.listen(PUERTO, ()=>{
    console.log(`SERVIDOR CORRIENDO EN EL PUERTO ${PUERTO}`)
})

conexion.connect(error =>{
    if(error) throw error
    console.log(`CONEXION EXITOSA A LA BASE DE DATOS`);
})

app.get('/',(req,res) =>{
    res.send('API OK')
})



