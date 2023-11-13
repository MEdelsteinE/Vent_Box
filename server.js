const express = require('express');
const db = require('./config/connection');

const { engine } = require('express-handlebars');

const session = require('express-session');


const view_routes = require('./routes/view_routes');
const user_routes = require('./routes/user_routes');
const vent_routes = require('./routes/vents_routes');
const dashboard_routes = require('./routes/dashboard_routes');


const PORT = process.env.PORT || 3333;


const app = express();


app.use(express.static('./public'));


app.use(express.urlencoded({ extended: false }));

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');


app.use(session({
  secret: 'some secret key',
  resave: false,
  saveUninitialized: true
}));


app.use('/', [view_routes, vent_routes, dashboard_routes]);

app.use('/auth', user_routes);


db.sync({ force: false })
  .then(() => {
    app.listen(PORT, () => console.log('Server is running on port', PORT));
  });