const express = require('express');
const session = require('express-session');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');

const app = express();

app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

const strategy = new OAuth2Strategy(
  {
    authorizationURL: 'https://auth-server-ss2425.onrender.com/authorize',
    tokenURL: 'https://auth-server-ss2425.onrender.com/api/token',
    clientID: 'a',
    clientSecret: 'a',
    callbackURL: 'http://localhost:3001/auth/provider/callback',
    state: true,
    customHeaders: {
      Authorization: 'Basic ' + Buffer.from('70357_70369:client').toString('base64'),
    }
  },
  (accessToken, refreshToken, profile, cb) => {
    const user = { accessToken, refreshToken };
    return cb(null, user);
  }
);

passport.use('provider', strategy);

// Routes
app.get('/', (req, res) => res.redirect('/auth/provider'));

app.get('/auth/provider', (req, res, next) => {
  passport.authenticate('provider', {
    scope: 'email',
    prompt: 'login',
  })(req, res, next);
});

app.get(
  '/auth/provider/callback',
  passport.authenticate('provider', { failureRedirect: '/' }),
  (req, res) => {
    res.send(`Logged in! Access Token: ${req.user.accessToken}`);
  }
);

// Start server
app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
