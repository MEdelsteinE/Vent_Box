const router = require('express').Router();
const Vent = require('../models/Vent');
const User = require('../models/User');

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
      const user = await User.findByPk(req.session.user_id);
  
      req.user = user;
    }
  
    next();
  }
  
  router.get('/dashboard', isAuthenticated, authenticate, async (req, res) => {
        try {
            const user_id = req.session.user_id;
            const user = await User.findByPk(user_id, {
                include: Vent
            });
            res.render('dashboard', { user });
        } catch (error) {
            res.status(500).send('Please log in or Register.')
        }
  })


module.exports = router;