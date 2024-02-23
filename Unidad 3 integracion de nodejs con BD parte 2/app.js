var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');

require('dotenv').config();
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var loginRouter = require('./routes/admin/login');

var historiaRouter = require('./routes/historia');

var visitanosRouter = require('./routes/visitanos');

var adminRouter = require('./routes/admin/novedades');

var recuperoRouter = require('./routes/admin/recupero');

var iniciarSessionRoter = require('./routes/admin/login')

var registroRoter = require('./routes/admin/registro');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: '123456789',
  resave: false,
  saveUninitialized: true
}));

secured = async (req,res,next) => {
  try {
    console.log(req.session.id_usuario);
    if (req.session.id_usuario){
      next();
    } else {
      res.redirect('/admin/login')
    }
  } catch (error){
    console.log(error);
  }
}


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin/login', loginRouter);
app.use('/admin/novedades', secured , adminRouter);


app.get('/', function(req,res){
  var conocido = Boolean(req.session.nombre);
  res.render('index', {
    title: 'VISITAS & DEGUSTACIONES',
    conocido: conocido,
    nombre: req.session.nombre,
    edad:req.session.edad,
    mail:req.session.mail
  });
});


app.post('/ingresar', function(req,res){
  var nombre = req.body.nombre;
  var edad = req.body.edad;
  var mail = req.body.mail;
  if (req.body.nombre){
    req.session.nombre = req.body.nombre
  }
  if (req.body.edad>=18){
    req.session.edad = 'Cumple le edad requerida 18+'
    req.session.mail = 'Le llega la invitación al mail ingresado para coordinar visita.'
  } else {req.session.edad = 'No puede entrar por no tener 18+'}

  res.redirect('/');
});

app.get ('/salir', function(req,res){
  req.session.destroy();
  res.redirect('/');
});













app.use('/recupero', recuperoRouter);
app.use('/historia', historiaRouter);
app.use('/visitanos', visitanosRouter);
app.use('/login', iniciarSessionRoter);
app.use('/registro', registroRoter);






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;



