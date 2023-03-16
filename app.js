const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mysql = require('mysql2');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3300;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer({ storage: storage });

// Conexión a la base de datos
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '4321',
  
});

// Verificar si la conexión fue exitosa antes de iniciar el servidor
connection.connect(function(err) {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos exitosa');
  app.listen(PORT, function () {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
  });
});

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/clientes', function (req, res) {
  res.render('clientes');
});

app.get('/locales', function (req, res) {
  res.render('locales');
});

app.post('/productos', upload.single('imagen'), function (req, res) {
  const nombre = req.body.nombre;
  const descripcion = req.body.descripcion;
  const precio = req.body.precio;
  const imagen = req.file;

  // Insertar los datos del formulario en la tabla de productos
  connection.query('INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES (?, ?, ?, ?)', [nombre, descripcion, precio, imagen.filename], function (err, result) {
    if (err) throw err;
    console.log('Producto insertado en la base de datos');
  });

  // Redirigir al usuario a la página de productos
  res.redirect('/clientes');
});

app.get('/clientes', function (req, res) {
  // Obtener todos los productos de la tabla
  connection.query('SELECT * FROM productos', function (err, results) {
    if (err) throw err;

    // Renderizar la vista de productos con los datos obtenidos
    res.render('productos', { productos: results });
  });
});

// Cerrar la conexión a la base de datos cuando se cierra la aplicación
process.on('SIGINT', function() {
  connection.end(function() {
    console.log('Conexión a la base de datos cerrada');
    process.exit(0);
  });
});
