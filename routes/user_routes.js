const router = require('express').Router();

const User = require('../models/User.js');

router.post('/register', async (req, res) => {
  try {
    const user = await User.create(req.body);

    req.session.user_id = user.id;

    res.redirect('/');
  } catch (error) {

    req.session.errors = error.errors.map(errObj => errObj.message);
    res.redirect('/register');
  }
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email
    }
  });
  if (!user) {
    req.session.errors = ['This user does not exist.'];

    return res.redirect('/login');
  }

  const pass_is_valid = await user.validatePass(req.body.password);

  if (!pass_is_valid) {
    req.session.errors = ['Password is incorrect.'];

    return res.redirect('/login');
  }


  req.session.user_id = user.id;

  res.redirect('/');
});

router.get('/logout', (req, res) => {
  req.session.destroy();

  res.redirect('/');
})

module.exports = router;

