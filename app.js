const express = require('express');
const app = express();
const cors = require('cors');

// seteamos el puerto
app.set('port', process.env.PORT || 4000);

// configuramos el limite de Post
app.use(express.json({limit: '50mb'})); 
app.use(express.urlencoded({limit: '50mb'}));
// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use('/companias', require('./controllers/companias.controller'));
app.use('/zonas', require('./controllers/zonas.controller'));
app.use('/lugarod', require('./controllers/lugarOD.controller'));
app.use('/liquidacionimp', require('./controllers/liquidacionImp.controller'));
app.use('/tarifas', require('./controllers/tarifas.controller'));
app.use('/roles', require('./controllers/roles.controller'));
app.use('/servicios', require('./controllers/servicios.controller'));
module.exports = app;