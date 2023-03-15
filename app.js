const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs')
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3306;


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('index');
});

app.listen(PORT, function () {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});



app.get('/locales', (req, res) => {
    res.render('locales');
});


app.get('/clientes', function(req, res) {
    res.render('clientes');
  });







app.post('/pedidos', function (req, res) {
    const nombre = req.body.nombre;
    const direccion = req.body.direccion;
    const telefono = req.body.telefono;
    const productos = req.body.productos;

    const connection = mysql.createConnection({
    host: 'localhost',
    user: 'carin',
    password: '',
    database: 'new connection2'
});
    connection.query('SELECT * FROM mi_tabla', (err, results) => {
        if (err) {
            console.error(err);
        } else {
            console.log(results);
        }
    });
    
    connection.end();
    // Guardar el pedido en la base de datos
    // ...

    res.send('¡Pedido recibido!');
});



