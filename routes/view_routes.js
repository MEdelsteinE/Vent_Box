const router = require('express').Router();
const User = require('../models/User');
const Vent = require('../models/Vent');

function isLoggedIn(req, res, next) {
  if (req.session.user_id) {
    return res.redirect('/');
  }

  next();
}

function isAuthenticated(req, res, next) {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }

  next();
}

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

router.get('/register', isLoggedIn, authenticate, (req, res) => {
  res.render('register_form', {
    errors: req.session.errors,
    user: req.user
  });

  req.session.errors = [];
});

router.get('/login', isLoggedIn, authenticate, (req, res) => {
  // Render the register form template
  res.render('login_form', {
    errors: req.session.errors,
    user: req.user
  });

  req.session.errors = [];
});

router.get('/vent', isAuthenticated, authenticate, (req, res) => {
  res.render('vent_form', {
    user: req.user
  });

  req.session.errors = [];
});

module.exports = router;