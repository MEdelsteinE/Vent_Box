// Import express
const express = require('express');
const db = require('./config/connection');

const { engine } = require('express-handlebars');

const session = require('express-session');

// Import our view_routes
const view_routes = require('./routes/view_routes');
const user_routes = require('./routes/user_routes');
const vent_routes = require('./routes/vents_routes');
const dashboard_routes = require('./routes/dashboard_routes');

// Create the port number and prepare for heroku with the process.env.PORT value
const PORT = process.env.PORT || 3333;

// Create the server app
const app = express();

// Open the static channel for our browser assets - ie. express.static on the public folder
app.use(express.static('./public'));

// Allow json to be sent from the client
// app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

// Load session middleware
app.use(session({
  secret: 'some secret key',
  resave: false,
  saveUninitialized: true
}));

// Load our view routes at the root level '/'
app.use('/', [view_routes, vent_routes]);
// /auth/register
app.use('/auth', user_routes, dashboard_routes);

// Sync and create tables
db.sync({ force: false })
  .then(() => {
    // Start the server and log the port that it started on
    app.listen(PORT, () => console.log('Server is running on port', PORT));
  });