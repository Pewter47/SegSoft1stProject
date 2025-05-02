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
    authorizationURL: 'https://authorization-server-71911-71903.onrender.com/oauth/authorize',
    tokenURL: 'https://authorization-server-71911-71903.onrender.com/oauth/token',
    clientID: '57ebef80-22f7-41eb-9533-aedb14aec9b3',
    clientSecret: 'e46da553-a31a-4e16-869e-113e3fd08450',
    callbackURL: 'http://localhost:3001/auth/provider/callback',
    state: true,
    customHeaders: {
      Authorization: 'Basic ' + Buffer.from('57ebef80-22f7-41eb-9533-aedb14aec9b3:e46da553-a31a-4e16-869e-113e3fd08450').toString('base64'),
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
