import {} from 'dotenv/config';

import express from 'express';
import expressSession from 'express-session'
import path from 'path';
import bodyParser from 'body-parser'


import { DefaultUserFactory } from './database/repositories/user';
import conn from './database/connection';

import  passport from 'passport';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';

import { Auth } from './auth';

class Response {
    constructor(message, error) {
        this.message = message;
        this.error = error;

        return this;
    }
}

const app = express(),
    port = process.env.PORT || 9001,
    userRepository = DefaultUserFactory(),
    defaultErrorResponse = new Response('', 'BadRequest');

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize())
app.use(passport.session())

app.use('/static', express.static(path.resolve(__dirname + '/../public')))
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/index.html'));
});

let auth = new Auth();

let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: auth.getSecret(),
    passReqToCallback: true
};

passport.use(new JwtStrategy(opts, (req, token, done) => {
    try {
        return +req.params.id === token.id ? done(null, token) : done(false);
    } catch (error) {
        done(error);
    }
}))

app.get('/status', (req, res) => {
    res.send('OK')
}) 


// app.post('/checkToken/:id',
// passport.authenticate('jwt', {
//     session: false
// }),
// (req, res) => {
//     res.send('ok');
// });

app.get('/user/:id', function(req, res, next) {
    passport.authenticate('jwt', function(err, user, info) {
      if (err) { return next(err); }
      if (!user || !user.id || +user.id !== +req.params.id) { return res.json(defaultErrorResponse) }
      res.json({
          success: true
      })
    })(req, res, next);
  });

app.post('/register', (req, res) => {
    let errResponse;
    
    userRepository.register(req.body)
        .then(() => res.send('You did it!'))
        .catch((errs) => {
            res.statusCode = 400;
            if (errs.errors.filter(err => {
                return err.validatorKey === 'isEmail'
            }).length> 0) {
                errResponse = new Response(
                    "",
                    "InvalidEmail"
                )
            }
            res.send(errResponse || defaultErrorResponse)
        })
})

app.post('/login', (req, res) => {
    userRepository.login(req.body).then((payload) => {
        auth.set(payload.id).then(token => {
            res.json({token: token});
        });
    }).catch(() => {
        res.send('incorrect username or password');
    })
})

app.listen(port, () => {
    console.log('listening on ' + port)
    start_db();
})

function start_db() {
    return conn.sync().then(() => {
        console.log('made it')
    }).catch(() => {
        console.log('retrying')
        setTimeout(start_db, 10000);
    })
}
process.on('SIGTERM', function() {
    console.log('\ncaught SIGTERM, stopping gracefully');
    process.exit(1);
});