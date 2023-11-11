// Create an express router instance object
const router = require('express').Router();
const User = require('../models/User');
const Vent = require('../models/Vent');

// Block an auth page if user is already logged in
function isLoggedIn(req, res, next) {
  if (req.session.user_id) {
    return res.redirect('/');
  }

  next();
}

// Block a route if a user is not logged in
function isAuthenticated(req, res, next) {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }

  next();
}

// Attach user data to the request if they are logged in
async function authenticate(req, res, next) {
  const user_id = req.session.user_id;

  if (user_id) {
    const user = await User.findByPk(req.session.user_id, {
      attributes: ['id', 'email']
    });

    req.user = user.get({ plain: true });
  }

  next();
}

// Add one test GET route at root - localhost:3333/
router.get('/', authenticate, async (req, res) => {
  const vents = await Vent.findAll({
    include: {
      model: User,
      as: 'author'
    }
  });

  const ventsData = vents.map(c => c.get({ plain: true }))
  console.log(ventsData);

  res.render('dashboard', {
    user: req.user,
    vents: ventsData
  });
});

// GET route to show the register form
router.get('/register', isLoggedIn, authenticate, (req, res) => {
  // Render the register form template
  res.render('register_form', {
    errors: req.session.errors,
    user: req.user
  });

  req.session.errors = [];
});

// GET route to show the login form
router.get('/login', isLoggedIn, authenticate, (req, res) => {
  // Render the register form template
  res.render('login_form', {
    errors: req.session.errors,
    user: req.user
  });

  req.session.errors = [];
});

// Show a Vent
router.get('/vent', isAuthenticated, authenticate, (req, res) => {
  res.render('vent_form', {
    user: req.user
  });

  req.session.errors = [];
});

module.exports = router;